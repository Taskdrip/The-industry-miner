import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db, integrationCredentialsTable } from "@workspace/db";
import { logger } from "./logger";

export const integrationProviders = [
  {
    providerId: "paystack",
    label: "Paystack",
    category: "payments",
    description: "Nigerian naira checkout, payment verification, and signed webhooks.",
    canTest: true,
  },
  {
    providerId: "paystack_webhook",
    label: "Paystack webhook signing secret",
    category: "payments",
    description: "Optional current-format webhook signature key from Paystack.",
    canTest: false,
  },
  {
    providerId: "resend",
    label: "Resend",
    category: "notifications",
    description: "Transactional email receipts and platform notifications.",
    canTest: true,
  },
  {
    providerId: "openrouter",
    label: "OpenRouter",
    category: "ai",
    description: "One API key for a broad catalog of AI models.",
    canTest: true,
  },
  {
    providerId: "openai",
    label: "OpenAI",
    category: "ai",
    description: "OpenAI models and API services.",
    canTest: true,
  },
  {
    providerId: "anthropic",
    label: "Anthropic",
    category: "ai",
    description: "Claude models through the Anthropic API.",
    canTest: true,
  },
  {
    providerId: "gemini",
    label: "Google Gemini",
    category: "ai",
    description: "Gemini models through Google's Generative Language API.",
    canTest: true,
  },
  {
    providerId: "mistral",
    label: "Mistral",
    category: "ai",
    description: "Mistral models through the Mistral API.",
    canTest: true,
  },
  {
    providerId: "deepseek",
    label: "DeepSeek",
    category: "ai",
    description: "DeepSeek models through the DeepSeek API.",
    canTest: true,
  },
] as const;

export type IntegrationProviderId = (typeof integrationProviders)[number]["providerId"];
type ProviderCategory = "payments" | "notifications" | "ai";
type ConnectionStatus = "not_configured" | "unverified" | "connected" | "error";

const providerById = new Map(integrationProviders.map((provider) => [provider.providerId, provider]));

function getEncryptionKey(): Buffer {
  const masterSecret = process.env.SESSION_SECRET;
  if (!masterSecret) {
    throw new Error("SESSION_SECRET is required to encrypt integration credentials.");
  }
  return Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(masterSecret, "utf8"),
      Buffer.from("industry-miner-provider-vault-v1", "utf8"),
      Buffer.from("aes-256-gcm", "utf8"),
      32,
    ),
  );
}

export function encryptCredential(value: string): {
  ciphertext: string;
  iv: string;
  authTag: string;
} {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("hex"),
    authTag: cipher.getAuthTag().toString("hex"),
  };
}

export function decryptCredential(row: {
  ciphertext: string;
  iv: string;
  authTag: string;
}): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(row.iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(row.authTag, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(row.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function isIntegrationProviderId(value: string): value is IntegrationProviderId {
  return providerById.has(value as IntegrationProviderId);
}

export async function getIntegrationCredential(
  providerId: IntegrationProviderId,
  options: { requireEnabled?: boolean } = {},
): Promise<{ apiKey: string; senderEmail: string | null } | null> {
  const [row] = await db
    .select()
    .from(integrationCredentialsTable)
    .where(eq(integrationCredentialsTable.providerId, providerId));

  if (!row || (options.requireEnabled !== false && !row.enabled)) return null;
  return {
    apiKey: decryptCredential(row),
    senderEmail: row.senderEmail,
  };
}

export async function listIntegrationSettings() {
  const rows = await db.select().from(integrationCredentialsTable);
  const rowsByProvider = new Map(rows.map((row) => [row.providerId, row]));

  return integrationProviders.map((provider) => {
    const row = rowsByProvider.get(provider.providerId);
    const status = row
      ? (row.connectionStatus as ConnectionStatus)
      : "not_configured";
    return {
      ...provider,
      category: provider.category as ProviderCategory,
      configured: Boolean(row),
      enabled: row?.enabled ?? false,
      status,
      lastTestedAt: row?.lastTestedAt ?? null,
      updatedAt: row?.updatedAt ?? null,
      senderEmail: row?.senderEmail ?? null,
    };
  });
}

export async function testIntegrationCredential(
  providerId: IntegrationProviderId,
  apiKey: string,
): Promise<boolean> {
  if (providerId === "paystack_webhook") return false;

  const config: Record<string, { url: string; headers: Record<string, string> }> = {
    paystack: {
      url: "https://api.paystack.co/balance",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
    resend: {
      url: "https://api.resend.com/domains",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
    openrouter: {
      url: "https://openrouter.ai/api/v1/auth/key",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
    openai: {
      url: "https://api.openai.com/v1/models",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
    anthropic: {
      url: "https://api.anthropic.com/v1/models?limit=1",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    },
    gemini: {
      url: "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1",
      headers: { "x-goog-api-key": apiKey },
    },
    mistral: {
      url: "https://api.mistral.ai/v1/models",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
    deepseek: {
      url: "https://api.deepseek.com/models",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  };
  const target = config[providerId];
  if (!target) return false;

  try {
    const response = await fetch(target.url, {
      method: "GET",
      headers: target.headers,
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function sendPaymentReceiptEmail(input: {
  to: string;
  reference: string;
  productName: string;
  amountKobo: number;
}): Promise<boolean> {
  try {
    const resend = await getIntegrationCredential("resend");
    if (!resend) return false;
    if (!resend.senderEmail) {
      logger.warn({ reference: input.reference }, "Resend is enabled without a verified sender address");
      return false;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `payment-receipt-${input.reference}`,
      },
      body: JSON.stringify({
        from: resend.senderEmail,
        to: [input.to],
        subject: `Payment received — ${input.productName}`,
        text: [
          `Thank you for your payment for ${input.productName}.`,
          `Amount: ₦${(input.amountKobo / 100).toLocaleString("en-NG")}`,
          `Reference: ${input.reference}`,
          "",
          "You can access your learning dashboard from The Industry Miner website.",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      logger.warn(
        { reference: input.reference, statusCode: response.status },
        "Resend could not deliver a payment receipt",
      );
      return false;
    }
    return true;
  } catch {
    logger.warn({ reference: input.reference }, "Resend payment receipt could not be sent");
    return false;
  }
}

import { eq } from "drizzle-orm";
import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import {
  db,
  integrationCredentialsTable,
} from "@workspace/db";
import {
  DeleteAdminIntegrationParams,
  ListAdminIntegrationsResponse,
  SaveAdminIntegrationBody,
  SaveAdminIntegrationParams,
  SaveAdminIntegrationResponse,
  TestAdminIntegrationParams,
  TestAdminIntegrationResponse,
  UpdateAdminIntegrationBody,
  UpdateAdminIntegrationParams,
  UpdateAdminIntegrationResponse,
} from "@workspace/api-zod";
import {
  decryptCredential,
  encryptCredential,
  integrationProviders,
  listIntegrationSettings,
  testIntegrationCredential,
} from "../lib/integration-secrets";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Not an admin" });
    return;
  }
  next();
}

function requireSameOrigin(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get("origin");
  if (!origin) {
    next();
    return;
  }
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.get("host");
  try {
    if (!host || new URL(origin).host !== host) {
      res.status(403).json({ error: "Cross-origin credential changes are not allowed" });
      return;
    }
  } catch {
    res.status(403).json({ error: "Invalid request origin" });
    return;
  }
  next();
}

router.get(
  "/admin/integrations",
  requireAdmin,
  async (_req: Request, res: Response): Promise<void> => {
    const response = ListAdminIntegrationsResponse.parse(await listIntegrationSettings());
    res.json(response);
  },
);

router.put(
  "/admin/integrations/:providerId",
  requireAdmin,
  requireSameOrigin,
  async (req: Request, res: Response): Promise<void> => {
    const params = SaveAdminIntegrationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Unknown provider" });
      return;
    }
    const parsed = SaveAdminIntegrationBody.safeParse(req.body);
    if (!parsed.success || (!parsed.data.apiKey && !parsed.data.senderEmail)) {
      res.status(400).json({ error: "Enter a provider key or a sender email address" });
      return;
    }
    if (parsed.data.senderEmail && params.data.providerId !== "resend") {
      res.status(400).json({ error: "Sender email is only used by Resend" });
      return;
    }

    const [existing] = await db
      .select()
      .from(integrationCredentialsTable)
      .where(eq(integrationCredentialsTable.providerId, params.data.providerId));
    if (!parsed.data.apiKey && !existing) {
      res.status(404).json({ error: "Add the Resend API key before setting its sender email" });
      return;
    }

    try {
      const encrypted = parsed.data.apiKey
        ? encryptCredential(parsed.data.apiKey.trim())
        : null;
      const provider = integrationProviders.find((item) => item.providerId === params.data.providerId);
      const nextStatus = encrypted
        ? provider?.canTest
          ? "unverified"
          : "connected"
        : existing?.connectionStatus ?? "unverified";
      const values = {
        ...(encrypted ?? {}),
        providerId: params.data.providerId,
        ...(parsed.data.senderEmail !== undefined ? { senderEmail: parsed.data.senderEmail } : {}),
        ...(encrypted ? { enabled: false, connectionStatus: nextStatus } : {}),
        updatedBy: req.user.id,
        updatedAt: new Date(),
      };
      await db
        .insert(integrationCredentialsTable)
        .values({
          providerId: params.data.providerId,
          ciphertext: encrypted?.ciphertext ?? existing!.ciphertext,
          iv: encrypted?.iv ?? existing!.iv,
          authTag: encrypted?.authTag ?? existing!.authTag,
          senderEmail: parsed.data.senderEmail ?? existing?.senderEmail ?? null,
          enabled: encrypted ? false : (existing?.enabled ?? false),
          connectionStatus: nextStatus,
          updatedBy: req.user.id,
        })
        .onConflictDoUpdate({
          target: integrationCredentialsTable.providerId,
          set: values,
        });
      const settings = await listIntegrationSettings();
      const setting = settings.find((item) => item.providerId === params.data.providerId);
      res.json(SaveAdminIntegrationResponse.parse(setting));
    } catch {
      res.status(503).json({ error: "Credential encryption is unavailable. Check the server secret configuration." });
    }
  },
);

router.post(
  "/admin/integrations/:providerId/test",
  requireAdmin,
  requireSameOrigin,
  async (req: Request, res: Response): Promise<void> => {
    const params = TestAdminIntegrationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Unknown provider" });
      return;
    }
    const provider = integrationProviders.find((item) => item.providerId === params.data.providerId);
    if (!provider?.canTest) {
      res.status(400).json({ error: "This signing secret is checked when Paystack delivers a webhook." });
      return;
    }

    const [row] = await db
      .select()
      .from(integrationCredentialsTable)
      .where(eq(integrationCredentialsTable.providerId, params.data.providerId));
    if (!row) {
      res.status(404).json({ error: "Provider credential not found" });
      return;
    }

    let success = false;
    try {
      success = await testIntegrationCredential(
        params.data.providerId,
        decryptCredential(row),
      );
    } catch {
      success = false;
    }
    await db
      .update(integrationCredentialsTable)
      .set({
        enabled: success ? row.enabled : false,
        connectionStatus: success ? "connected" : "error",
        lastTestedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(integrationCredentialsTable.id, row.id));

    const response = TestAdminIntegrationResponse.parse({
      success,
      message: success
        ? "Connection verified. Enable this provider when you are ready to use it."
        : "The provider rejected this key or the account lacks the required access. Check it and try again.",
    });
    res.json(response);
  },
);

router.patch(
  "/admin/integrations/:providerId",
  requireAdmin,
  requireSameOrigin,
  async (req: Request, res: Response): Promise<void> => {
    const params = UpdateAdminIntegrationParams.safeParse(req.params);
    const parsed = UpdateAdminIntegrationBody.safeParse(req.body);
    if (!params.success || !parsed.success) {
      res.status(400).json({ error: "Invalid provider setting" });
      return;
    }
    const [row] = await db
      .select()
      .from(integrationCredentialsTable)
      .where(eq(integrationCredentialsTable.providerId, params.data.providerId));
    if (!row) {
      res.status(404).json({ error: "Provider credential not found" });
      return;
    }
    const provider = integrationProviders.find((item) => item.providerId === params.data.providerId);
    if (parsed.data.enabled && provider?.canTest && row.connectionStatus !== "connected") {
      res.status(400).json({ error: "Test this provider successfully before enabling it" });
      return;
    }
    if (parsed.data.enabled && params.data.providerId === "resend" && !row.senderEmail) {
      res.status(400).json({ error: "Set a sender email address before enabling Resend" });
      return;
    }

    await db
      .update(integrationCredentialsTable)
      .set({ enabled: parsed.data.enabled, updatedAt: new Date() })
      .where(eq(integrationCredentialsTable.id, row.id));
    res.json(
      UpdateAdminIntegrationResponse.parse(
        (await listIntegrationSettings()).find((item) => item.providerId === params.data.providerId),
      ),
    );
  },
);

router.delete(
  "/admin/integrations/:providerId",
  requireAdmin,
  requireSameOrigin,
  async (req: Request, res: Response): Promise<void> => {
    const params = DeleteAdminIntegrationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Unknown provider" });
      return;
    }
    const deleted = await db
      .delete(integrationCredentialsTable)
      .where(eq(integrationCredentialsTable.providerId, params.data.providerId))
      .returning({ id: integrationCredentialsTable.id });
    if (!deleted.length) {
      res.status(404).json({ error: "Provider credential not found" });
      return;
    }
    res.status(204).end();
  },
);

export default router;

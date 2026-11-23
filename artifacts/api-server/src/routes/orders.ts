import { and, desc, eq, ilike } from "drizzle-orm";
import crypto from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  coursesTable,
  ordersTable,
  usersTable,
  type Order,
} from "@workspace/db";
import {
  CreateOrderBody,
  CreateOrderResponse,
  ListMyOrdersResponse,
  PaystackWebhookInput,
  VerifyOrderPaymentParams,
  VerifyOrderPaymentResponse,
} from "@workspace/api-zod";
import {
  getIntegrationCredential,
  sendPaymentReceiptEmail,
} from "../lib/integration-secrets";

const router: IRouter = Router();
const PAYSTACK_API = "https://api.paystack.co";
const JEWELLERY_MASTERCLASS_PRICE_KOBO = 10_000_000;

type PaystackResponse<T> = {
  status: boolean;
  data?: T;
};

type PaystackTransaction = {
  reference?: string;
  authorization_url?: string;
  status?: string;
  amount?: number;
  currency?: string;
};

function requestOrigin(req: Request): string {
  const proto = req.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const host = req.get("x-forwarded-host")?.split(",")[0]?.trim() || req.get("host");
  if (!host) throw new Error("Request host is unavailable");
  return `${proto}://${host}`;
}

function rawBody(req: Request): Buffer | null {
  return (req as Request & { rawBody?: Buffer }).rawBody ?? null;
}

function safeCompareHex(expected: Buffer, candidate: string): boolean {
  if (!/^[a-f0-9]+$/i.test(candidate) || candidate.length !== expected.length * 2) {
    return false;
  }
  return crypto.timingSafeEqual(expected, Buffer.from(candidate, "hex"));
}

function isValidLegacySignature(body: Buffer, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha512", secret).update(body).digest();
  return safeCompareHex(expected, signature);
}

function isValidCurrentSignature(body: Buffer, header: string, secret: string): boolean {
  let timestamp: number | null = null;
  const signatures: string[] = [];
  for (const segment of header.split(",")) {
    const separator = segment.indexOf("=");
    if (separator < 0) continue;
    const key = segment.slice(0, separator).trim();
    const value = segment.slice(separator + 1).trim();
    if (key === "t") {
      if (timestamp !== null || !/^\d+$/.test(value)) return false;
      timestamp = Number(value);
    } else if (key === "v1") {
      const colon = value.indexOf(":");
      if (colon >= 0) signatures.push(value.slice(colon + 1));
    }
  }

  if (
    timestamp === null ||
    signatures.length === 0 ||
    Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300
  ) {
    return false;
  }
  const expected = crypto
    .createHmac("sha512", secret)
    .update(`${timestamp}.`)
    .update(body)
    .digest();
  return signatures.some((signature) => safeCompareHex(expected, signature));
}

async function completeOrder(order: Order): Promise<Order> {
  if (order.status === "completed") return order;
  const [updated] = await db
    .update(ordersTable)
    .set({ status: "completed", updatedAt: new Date() })
    .where(and(eq(ordersTable.id, order.id), eq(ordersTable.status, "pending")))
    .returning();
  if (!updated) {
    const [latest] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, order.id));
    return latest ?? order;
  }

  const [user] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, updated.userId));
  if (user?.email) {
    await sendPaymentReceiptEmail({
      to: user.email,
      reference: updated.reference,
      productName: updated.productName,
      amountKobo: updated.amountKobo,
    });
  }
  return updated;
}

router.post("/orders", async (req: Request, res: Response): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (Boolean(parsed.data.courseId) === Boolean(parsed.data.productCode)) {
    res.status(400).json({ error: "Choose one course or product to purchase" });
    return;
  }

  const credential = await getIntegrationCredential("paystack");
  if (!credential) {
    res.status(503).json({ error: "Paystack checkout is not enabled by an admin" });
    return;
  }

  let course: typeof coursesTable.$inferSelect | undefined;
  let productCode = "course";
  let productName = "";
  let amountKobo = 0;

  if (parsed.data.courseId) {
    [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, parsed.data.courseId));
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    if (course.isFree) {
      res.status(400).json({ error: "Free courses do not use paid checkout" });
      return;
    }
    productName = course.title;
    amountKobo = course.priceCents;
  } else {
    productCode = "jewellery-masterclass";
    productName = "Jewellery Business Masterclass";
    amountKobo = JEWELLERY_MASTERCLASS_PRICE_KOBO;
    [course] = await db
      .select()
      .from(coursesTable)
      .where(ilike(coursesTable.title, "%jewellery%"))
      .limit(1);
    if (course) {
      productName = course.title;
      amountKobo = course.priceCents;
    }
  }

  if (!Number.isSafeInteger(amountKobo) || amountKobo <= 0) {
    res.status(400).json({ error: "This product does not have a valid price" });
    return;
  }

  const email = req.user.email || parsed.data.email;
  if (!email) {
    res.status(400).json({ error: "Add an email address to your account before checkout" });
    return;
  }

  const reference = `TIM-${Date.now()}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
  let checkout: PaystackResponse<PaystackTransaction>;
  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credential.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: String(amountKobo),
        currency: "NGN",
        reference,
        callback_url: `${requestOrigin(req)}/payment/complete`,
        metadata: JSON.stringify({
          userId: req.user.id,
          courseId: course?.id ?? null,
          productCode,
        }),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    checkout = (await response.json()) as PaystackResponse<PaystackTransaction>;
    if (!response.ok || !checkout.status || !checkout.data?.authorization_url) {
      res.status(502).json({ error: "Paystack could not start this checkout" });
      return;
    }
  } catch {
    res.status(502).json({ error: "Paystack is temporarily unavailable. Try again shortly." });
    return;
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId: req.user.id,
      courseId: course?.id ?? null,
      productCode,
      productName,
      paymentProvider: "paystack",
      amountKobo,
      status: "pending",
      reference,
    })
    .returning();

  res.status(201).json(
    CreateOrderResponse.parse({
      order,
      authorizationUrl: checkout.data.authorization_url,
    }),
  );
});

router.get("/orders", async (req: Request, res: Response): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, req.user.id))
    .orderBy(desc(ordersTable.createdAt));

  res.json(ListMyOrdersResponse.parse(orders));
});

router.post(
  "/orders/:reference/verify",
  async (req: Request, res: Response): Promise<void> => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const parsed = VerifyOrderPaymentParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid payment reference" });
      return;
    }
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(and(
        eq(ordersTable.reference, parsed.data.reference),
        eq(ordersTable.userId, req.user.id),
      ));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (order.status === "completed") {
      res.json(VerifyOrderPaymentResponse.parse(order));
      return;
    }
    if (order.paymentProvider !== "paystack") {
      res.status(400).json({ error: "This order is not a Paystack checkout" });
      return;
    }

    const credential = await getIntegrationCredential("paystack");
    if (!credential) {
      res.status(503).json({ error: "Paystack is not enabled" });
      return;
    }

    try {
      const response = await fetch(
        `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(order.reference)}`,
        {
          headers: { Authorization: `Bearer ${credential.apiKey}` },
          signal: AbortSignal.timeout(15_000),
        },
      );
      const result = (await response.json()) as PaystackResponse<PaystackTransaction>;
      if (!response.ok || !result.status || !result.data) {
        res.status(502).json({ error: "Paystack could not verify this payment" });
        return;
      }

      const transaction = result.data;
      if (transaction.status !== "success") {
        if (transaction.status === "failed" || transaction.status === "abandoned") {
          await db
            .update(ordersTable)
            .set({ status: "failed", updatedAt: new Date() })
            .where(and(eq(ordersTable.id, order.id), eq(ordersTable.status, "pending")));
        }
        const [latest] = await db.select().from(ordersTable).where(eq(ordersTable.id, order.id));
        res.json(VerifyOrderPaymentResponse.parse(latest ?? order));
        return;
      }

      if (
        transaction.reference !== order.reference ||
        transaction.amount !== order.amountKobo ||
        transaction.currency !== "NGN"
      ) {
        res.status(409).json({ error: "Payment details do not match this order" });
        return;
      }
      const completed = await completeOrder(order);
      res.json(VerifyOrderPaymentResponse.parse(completed));
    } catch {
      res.status(502).json({ error: "Paystack is temporarily unavailable. Try verification again." });
    }
  },
);

router.post(
  "/paystack/webhook",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = PaystackWebhookInput.safeParse(req.body);
    const body = rawBody(req);
    if (!parsed.success || !body) {
      res.status(400).json({ error: "Invalid webhook request" });
      return;
    }

    const apiCredential = await getIntegrationCredential("paystack");
    const webhookCredential = await getIntegrationCredential("paystack_webhook");
    const currentSignature = req.get("paystack-signature");
    const legacySignature = req.get("x-paystack-signature");
    const signatureValid =
      Boolean(
        currentSignature &&
        webhookCredential &&
        isValidCurrentSignature(body, currentSignature, webhookCredential.apiKey),
      ) ||
      Boolean(
        legacySignature &&
        apiCredential &&
        isValidLegacySignature(body, legacySignature, apiCredential.apiKey),
      );

    if (!signatureValid) {
      res.status(apiCredential || webhookCredential ? 401 : 503).json({
        error: apiCredential || webhookCredential
          ? "Invalid Paystack webhook signature"
          : "Paystack is not enabled",
      });
      return;
    }

    if (parsed.data.event === "charge.success") {
      const data = parsed.data.data;
      const reference = typeof data.reference === "string" ? data.reference : null;
      const amount = typeof data.amount === "number" ? data.amount : null;
      const currency = typeof data.currency === "string" ? data.currency : null;
      if (reference) {
        const [order] = await db
          .select()
          .from(ordersTable)
          .where(eq(ordersTable.reference, reference));
        if (order && amount === order.amountKobo && currency === "NGN") {
          await completeOrder(order);
        }
      }
    }
    res.status(200).json({ received: true });
  },
);

export default router;

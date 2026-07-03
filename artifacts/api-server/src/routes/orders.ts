import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { db, coursesTable, ordersTable } from "@workspace/db";
import { CreateOrderBody, CreateOrderResponse, ListMyOrdersResponse } from "@workspace/api-zod";

const router: IRouter = Router();

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

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, parsed.data.courseId));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const reference = `TIM-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId: req.user.id,
      courseId: course.id,
      amountKobo: course.priceCents,
      status: "pending",
      reference,
    })
    .returning();

  res.status(201).json(CreateOrderResponse.parse(order));
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

export default router;

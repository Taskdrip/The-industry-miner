import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, asc, and } from "drizzle-orm";
import {
  db,
  courseResourcesTable,
  ordersTable,
  coursesTable,
  courseCurriculumModulesTable,
  courseLessonsTable,
} from "@workspace/db";

const VALID_RESOURCE_TYPES = ["video", "pdf", "download", "link"] as const;

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

// Helper: check for a completed (paid) order
async function hasCompletedOrder(userId: string, courseId: number): Promise<boolean> {
  const [order] = await db
    .select({ id: ordersTable.id })
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.userId, userId),
        eq(ordersTable.courseId, courseId),
        eq(ordersTable.status, "completed"),
      ),
    )
    .limit(1);
  return !!order;
}

// GET /courses/:courseId/resources — completed-order users or admin
router.get(
  "/courses/:courseId/resources",
  async (req: Request, res: Response): Promise<void> => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId)) {
      res.status(400).json({ error: "Invalid courseId" });
      return;
    }

    if (req.user.role !== "admin") {
      if (!(await hasCompletedOrder(req.user.id, courseId))) {
        res.status(403).json({ error: "Not enrolled in this course" });
        return;
      }
    }

    const resources = await db
      .select()
      .from(courseResourcesTable)
      .where(eq(courseResourcesTable.courseId, courseId))
      .orderBy(asc(courseResourcesTable.position), asc(courseResourcesTable.createdAt));

    res.json(resources);
  },
);

// GET /dashboard/courses/:courseId — enrolled user or admin: full course with modules + ordered lessons
router.get(
  "/dashboard/courses/:courseId",
  async (req: Request, res: Response): Promise<void> => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId)) {
      res.status(400).json({ error: "Invalid courseId" });
      return;
    }

    // Enrollment check — require completed (paid) order; admins bypass
    if (req.user.role !== "admin") {
      if (!(await hasCompletedOrder(req.user.id, courseId))) {
        res.status(403).json({ error: "Not enrolled in this course" });
        return;
      }
    }

    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId));
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const modules = await db
      .select()
      .from(courseCurriculumModulesTable)
      .where(eq(courseCurriculumModulesTable.courseId, courseId))
      .orderBy(asc(courseCurriculumModulesTable.position));

    const lessons = await db
      .select()
      .from(courseLessonsTable)
      .where(eq(courseLessonsTable.courseId, courseId))
      .orderBy(asc(courseLessonsTable.position));

    const curriculum = modules.map((m) => ({
      ...m,
      lessons: lessons.filter((l) => l.moduleId === m.id),
    }));

    res.json({ ...course, curriculum });
  },
);

// GET /dashboard — user's enrolled courses with course details
router.get(
  "/dashboard",
  async (req: Request, res: Response): Promise<void> => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Only show courses the user has a completed (paid) order for
    const orders = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.userId, req.user.id), eq(ordersTable.status, "completed")));

    if (orders.length === 0) {
      res.json({ enrolledCourses: [] });
      return;
    }

    const courseIds = [...new Set(orders.map((o) => o.courseId))];
    const allCourses = await db.select().from(coursesTable);
    const enrolled = allCourses.filter((c) => courseIds.includes(c.id));

    res.json({
      enrolledCourses: enrolled.map((course) => {
        const order = orders.find((o) => o.courseId === course.id);
        return {
          ...course,
          enrolledAt: order?.createdAt,
          orderStatus: order?.status,
        };
      }),
    });
  },
);

// POST /admin/courses/:courseId/resources
router.post(
  "/admin/courses/:courseId/resources",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId)) {
      res.status(400).json({ error: "Invalid courseId" });
      return;
    }

    const { title, url, type, description, position } = req.body as {
      title?: unknown;
      url?: unknown;
      type?: unknown;
      description?: unknown;
      position?: unknown;
    };

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "title is required" });
      return;
    }
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ error: "url is required" });
      return;
    }

    const resourceType =
      typeof type === "string" && (VALID_RESOURCE_TYPES as readonly string[]).includes(type) ? type : "link";

    const [resource] = await db
      .insert(courseResourcesTable)
      .values({
        courseId,
        title: title.trim(),
        url: url.trim(),
        type: resourceType,
        description: typeof description === "string" ? description.trim() || null : null,
        position: typeof position === "number" ? position : 0,
      })
      .returning();

    res.status(201).json(resource);
  },
);

// PATCH /admin/resources/:id
router.patch(
  "/admin/resources/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const { title, url, type, description, position } = req.body as {
      title?: unknown;
      url?: unknown;
      type?: unknown;
      description?: unknown;
      position?: unknown;
    };

    const updates: Record<string, unknown> = {};
    if (typeof title === "string" && title.trim()) updates.title = title.trim();
    if (typeof url === "string" && url.trim()) updates.url = url.trim();
    if (type !== undefined) {
      if (typeof type !== "string" || !(VALID_RESOURCE_TYPES as readonly string[]).includes(type)) {
        res.status(400).json({ error: `type must be one of: ${VALID_RESOURCE_TYPES.join(", ")}` });
        return;
      }
      updates.type = type;
    }
    if (typeof description === "string") updates.description = description.trim() || null;
    if (typeof position === "number") updates.position = position;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    const [resource] = await db
      .update(courseResourcesTable)
      .set(updates)
      .where(eq(courseResourcesTable.id, id))
      .returning();

    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    res.json(resource);
  },
);

// DELETE /admin/resources/:id
router.delete(
  "/admin/resources/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [resource] = await db
      .delete(courseResourcesTable)
      .where(eq(courseResourcesTable.id, id))
      .returning();

    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    res.status(204).send();
  },
);

export default router;

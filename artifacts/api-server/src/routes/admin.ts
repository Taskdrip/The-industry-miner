import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, sql } from "drizzle-orm";
import {
  db,
  coursesTable,
  courseCurriculumModulesTable,
  courseLessonsTable,
} from "@workspace/db";
import {
  CreateCourseModuleBody,
  CreateCourseModuleResponse,
  CreateLessonBody,
  CreateLessonResponse,
  UpdateLessonBody,
  UpdateLessonResponse,
} from "@workspace/api-zod";

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

router.post(
  "/admin/courses/:courseId/modules",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId)) {
      res.status(400).json({ error: "Invalid courseId" });
      return;
    }

    const [course] = await db
      .select({ id: coursesTable.id })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId));
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const parsed = CreateCourseModuleBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [module_] = await db
      .insert(courseCurriculumModulesTable)
      .values({
        courseId,
        title: parsed.data.title,
        lessonsCount: 0,
        position: parsed.data.position ?? 0,
      })
      .returning();

    res.status(201).json(CreateCourseModuleResponse.parse(module_));
  },
);

router.post(
  "/admin/modules/:moduleId/lessons",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const moduleId = Number(req.params.moduleId);
    if (!Number.isInteger(moduleId)) {
      res.status(400).json({ error: "Invalid moduleId" });
      return;
    }

    const [module_] = await db
      .select()
      .from(courseCurriculumModulesTable)
      .where(eq(courseCurriculumModulesTable.id, moduleId));
    if (!module_) {
      res.status(404).json({ error: "Module not found" });
      return;
    }

    const parsed = CreateLessonBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [lesson] = await db
      .insert(courseLessonsTable)
      .values({
        moduleId,
        courseId: module_.courseId,
        title: parsed.data.title,
        contentUrl: parsed.data.contentUrl ?? null,
        durationMinutes: parsed.data.durationMinutes ?? 10,
        position: parsed.data.position ?? 0,
        isPreview: parsed.data.isPreview ?? false,
      })
      .returning();

    await db
      .update(courseCurriculumModulesTable)
      .set({ lessonsCount: sql`${courseCurriculumModulesTable.lessonsCount} + 1` })
      .where(eq(courseCurriculumModulesTable.id, moduleId));

    res.status(201).json(CreateLessonResponse.parse(lesson));
  },
);

router.patch(
  "/admin/modules/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const { title } = req.body as { title?: unknown };
    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const [module_] = await db
      .update(courseCurriculumModulesTable)
      .set({ title: title.trim() })
      .where(eq(courseCurriculumModulesTable.id, id))
      .returning();

    if (!module_) {
      res.status(404).json({ error: "Module not found" });
      return;
    }

    res.json({ id: module_.id, title: module_.title, lessonsCount: module_.lessonsCount });
  },
);

router.delete(
  "/admin/modules/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    // Delete all lessons in the module first
    await db
      .delete(courseLessonsTable)
      .where(eq(courseLessonsTable.moduleId, id));

    const [module_] = await db
      .delete(courseCurriculumModulesTable)
      .where(eq(courseCurriculumModulesTable.id, id))
      .returning();

    if (!module_) {
      res.status(404).json({ error: "Module not found" });
      return;
    }

    res.status(204).send();
  },
);

router.patch(
  "/admin/lessons/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = UpdateLessonBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [lesson] = await db
      .update(courseLessonsTable)
      .set(parsed.data)
      .where(eq(courseLessonsTable.id, id))
      .returning();

    if (!lesson) {
      res.status(404).json({ error: "Lesson not found" });
      return;
    }

    res.json(UpdateLessonResponse.parse(lesson));
  },
);

router.delete(
  "/admin/lessons/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [lesson] = await db
      .delete(courseLessonsTable)
      .where(eq(courseLessonsTable.id, id))
      .returning();

    if (!lesson) {
      res.status(404).json({ error: "Lesson not found" });
      return;
    }

    await db
      .update(courseCurriculumModulesTable)
      .set({ lessonsCount: sql`GREATEST(${courseCurriculumModulesTable.lessonsCount} - 1, 0)` })
      .where(eq(courseCurriculumModulesTable.id, lesson.moduleId));

    res.status(204).send();
  },
);

export default router;

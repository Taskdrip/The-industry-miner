import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import {
  db,
  coursesTable,
  courseCurriculumModulesTable,
  courseLessonsTable,
  ordersTable,
} from "@workspace/db";
import {
  ListCoursesQueryParams,
  ListCoursesResponse,
  GetCourseParams,
  GetCourseResponse,
  ListModuleLessonsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/courses", async (req, res): Promise<void> => {
  const parsed = ListCoursesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, featured } = parsed.data;

  const conditions = [];
  if (category) {
    conditions.push(eq(coursesTable.category, category));
  }
  if (featured !== undefined) {
    conditions.push(eq(coursesTable.isFeatured, featured));
  }

  const courses = await db
    .select()
    .from(coursesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(coursesTable.studentsCount));

  res.json(ListCoursesResponse.parse(courses));
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const params = GetCourseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, params.data.id));

  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const modules = await db
    .select()
    .from(courseCurriculumModulesTable)
    .where(eq(courseCurriculumModulesTable.courseId, course.id))
    .orderBy(courseCurriculumModulesTable.position);

  res.json(
    GetCourseResponse.parse({
      ...course,
      curriculum: modules.map((m) => ({
        id: m.id,
        title: m.title,
        lessonsCount: m.lessonsCount,
      })),
    }),
  );
});

router.get(
  "/courses/:courseId/modules/:moduleId/lessons",
  async (req, res): Promise<void> => {
    // Require authentication for lesson content (contains premium video URLs)
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const courseId = Number(req.params.courseId);
    const moduleId = Number(req.params.moduleId);
    if (!Number.isInteger(courseId) || !Number.isInteger(moduleId)) {
      res.status(400).json({ error: "Invalid courseId or moduleId" });
      return;
    }

    // Admins bypass enrollment check; others must have an order
    if (req.user.role !== "admin") {
      const orders = await db
        .select({ courseId: ordersTable.courseId })
        .from(ordersTable)
        .where(eq(ordersTable.userId, req.user.id));
      const isEnrolled = orders.some((o) => o.courseId === courseId);
      if (!isEnrolled) {
        res.status(403).json({ error: "Not enrolled in this course" });
        return;
      }
    }

    const lessons = await db
      .select()
      .from(courseLessonsTable)
      .where(
        and(
          eq(courseLessonsTable.courseId, courseId),
          eq(courseLessonsTable.moduleId, moduleId),
        ),
      )
      .orderBy(courseLessonsTable.position);

    res.json(ListModuleLessonsResponse.parse(lessons));
  },
);

export default router;

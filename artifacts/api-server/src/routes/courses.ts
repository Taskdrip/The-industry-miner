import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import {
  db,
  coursesTable,
  courseCurriculumModulesTable,
} from "@workspace/db";
import {
  ListCoursesQueryParams,
  ListCoursesResponse,
  GetCourseParams,
  GetCourseResponse,
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
        title: m.title,
        lessonsCount: m.lessonsCount,
      })),
    }),
  );
});

export default router;

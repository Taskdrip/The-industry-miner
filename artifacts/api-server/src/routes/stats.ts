import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, coursesTable, categoriesTable } from "@workspace/db";
import { GetStatsSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const ENROLLED_LEARNERS = 28000;
const EXPERT_INSTRUCTORS = 14;

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [courseStats] = await db
    .select({
      totalCourses: sql<number>`count(*)`.mapWith(Number),
      averageRating: sql<number>`coalesce(avg(${coursesTable.rating}), 0)`.mapWith(Number),
    })
    .from(coursesTable);

  const [categoryStats] = await db
    .select({
      totalCategories: sql<number>`count(*)`.mapWith(Number),
    })
    .from(categoriesTable);

  res.json(
    GetStatsSummaryResponse.parse({
      enrolledLearners: ENROLLED_LEARNERS,
      totalCourses: courseStats?.totalCourses ?? 0,
      totalCategories: categoryStats?.totalCategories ?? 0,
      averageRating: Math.round((courseStats?.averageRating ?? 0) * 10) / 10,
      expertInstructors: EXPERT_INSTRUCTORS,
    }),
  );
});

export default router;

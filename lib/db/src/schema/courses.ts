import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  instructorName: text("instructor_name").notNull(),
  level: text("level").notNull(),
  lessonsCount: integer("lessons_count").notNull(),
  durationWeeks: integer("duration_weeks").notNull(),
  studentsCount: integer("students_count").notNull(),
  rating: real("rating").notNull(),
  reviewsCount: integer("reviews_count").notNull(),
  priceCents: integer("price_cents").notNull(),
  originalPriceCents: integer("original_price_cents"),
  isFree: boolean("is_free").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  imageUrl: text("image_url").notNull(),
  whatYouWillLearn: text("what_you_will_learn").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courseCurriculumModulesTable = pgTable("course_curriculum_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  lessonsCount: integer("lessons_count").notNull(),
  position: integer("position").notNull().default(0),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;

export const insertCourseCurriculumModuleSchema = createInsertSchema(courseCurriculumModulesTable).omit({ id: true });
export type InsertCourseCurriculumModule = z.infer<typeof insertCourseCurriculumModuleSchema>;
export type CourseCurriculumModule = typeof courseCurriculumModulesTable.$inferSelect;

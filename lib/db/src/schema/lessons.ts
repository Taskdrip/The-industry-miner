import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { courseCurriculumModulesTable } from "./courses";

export const courseLessonsTable = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => courseCurriculumModulesTable.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  contentUrl: text("content_url"),
  durationMinutes: integer("duration_minutes").notNull().default(10),
  position: integer("position").notNull().default(0),
  isPreview: boolean("is_preview").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCourseLessonSchema = createInsertSchema(courseLessonsTable).omit({ id: true, createdAt: true });
export type InsertCourseLesson = z.infer<typeof insertCourseLessonSchema>;
export type CourseLesson = typeof courseLessonsTable.$inferSelect;

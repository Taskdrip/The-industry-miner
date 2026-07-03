import { Link } from "wouter";
import { useListCategories, useListCourses } from "@workspace/api-client-react";
import CourseCard from "@/components/shared/CourseCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CourseCatalog() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const { data: categories } = useListCategories();
  const { data: courses } = useListCourses({ category: activeCategory });

  return (
    <section className="py-24 bg-muted/30" id="courses">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Expand Your Knowledge
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our comprehensive catalog of masterclasses and toolkits designed for ambitious founders.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          <Button
            variant={activeCategory === undefined ? "default" : "outline"}
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveCategory(undefined)}
          >
            All Courses
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.name} <span className="ml-2 text-xs opacity-60">({category.courseCount})</span>
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useListCourses } from "@workspace/api-client-react";
import CourseCard from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedCourses() {
  const { data: courses } = useListCourses({ featured: true });

  if (!courses || courses.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary font-serif">
              Bestselling Masterclasses
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Our most popular programs, highly rated by thousands of entrepreneurs.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex text-primary hover:text-primary/80">
            View All Bestsellers <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

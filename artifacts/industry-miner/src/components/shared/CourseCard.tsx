import type { Course } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Star, Clock, Users, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNairaFromKobo } from "@/lib/currency";

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

export default function CourseCard({ course, featured = false }: CourseCardProps) {
  const priceFormatted = formatNairaFromKobo(course.priceCents);

  const originalPriceFormatted = course.originalPriceCents
    ? formatNairaFromKobo(course.originalPriceCents)
    : null;

  return (
    <Link href={`/course/${course.id}`} className="group block h-full">
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {course.isFeatured && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary border-none shadow-md">
                Bestseller
              </Badge>
            )}
            {course.isFree && (
              <Badge className="bg-green-500 text-white hover:bg-green-600 border-none shadow-md">
                Free
              </Badge>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            {course.category}
          </div>
          <h3 className="font-bold text-lg mb-2 text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
            {course.summary}
          </p>
          
          <div className="text-sm text-secondary/70 mb-4 flex items-center">
            <span className="font-medium mr-2">{course.instructorName}</span>
          </div>

          <div className="flex items-center text-sm mb-4 gap-4">
            <div className="flex items-center text-amber-500 font-bold">
              <span>{course.rating.toFixed(1)}</span>
              <Star className="w-4 h-4 ml-1 fill-current" />
              <span className="text-muted-foreground font-normal ml-1">({course.reviewsCount})</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-1" />
              <span>{new Intl.NumberFormat().format(course.studentsCount)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center"><PlayCircle className="w-3 h-3 mr-1"/>{course.lessonsCount} lessons</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/>{course.durationWeeks} weeks</span>
            </div>
            <div className="text-right">
              {course.isFree ? (
                <span className="font-bold text-lg text-secondary">Free</span>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg text-secondary">{priceFormatted}</span>
                  {originalPriceFormatted && (
                    <span className="text-xs text-muted-foreground line-through">{originalPriceFormatted}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

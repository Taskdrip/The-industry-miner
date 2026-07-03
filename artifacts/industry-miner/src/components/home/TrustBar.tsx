import { useGetStatsSummary } from "@workspace/api-client-react";
import { Users, BookOpen, Star, Award } from "lucide-react";

export default function TrustBar() {
  const { data: stats } = useGetStatsSummary();

  const items = [
    {
      label: "Enrolled Learners",
      value: stats?.enrolledLearners ? new Intl.NumberFormat().format(stats.enrolledLearners) : "28K+",
      icon: Users,
    },
    {
      label: "Expert Instructors",
      value: stats?.expertInstructors || "50+",
      icon: Award,
    },
    {
      label: "Masterclasses",
      value: stats?.totalCourses || "100+",
      icon: BookOpen,
    },
    {
      label: "Average Rating",
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : "4.9",
      icon: Star,
    },
  ];

  return (
    <section className="bg-secondary py-12 border-y border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center px-4">
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 font-serif">
                {item.value}
              </div>
              <div className="text-white/70 text-sm uppercase tracking-wider font-semibold">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

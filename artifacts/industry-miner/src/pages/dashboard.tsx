import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Play, Lock, Clock, ChevronRight, Gem, GraduationCap,
  Award, Loader2, AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "") + "/api";

async function apiFetch(path: string) {
  const res = await fetch(API_BASE + path, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  lessonsCount: number;
  durationWeeks: number;
  instructorName: string;
  level: string;
  category: string;
  enrolledAt: string;
  orderStatus: string;
}

function CourseCard({ course }: { course: EnrolledCourse }) {
  const [, navigate] = useLocation();

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
            <Gem className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <Play className="w-6 h-6 text-primary ml-0.5" />
          </div>
        </div>
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider"
        >
          {course.level}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          {course.category}
        </p>
        <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{course.summary}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 border-t border-border pt-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {course.lessonsCount} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {course.durationWeeks}w programme
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-600 font-medium">Enrolled</span>
          </span>
        </div>

        <Button
          onClick={() => navigate(`/dashboard/course/${course.id}`)}
          className="w-full group/btn"
        >
          <Play className="w-4 h-4 mr-2" />
          Continue Learning
          <ChevronRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated, loginUrl } = useAuth();
  const [, navigate] = useLocation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiFetch("/dashboard"),
    enabled: isAuthenticated,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = loginUrl;
    }
  }, [authLoading, isAuthenticated, loginUrl]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const enrolledCourses: EnrolledCourse[] = data?.enrolledCourses ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Welcome hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-amber-50/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Welcome back,</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {user?.firstName ?? "Student"} {user?.lastName ?? ""}
                </h1>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {enrolledCourses.length === 0
                    ? "Start your learning journey today."
                    : `You have ${enrolledCourses.length} active course${enrolledCourses.length !== 1 ? "s" : ""}.`}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-card border border-border rounded-xl px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-primary">{enrolledCourses.length}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Courses</p>
                </div>
                <div className="bg-card border border-border rounded-xl px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {enrolledCourses.reduce((s, c) => s + c.lessonsCount, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Lessons</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-3" />
              <p className="font-semibold text-lg">Something went wrong</p>
              <p className="text-muted-foreground text-sm mt-1">
                {error instanceof Error ? error.message : "Could not load your courses."}
              </p>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mb-5">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">No courses yet</h2>
              <p className="text-muted-foreground text-sm mb-6">
                You haven't enrolled in any courses. Explore our masterclasses to get started on
                your journey.
              </p>
              <Button onClick={() => navigate("/jewellery-masterclass")} size="lg">
                Browse Masterclasses
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Courses</h2>
                <button
                  onClick={() => navigate("/jewellery-masterclass")}
                  className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  Browse more <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

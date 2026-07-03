import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, ChevronDown, ChevronRight, Play, Lock,
  FileText, Download, ExternalLink, Video, BookOpen,
  Loader2, AlertCircle, Link2, File,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "") + "/api";

async function apiFetch(path: string) {
  const res = await fetch(API_BASE + path, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

interface LessonItem {
  id: number;
  title: string;
  contentUrl: string | null;
  durationMinutes: number | null;
  isPreview: boolean;
  position: number;
}

interface ModuleItem {
  id: number;
  title: string;
  lessonsCount: number;
  position: number;
  lessons: LessonItem[];
}

interface Resource {
  id: number;
  courseId: number;
  title: string;
  url: string;
  type: string;
  description: string | null;
  position: number;
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([A-Za-z0-9]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;
  // Direct video — return as-is for <video> tag
  if (/\.(mp4|webm|ogg)$/i.test(url)) return url;
  return null;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

const resourceTypeIcon: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  download: <Download className="w-4 h-4 text-blue-500" />,
  video: <Video className="w-4 h-4 text-purple-500" />,
  link: <Link2 className="w-4 h-4 text-green-500" />,
};

const resourceTypeLabel: Record<string, string> = {
  pdf: "PDF",
  download: "Download",
  video: "Video",
  link: "Link",
};

export default function CourseViewer() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { isAuthenticated, isLoading: authLoading, loginUrl } = useAuth();
  const [, navigate] = useLocation();

  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([0]));

  // Fetch full course detail (with nested lessons) from protected endpoint
  const { data: courseData, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ["dashboard-course", courseId],
    queryFn: () => apiFetch(`/dashboard/courses/${courseId}`),
    enabled: isAuthenticated && !!courseId,
  });

  // Fetch resources
  const { data: resourcesData, isLoading: resourcesLoading } = useQuery({
    queryKey: ["resources", courseId],
    queryFn: () => apiFetch(`/courses/${courseId}/resources`),
    enabled: isAuthenticated && !!courseId,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = loginUrl;
    return null;
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (courseError || !courseData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <h2 className="text-xl font-bold mb-1">Could not load course</h2>
            <p className="text-muted-foreground text-sm">
              {courseError instanceof Error ? courseError.message : "Please try again later."}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const course = courseData;
  const curriculum: ModuleItem[] = (course.curriculum ?? []).sort(
    (a: ModuleItem, b: ModuleItem) => a.position - b.position
  );
  const resources: Resource[] = Array.isArray(resourcesData) ? resourcesData : [];

  const allLessons = curriculum.flatMap((m: ModuleItem) => m.lessons ?? []);
  const currentLesson = activeLesson ?? allLessons[0] ?? null;
  const embedUrl = currentLesson?.contentUrl ? getVideoEmbedUrl(currentLesson.contentUrl) : null;

  const toggleModule = (idx: number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const currentLessonModuleIdx = curriculum.findIndex((m) =>
    (m.lessons ?? []).some((l) => l.id === currentLesson?.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            My Courses
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate">{course.title}</span>
        </div>
      </div>

      <div className="flex-1 flex max-w-screen-2xl mx-auto w-full">
        {/* ── Left sidebar: curriculum ─────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0 border-r border-border bg-card/50 overflow-y-auto max-h-[calc(100vh-112px)] sticky top-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-sm truncate">{course.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {allLessons.length} lessons
            </p>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {curriculum.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No curriculum available yet.
              </div>
            ) : (
              curriculum.map((mod, idx) => (
                <div key={mod.id}>
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(idx)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors group"
                  >
                    {openModules.has(idx) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
                        Module {idx + 1}
                      </p>
                      <p className="text-sm font-medium leading-snug truncate">{mod.title}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {(mod.lessons ?? []).length}
                    </span>
                  </button>

                  {/* Lessons */}
                  {openModules.has(idx) && (
                    <div className="pb-1">
                      {(mod.lessons ?? [])
                        .sort((a, b) => a.position - b.position)
                        .map((lesson) => {
                          const isActive = currentLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={cn(
                                "w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors",
                                isActive
                                  ? "bg-primary/8 border-l-2 border-primary"
                                  : "hover:bg-muted/40 border-l-2 border-transparent"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                  isActive ? "bg-primary" : "bg-muted"
                                )}
                              >
                                <Play
                                  className={cn(
                                    "w-2.5 h-2.5 ml-0.5",
                                    isActive ? "text-white" : "text-muted-foreground"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-sm leading-snug",
                                    isActive ? "font-semibold text-primary" : "text-foreground"
                                  )}
                                >
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {lesson.durationMinutes && (
                                    <span className="text-[10px] text-muted-foreground">
                                      {lesson.durationMinutes} min
                                    </span>
                                  )}
                                  {lesson.isPreview && (
                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Video player */}
          <div className="w-full bg-black">
            {currentLesson ? (
              embedUrl ? (
                isDirectVideo(currentLesson.contentUrl!) ? (
                  <video
                    key={currentLesson.id}
                    src={embedUrl}
                    controls
                    className="w-full aspect-video max-h-[60vh]"
                  />
                ) : (
                  <iframe
                    key={currentLesson.id}
                    src={embedUrl}
                    className="w-full aspect-video max-h-[60vh]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                )
              ) : (
                <div className="w-full aspect-video max-h-[60vh] flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Video className="w-7 h-7 text-white/60" />
                  </div>
                  <p className="text-white/50 text-sm">No video available for this lesson yet.</p>
                  {currentLesson.contentUrl && (
                    <a
                      href={currentLesson.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open lesson link
                    </a>
                  )}
                </div>
              )
            ) : (
              <div className="w-full aspect-video max-h-[60vh] flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-12 h-12 text-white/30" />
                <p className="text-white/40 text-sm">Select a lesson from the curriculum</p>
              </div>
            )}
          </div>

          {/* Lesson info + nav */}
          <div className="border-b border-border px-6 py-4 bg-card">
            {currentLesson ? (
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {currentLessonModuleIdx >= 0 && (
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Module {currentLessonModuleIdx + 1}
                      </span>
                    )}
                    {currentLesson.isPreview && (
                      <Badge variant="secondary" className="text-[10px]">Free Preview</Badge>
                    )}
                  </div>
                  <h1 className="text-lg font-bold">{currentLesson.title}</h1>
                  {currentLesson.durationMinutes && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {currentLesson.durationMinutes} minutes
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Prev / Next */}
                  {(() => {
                    const idx = allLessons.findIndex((l) => l.id === currentLesson.id);
                    const prev = allLessons[idx - 1];
                    const next = allLessons[idx + 1];
                    return (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!prev}
                          onClick={() => prev && setActiveLesson(prev)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Prev
                        </Button>
                        <Button
                          size="sm"
                          disabled={!next}
                          onClick={() => next && setActiveLesson(next)}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Choose a lesson to get started.</p>
            )}
          </div>

          {/* Mobile curriculum accordion */}
          <div className="lg:hidden border-b border-border">
            <details className="group">
              <summary className="px-6 py-3 font-semibold text-sm flex items-center justify-between cursor-pointer select-none">
                Course Curriculum
                <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 space-y-2 max-h-64 overflow-y-auto">
                {curriculum.map((mod, idx) => (
                  <div key={mod.id}>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-1.5">
                      M{idx + 1}: {mod.title}
                    </p>
                    {(mod.lessons ?? []).map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "w-full text-left text-sm py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors",
                          currentLesson?.id === lesson.id
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <Play className="w-3 h-3 flex-shrink-0" />
                        {lesson.title}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* Resources panel */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h2 className="text-base font-bold mb-4">Course Resources</h2>

            {resourcesLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading resources…
              </div>
            ) : resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <File className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No downloadable resources available for this course yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                      {resourceTypeIcon[resource.type] ?? <File className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-snug line-clamp-2">
                        {resource.title}
                      </p>
                      {resource.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                      <Badge
                        variant="secondary"
                        className="mt-1.5 text-[10px] px-2 py-0 h-4"
                      >
                        {resourceTypeLabel[resource.type] ?? resource.type}
                      </Badge>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

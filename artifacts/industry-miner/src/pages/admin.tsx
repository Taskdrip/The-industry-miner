import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useListCourses } from "@workspace/api-client-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, ChevronDown, ChevronRight, Lock, Loader2, BookOpen, Video, CheckCircle2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "") + "/api";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(API_BASE + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") return null;
  return res.json();
}

interface Module {
  id: number;
  title: string;
  lessonsCount: number;
}

interface Lesson {
  id: number;
  title: string;
  description: string | null;
  contentUrl: string | null;
  durationMinutes: number | null;
  isPreview: boolean;
  order: number;
}

function AddModuleForm({ courseId, onAdded }: { courseId: number; onAdded: (m: Module) => void }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const module_ = await apiFetch(`/admin/courses/${courseId}/modules`, {
        method: "POST",
        body: JSON.stringify({ title: title.trim() }),
      });
      onAdded(module_);
      setTitle("");
      toast({ title: "Module added", description: `"${module_.title}" created successfully.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add module";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New module title…"
        className="flex-1"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !title.trim()} size="sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
        <span className="ml-1">Add Module</span>
      </Button>
    </form>
  );
}

function AddLessonForm({ moduleId, onAdded }: { moduleId: number; onAdded: (l: Lesson) => void }) {
  const [title, setTitle] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const lesson = await apiFetch(`/admin/modules/${moduleId}/lessons`, {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          contentUrl: contentUrl.trim() || null,
          durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
          isPreview,
        }),
      });
      onAdded(lesson);
      setTitle("");
      setContentUrl("");
      setDurationMinutes("");
      setIsPreview(false);
      toast({ title: "Lesson added", description: `"${lesson.title}" added to module.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add lesson";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-muted/40 rounded-xl p-4 space-y-3 border border-dashed border-border">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add a Lesson</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Lesson Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Jewellery" disabled={loading} />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Video URL</Label>
          <Input value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} placeholder="https://youtube.com/…" disabled={loading} />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Duration (minutes)</Label>
          <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="15" disabled={loading} min="1" />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id={`preview-${moduleId}`}
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 accent-primary"
          />
          <Label htmlFor={`preview-${moduleId}`} className="text-sm cursor-pointer">Free preview lesson</Label>
        </div>
      </div>
      <Button type="submit" disabled={loading || !title.trim()} size="sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <PlusCircle className="w-4 h-4 mr-1" />}
        Add Lesson
      </Button>
    </form>
  );
}

function ModuleAccordion({ courseId, module_ }: { courseId: number; module_: Module }) {
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    if (loaded) { setOpen(!open); return; }
    setOpen(true);
    setLoading(true);
    try {
      const data = await apiFetch(`/courses/${courseId}/modules/${module_.id}/lessons`);
      setLessons(data);
      setLoaded(true);
    } catch {
      toast({ title: "Error", description: "Failed to load lessons", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId: number) => {
    try {
      await apiFetch(`/admin/lessons/${lessonId}`, { method: "DELETE" });
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast({ title: "Deleted", description: "Lesson removed." });
    } catch {
      toast({ title: "Error", description: "Failed to delete lesson", variant: "destructive" });
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={load}
        className="w-full flex items-center gap-3 px-5 py-4 bg-card hover:bg-accent/30 transition-colors text-left"
      >
        {open ? <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="font-semibold flex-1">{module_.title}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{module_.lessonsCount} lessons</span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-3 space-y-2 bg-card border-t border-border">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading lessons…
            </div>
          )}

          {!loading && lessons.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">No lessons yet. Add one below.</p>
          )}

          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-start gap-3 bg-background rounded-lg px-4 py-3 border border-border group">
              <Video className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm truncate">{lesson.title}</span>
                  {lesson.isPreview && (
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Free Preview</span>
                  )}
                </div>
                {lesson.durationMinutes && (
                  <span className="text-xs text-muted-foreground">{lesson.durationMinutes} min</span>
                )}
                {lesson.contentUrl && (
                  <a href={lesson.contentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block truncate max-w-xs">
                    {lesson.contentUrl}
                  </a>
                )}
              </div>
              <button
                onClick={() => deleteLesson(lesson.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 flex-shrink-0"
                title="Delete lesson"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="pt-2">
            <AddLessonForm
              moduleId={module_.id}
              onAdded={(lesson) => {
                setLessons((prev) => [...prev, lesson]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CoursePanel({ course }: { course: { id: number; title: string; category: string } }) {
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    if (loaded) { setOpen(!open); return; }
    setOpen(true);
    try {
      // modules come from the course detail endpoint
      const data = await apiFetch(`/courses/${course.id}`);
      setModules(data.curriculum ?? []);
      setLoaded(true);
    } catch {
      toast({ title: "Error", description: "Failed to load modules", variant: "destructive" });
    }
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={load}
        className="w-full flex items-center gap-4 px-6 py-5 bg-card hover:bg-accent/20 transition-colors text-left"
      >
        {open ? <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg truncate">{course.title}</div>
          <div className="text-sm text-muted-foreground">{course.category}</div>
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-4 bg-background border-t border-border space-y-4">
          <div className="space-y-3">
            {modules.map((m) => (
              <ModuleAccordion key={m.id} courseId={course.id} module_={m} />
            ))}
            {loaded && modules.length === 0 && (
              <p className="text-sm text-muted-foreground">No modules yet. Add one below.</p>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Add a Module</p>
            <AddModuleForm
              courseId={course.id}
              onAdded={(m) => setModules((prev) => [...prev, m])}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isLoading, loginUrl } = useAuth();
  const { data: courses } = useListCourses({}, { query: { enabled: isAdmin } });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Lock className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="text-muted-foreground">You need to be signed in to access the admin panel.</p>
        <a href={loginUrl}>
          <Button>Sign In</Button>
        </a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Lock className="w-12 h-12 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">This page is restricted to admins only. The first user to sign up automatically becomes admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">Admin — Course Builder</h1>
            </div>
            <p className="text-muted-foreground">
              Expand a course to manage its modules and lessons. The first user to sign in becomes admin.
            </p>
          </div>

          {!courses || courses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p>No courses in the database yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((c) => (
                <CoursePanel key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

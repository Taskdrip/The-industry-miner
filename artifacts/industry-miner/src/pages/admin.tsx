import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useListCourses } from "@workspace/api-client-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusCircle, ChevronDown, ChevronRight, Lock, Loader2, BookOpen,
  Video, CheckCircle2, Trash2, Gem, Pencil, Save, X, ExternalLink,
  FileText, Download, Link2, File, FolderOpen, LayoutList,
  ShoppingBag, CheckCheck, XCircle, Clock,
} from "lucide-react";
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

interface Resource {
  id: number;
  courseId: number;
  title: string;
  url: string;
  type: string;
  description: string | null;
  position: number;
}

const RESOURCE_TYPES = [
  { value: "video", label: "Video Link", icon: <Video className="w-3.5 h-3.5" /> },
  { value: "pdf", label: "PDF", icon: <FileText className="w-3.5 h-3.5" /> },
  { value: "download", label: "Download", icon: <Download className="w-3.5 h-3.5" /> },
  { value: "link", label: "External Link", icon: <Link2 className="w-3.5 h-3.5" /> },
];

const resourceIcon: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4 text-purple-500" />,
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  download: <Download className="w-4 h-4 text-blue-500" />,
  link: <Link2 className="w-4 h-4 text-green-500" />,
};

// ─── Resource Row ─────────────────────────────────────────────────────────────
function ResourceRow({ resource, onDelete, onUpdate }: {
  resource: Resource;
  onDelete: (id: number) => void;
  onUpdate: (updated: Resource) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(resource.title);
  const [url, setUrl] = useState(resource.url);
  const [type, setType] = useState(resource.type);
  const [description, setDescription] = useState(resource.description ?? "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!title.trim() || !url.trim()) return;
    setLoading(true);
    try {
      const updated = await apiFetch(`/admin/resources/${resource.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: title.trim(), url: url.trim(), type, description: description.trim() || null }),
      });
      onUpdate(updated ?? { ...resource, title: title.trim(), url: url.trim(), type, description: description.trim() || null });
      setEditing(false);
      toast({ title: "Resource updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update resource", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="bg-accent/40 rounded-xl px-4 py-3 border border-primary/20 space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" className="h-8 text-sm" disabled={loading} />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="h-8 text-sm" disabled={loading} />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="h-8 text-sm" disabled={loading} />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-8 text-sm rounded-md border border-input bg-background px-2 disabled:opacity-50"
            disabled={loading}
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={save} disabled={loading || !title.trim() || !url.trim()} className="h-7 text-xs">
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setTitle(resource.title); setUrl(resource.url); setType(resource.type); setDescription(resource.description ?? ""); }} className="h-7 text-xs">
            <X className="w-3 h-3 mr-1" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-background rounded-xl px-4 py-3 border border-border group hover:border-border/80 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        {resourceIcon[resource.type] ?? <File className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{resource.title}</span>
          <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full capitalize">
            {RESOURCE_TYPES.find((t) => t.value === resource.type)?.label ?? resource.type}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {resource.description && (
            <span className="text-xs text-muted-foreground truncate max-w-xs">{resource.description}</span>
          )}
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[180px]">Open link</span>
          </a>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={() => setEditing(true)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Edit">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(resource.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/08 rounded-lg transition-colors" title="Delete">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Resource Manager ─────────────────────────────────────────────────────────
function ResourceManager({ courseId }: { courseId: number }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  // Add form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("link");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/courses/${courseId}/resources`);
      setResources(Array.isArray(data) ? data : []);
      setLoaded(true);
    } catch {
      toast({ title: "Error", description: "Failed to load resources", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Load on mount — use useEffect to avoid side effects during render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [courseId]);

  const addResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setAdding(true);
    try {
      const resource = await apiFetch(`/admin/courses/${courseId}/resources`, {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), url: url.trim(), type, description: description.trim() || null }),
      });
      setResources((prev) => [...prev, resource]);
      setTitle(""); setUrl(""); setType("link"); setDescription("");
      toast({ title: "Resource added", description: `"${resource.title}" added.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add resource";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const deleteResource = async (id: number) => {
    try {
      await apiFetch(`/admin/resources/${id}`, { method: "DELETE" });
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Resource deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-3">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading resources…
        </div>
      )}

      {!loading && resources.length === 0 && loaded && (
        <p className="text-sm text-muted-foreground py-2">No resources yet. Add one below.</p>
      )}

      {resources.map((r) => (
        <ResourceRow
          key={r.id}
          resource={r}
          onDelete={deleteResource}
          onUpdate={(updated) => setResources((prev) => prev.map((x) => x.id === updated.id ? updated : x))}
        />
      ))}

      {/* Add resource form */}
      <form onSubmit={addResource} className="bg-muted/30 rounded-xl p-4 space-y-3 border border-dashed border-border mt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add a Resource</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1 block font-medium">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Module 1 Worksheet" disabled={adding} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs mb-1 block font-medium">URL *</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/…" disabled={adding} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs mb-1 block font-medium">Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-9 text-sm rounded-md border border-input bg-background px-3 disabled:opacity-50"
              disabled={adding}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs mb-1 block font-medium">Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" disabled={adding} className="h-9 text-sm" />
          </div>
        </div>
        <Button type="submit" disabled={adding || !title.trim() || !url.trim()} size="sm" className="h-9">
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <PlusCircle className="w-3.5 h-3.5 mr-1.5" />}
          Add Resource
        </Button>
      </form>
    </div>
  );
}

// ─── Add Module Form ──────────────────────────────────────────────────────────
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
      toast({ title: "Module added", description: `"${module_.title}" created.` });
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
        className="flex-1 h-9 text-sm"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !title.trim()} size="sm" className="h-9">
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
        <span className="ml-1.5">Add Module</span>
      </Button>
    </form>
  );
}

// ─── Add Lesson Form ──────────────────────────────────────────────────────────
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
      setTitle(""); setContentUrl(""); setDurationMinutes(""); setIsPreview(false);
      toast({ title: "Lesson added", description: `"${lesson.title}" added.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add lesson";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-muted/30 rounded-xl p-4 space-y-3 border border-dashed border-border">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add a Lesson</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1 block font-medium">Lesson Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Jewellery" disabled={loading} className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block font-medium">Video URL</Label>
          <Input value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} placeholder="https://youtube.com/…" disabled={loading} className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block font-medium">Duration (minutes)</Label>
          <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="15" disabled={loading} min="1" className="h-9 text-sm" />
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
          <Label htmlFor={`preview-${moduleId}`} className="text-sm cursor-pointer font-medium">Free preview lesson</Label>
        </div>
      </div>
      <Button type="submit" disabled={loading || !title.trim()} size="sm" className="h-9">
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <PlusCircle className="w-3.5 h-3.5 mr-1.5" />}
        Add Lesson
      </Button>
    </form>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────
function LessonRow({ lesson, onDelete, onUpdate }: {
  lesson: Lesson;
  onDelete: (id: number) => void;
  onUpdate: (updated: Lesson) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [contentUrl, setContentUrl] = useState(lesson.contentUrl ?? "");
  const [durationMinutes, setDurationMinutes] = useState(lesson.durationMinutes?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const updated = await apiFetch(`/admin/lessons/${lesson.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          contentUrl: contentUrl.trim() || null,
          durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
        }),
      });
      onUpdate(updated ?? { ...lesson, title: title.trim(), contentUrl: contentUrl.trim() || null, durationMinutes: durationMinutes ? parseInt(durationMinutes) : null });
      setEditing(false);
      toast({ title: "Lesson updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update lesson", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="bg-accent/40 rounded-xl px-4 py-3 border border-primary/20 space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" className="h-8 text-sm" disabled={loading} />
          <Input value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} placeholder="Video URL" className="h-8 text-sm" disabled={loading} />
          <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="Duration (min)" className="h-8 text-sm" disabled={loading} min="1" />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={save} disabled={loading || !title.trim()} className="h-7 text-xs">
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setTitle(lesson.title); setContentUrl(lesson.contentUrl ?? ""); setDurationMinutes(lesson.durationMinutes?.toString() ?? ""); }} className="h-7 text-xs">
            <X className="w-3 h-3 mr-1" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-background rounded-xl px-4 py-3 border border-border group hover:border-border/80 transition-colors">
      <Video className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm truncate">{lesson.title}</span>
          {lesson.isPreview && (
            <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Free Preview</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {lesson.durationMinutes && (
            <span className="text-xs text-muted-foreground">{lesson.durationMinutes} min</span>
          )}
          {lesson.contentUrl && (
            <a href={lesson.contentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 truncate max-w-xs">
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Link</span>
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Edit lesson"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(lesson.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/08 rounded-lg transition-colors"
          title="Delete lesson"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Module Accordion ─────────────────────────────────────────────────────────
function ModuleAccordion({ courseId, module_, onDelete }: {
  courseId: number;
  module_: Module;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [moduleTitle, setModuleTitle] = useState(module_.title);
  const [savingTitle, setSavingTitle] = useState(false);
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
      toast({ title: "Lesson deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete lesson", variant: "destructive" });
    }
  };

  const saveTitle = async () => {
    if (!moduleTitle.trim() || moduleTitle === module_.title) { setEditingTitle(false); return; }
    setSavingTitle(true);
    try {
      await apiFetch(`/admin/modules/${module_.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: moduleTitle.trim() }),
      });
      module_.title = moduleTitle.trim();
      setEditingTitle(false);
      toast({ title: "Module renamed" });
    } catch {
      toast({ title: "Error", description: "Failed to rename module", variant: "destructive" });
      setModuleTitle(module_.title);
    } finally {
      setSavingTitle(false);
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-card hover:bg-accent/15 transition-colors">
        <button onClick={load} className="flex items-center gap-3 flex-1 text-left min-w-0">
          {open
            ? <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
          <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
          {editingTitle ? (
            <span className="flex-1 font-semibold text-sm truncate">{moduleTitle}</span>
          ) : (
            <span className="flex-1 font-semibold text-sm truncate">{moduleTitle}</span>
          )}
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
            {module_.lessonsCount} lessons
          </span>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setEditingTitle(true); if (!open) { setOpen(true); } }}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Rename module"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(module_.id); }}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/08 rounded-lg transition-colors"
            title="Delete module"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-5 pb-5 pt-3 space-y-2 bg-card border-t border-border">
          {/* Rename field */}
          {editingTitle && (
            <div className="flex items-center gap-2 mb-3 p-3 bg-accent/30 rounded-xl border border-primary/20">
              <Input
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="h-8 text-sm flex-1"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditingTitle(false); setModuleTitle(module_.title); } }}
              />
              <Button size="sm" onClick={saveTitle} disabled={savingTitle || !moduleTitle.trim()} className="h-8 text-xs">
                {savingTitle ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditingTitle(false); setModuleTitle(module_.title); }} className="h-8 text-xs">
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-3">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading lessons…
            </div>
          )}

          {!loading && lessons.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">No lessons yet. Add one below.</p>
          )}

          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onDelete={(id) => deleteLesson(id)}
              onUpdate={(updated) => setLessons((prev) => prev.map((l) => l.id === updated.id ? updated : l))}
            />
          ))}

          <div className="pt-2">
            <AddLessonForm
              moduleId={module_.id}
              onAdded={(lesson) => setLessons((prev) => [...prev, lesson])}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Course Panel ─────────────────────────────────────────────────────────────
function CoursePanel({ course, highlight }: { course: { id: number; title: string; category: string }; highlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"curriculum" | "resources">("curriculum");
  const [modules, setModules] = useState<Module[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    if (loaded) { setOpen(!open); return; }
    setOpen(true);
    try {
      const data = await apiFetch(`/courses/${course.id}`);
      setModules(data.curriculum ?? []);
      setLoaded(true);
    } catch {
      toast({ title: "Error", description: "Failed to load modules", variant: "destructive" });
    }
  };

  const deleteModule = async (moduleId: number) => {
    try {
      await apiFetch(`/admin/modules/${moduleId}`, { method: "DELETE" });
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast({ title: "Module deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete module", variant: "destructive" });
    }
  };

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-sm ${highlight ? "border-amber-400/40 ring-1 ring-amber-400/15" : "border-border"}`}>
      <button
        onClick={load}
        className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors ${highlight ? "bg-amber-50/60 hover:bg-amber-50" : "bg-card hover:bg-accent/20"}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {open
            ? <ChevronDown className={`w-5 h-5 flex-shrink-0 ${highlight ? "text-amber-600" : "text-primary"}`} />
            : <ChevronRight className={`w-5 h-5 flex-shrink-0 ${highlight ? "text-amber-500" : "text-muted-foreground"}`} />}
          {highlight && <Gem className="w-4 h-4 text-amber-500 flex-shrink-0" />}
          <div className="min-w-0">
            <div className={`font-bold text-base truncate ${highlight ? "text-amber-900" : ""}`}>{course.title}</div>
            <div className={`text-sm ${highlight ? "text-amber-700/70" : "text-muted-foreground"}`}>{course.category}</div>
          </div>
        </div>
        {highlight && (
          <span className="text-[10px] bg-amber-400/20 text-amber-700 border border-amber-400/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
            Featured
          </span>
        )}
      </button>

      {open && (
        <div className="bg-background border-t border-border">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-4 pb-0 border-b border-border">
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === "curriculum"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === "resources"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Resources
            </button>
          </div>

          {/* Curriculum tab */}
          {activeTab === "curriculum" && (
            <div className="px-6 pb-6 pt-4 space-y-4">
              <div className="space-y-2.5">
                {modules.map((m) => (
                  <ModuleAccordion
                    key={m.id}
                    courseId={course.id}
                    module_={m}
                    onDelete={deleteModule}
                  />
                ))}
                {loaded && modules.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">No modules yet. Add one below.</p>
                )}
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Add a Module</p>
                <AddModuleForm
                  courseId={course.id}
                  onAdded={(m) => setModules((prev) => [...prev, m])}
                />
              </div>
            </div>
          )}

          {/* Resources tab */}
          {activeTab === "resources" && (
            <div className="px-6 pb-6 pt-4">
              <p className="text-xs text-muted-foreground mb-4">
                Add PDFs, video links, downloads, and other resources that enrolled subscribers can access.
              </p>
              <ResourceManager courseId={course.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Orders Manager ───────────────────────────────────────────────────────────
interface Order {
  id: number;
  userId: string;
  courseId: number;
  amountKobo: number;
  status: string;
  reference: string;
  createdAt: string;
  courseTitle: string | null;
}

function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    apiFetch("/admin/orders")
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => toast({ title: "Error", description: "Failed to load orders", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: number, status: "completed" | "rejected" | "pending") => {
    setUpdating(orderId);
    try {
      const updated = await apiFetch(`/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: updated.status } : o));
      toast({ title: status === "completed" ? "Order approved ✓" : status === "rejected" ? "Order rejected" : "Order reset", description: `Reference: ${orders.find((o) => o.id === orderId)?.reference}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update order";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "completed") return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
        <CheckCheck className="w-2.5 h-2.5" /> Approved
      </span>
    );
    if (status === "rejected") return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
        <XCircle className="w-2.5 h-2.5" /> Rejected
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
        <Clock className="w-2.5 h-2.5" /> Pending
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm py-6">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading orders…
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-12 text-muted-foreground">
      <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-25" />
      <p className="font-medium text-sm">No orders yet.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const isUpdating = updating === order.id;
        const amountNaira = (order.amountKobo / 100).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
        const dateStr = new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        return (
          <div key={order.id} className="flex items-start gap-4 bg-card border border-border rounded-xl px-5 py-4">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm truncate">{order.courseTitle ?? `Course #${order.courseId}`}</span>
                {statusBadge(order.status)}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span>User: <span className="font-mono">{order.userId.slice(0, 12)}…</span></span>
                <span>·</span>
                <span>{amountNaira}</span>
                <span>·</span>
                <span>{dateStr}</span>
                <span>·</span>
                <span className="font-mono">{order.reference}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {order.status !== "completed" && (
                <Button
                  size="sm"
                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                  disabled={isUpdating}
                  onClick={() => updateStatus(order.id, "completed")}
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3 mr-1" />}
                  Approve
                </Button>
              )}
              {order.status !== "rejected" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs text-destructive hover:bg-destructive/5 border-destructive/30"
                  disabled={isUpdating}
                  onClick={() => updateStatus(order.id, "rejected")}
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3 mr-1" />}
                  Reject
                </Button>
              )}
              {order.status !== "pending" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-muted-foreground"
                  disabled={isUpdating}
                  onClick={() => updateStatus(order.id, "pending")}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, loginUrl } = useAuth();
  const { data: courses } = useListCourses({});

  const jewelleryMasterclass = courses?.find(
    (c) => c.title.toLowerCase().includes("jewellery") || c.title.toLowerCase().includes("jewelry")
  );
  const otherCourses = courses?.filter((c) => c.id !== jewelleryMasterclass?.id) ?? [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Lock className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold font-serif">Sign In Required</h1>
        <p className="text-muted-foreground">You need to be signed in to access the admin panel.</p>
        <a href={loginUrl}><Button>Sign In</Button></a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Lock className="w-12 h-12 text-destructive" />
        <h1 className="text-2xl font-bold font-serif">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">This page is restricted to admins only. The first user to sign up automatically becomes admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-2xl font-bold font-serif">Course Builder</h1>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              Manage your courses, modules, and lessons. Click any course to expand it.
            </p>
          </div>

          {!courses || courses.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-25" />
              <p className="font-medium">No courses in the database yet.</p>
              <p className="text-sm mt-1 opacity-70">Add a course to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Jewellery Masterclass — pinned at top */}
              {jewelleryMasterclass && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Gem className="w-4 h-4 text-amber-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700">Jewellery Masterclass</h2>
                  </div>
                  <CoursePanel
                    key={jewelleryMasterclass.id}
                    course={jewelleryMasterclass}
                    highlight
                  />
                </div>
              )}

              {/* Other courses */}
              {otherCourses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">All Courses</h2>
                  </div>
                  <div className="space-y-3">
                    {otherCourses.map((c) => (
                      <CoursePanel key={c.id} course={c} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Help note */}
          <div className="mt-6 mb-2 text-center text-xs text-muted-foreground/60">
            Hover any lesson or module to reveal edit and delete actions.
          </div>

          {/* Orders management */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif">Order Approvals</h2>
                <p className="text-sm text-muted-foreground">
                  Approve payment to grant course access, or reject to deny it.
                </p>
              </div>
            </div>
            <OrdersManager />
          </div>
        </div>
      </main>
    </div>
  );
}

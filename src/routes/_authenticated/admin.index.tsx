import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminListCourses, deleteCourse, saveCourse } from "@/lib/admin.functions";
import { formatINR, slugify, type Course } from "@/lib/cms";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin — Course Manager | KKCC" },
      { name: "description", content: "Manage KKCC courses, lectures and study material." },
      { property: "og:title", content: "Admin — KKCC" },
      { property: "og:description", content: "Course content management for KKCC." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCourses,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          This panel is protected by Supabase roles. Only users with <code>admin</code> in
          <code> public.user_roles</code> can edit the website.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_14px_hsl(var(--primary)/0.28)] transition-colors hover:bg-primary/90"
          >
            Back to dashboard
          </Link>
          <Link
            to="/login"
            search={{ redirectTo: "/admin" }}
            className="inline-flex h-9 items-center justify-center rounded-full border border-primary/55 bg-background px-4 py-2 text-sm font-medium shadow-[0_0_10px_hsl(var(--primary)/0.12)] transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            Sign in as admin
          </Link>
        </div>
      </div>
    </SiteLayout>
  ),
});

function AdminCourses() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(adminListCourses);
  const create = useServerFn(saveCourse);
  const remove = useServerFn(deleteCourse);
  const [newTitle, setNewTitle] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => list(),
    retry: false,
    throwOnError: true,
  });

  const createMutation = useMutation({
    mutationFn: async (title: string) =>
      create({
        data: {
          title,
          slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
          category: "School",
          class_level: "Class 10",
          subject: "General",
          faculty: "KKCC Faculty",
          course_type: "Hybrid",
          status: "draft",
          thumbnail_url: null,
          summary: "",
          description: "",
          outcomes: [],
          price: 0,
          original_price: 0,
          discount_percent: 0,
          duration_hours: 0,
          lectures_count: 0,
          tests_count: 0,
          materials_count: 0,
          rating: 0,
          hue: 187,
          sort_order: courses.length,
        },
      }),
    onSuccess: (row) => {
      setNewTitle("");
      void qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success("Course created as draft");
      if (row?.id) void navigate({ to: "/admin/courses/$id", params: { id: row.id } });
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setPendingDelete(null);
      void qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success("Course deleted");
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Course manager"
        description="Create, edit and publish courses. Changes appear on the public site immediately."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" className="rounded-full">
            <Link to="/admin/tests">Write test questions</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/admin/exam-bank">Exam bank & syllabus</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/admin/ai-question-engine">AI question engine</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/materials">Study material & notes</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/offline-access">Offline access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/coupons">Coupons</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/notifications">Notifications</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/doubts">Doubts</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/enquiries">Enquiries</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/admin/security">Security & app controls</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/users">Admin users</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/payments">Payments</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/vouchers">Amazon / Flipkart rewards</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/storage">Storage</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/branding">Branding</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/content">Website content</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/text-manager">Text Manager</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/app-builder">App Builder</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/settings">Social/app links</Link>
          </Button>
        </div>
        <div className="surface-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />

          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New course title"
            maxLength={160}
            className="flex-1"
            aria-label="New course title"
          />
          <Button
            className="rounded-full"
            disabled={newTitle.trim().length < 2 || createMutation.isPending}
            onClick={() => createMutation.mutate(newTitle.trim())}
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-1.5 h-4 w-4" />
            )}
            Add course
          </Button>
        </div>

        <div className="mt-8 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading courses…</p>}
          {courses.map((c) => (
            <div
              key={c.id}
              className="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={c.status === "published" ? "default" : "secondary"}
                    className="rounded-full text-[11px] capitalize"
                  >
                    {c.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {c.category} · {c.class_level}
                  </span>
                </div>
                <p className="mt-2 truncate font-semibold">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.faculty} · {c.lectures_count} lectures · {formatINR(c.price)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to="/admin/courses/$id" params={{ id: c.id }}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive"
                  onClick={() => setPendingDelete(c)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && !courses.length && (
            <p className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              No courses yet. Add your first course above.
            </p>
          )}
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” and all of its lectures and study material will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}

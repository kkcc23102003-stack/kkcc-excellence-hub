import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createDoubt, listMyDoubts } from "@/lib/doubts.functions";
import { listPublishedCourses } from "@/lib/content.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/dashboard/doubts")({
  head: () => ({
    meta: [
      { title: "Ask Doubt — KKCC Dashboard" },
      {
        name: "description",
        content: "Ask academic doubts and receive answers from KKCC faculty.",
      },
      { property: "og:title", content: "Ask Doubt — KKCC" },
      { property: "og:description", content: "Doubt support for KKCC students." },
    ],
  }),
  component: DoubtsPage,
});

function DoubtsPage() {
  const qc = useQueryClient();
  const loadDoubts = useServerFn(listMyDoubts);
  const submitDoubt = useServerFn(createDoubt);
  const loadCourses = useServerFn(listPublishedCourses);
  const [courseId, setCourseId] = useState("general");
  const [subject, setSubject] = useState("General");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const doubtsQuery = useQuery({
    queryKey: ["dashboard", "doubts"],
    queryFn: () => loadDoubts(),
  });
  const coursesQuery = useQuery({
    queryKey: ["public", "courses", "doubt-picker"],
    queryFn: () => loadCourses(),
  });

  const courses = coursesQuery.data ?? [];
  const courseMap = new Map(courses.map((course) => [course.id, course.title]));

  const createMutation = useMutation({
    mutationFn: () =>
      submitDoubt({
        data: {
          course_id: courseId === "general" ? null : courseId,
          subject,
          title,
          message,
          attachment_url: attachmentUrl,
          priority,
        },
      }),
    onSuccess: () => {
      toast.success("Doubt sent to faculty");
      setTitle("");
      setMessage("");
      setAttachmentUrl("");
      setPriority("normal");
      void qc.invalidateQueries({ queryKey: ["dashboard", "doubts"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <HelpCircle className="h-7 w-7 text-primary" /> Ask a doubt
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Send your question. Faculty will answer it here, and you will also receive a personal
          notification.
        </p>
      </div>

      <form
        className="surface-panel space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          createMutation.mutate();
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Course / batch</Label>
            <select
              className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
            >
              <option value="general">General doubt</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Subject</Label>
            <Input
              className="mt-1.5"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Maths, Science, English..."
            />
          </div>
          <div>
            <Label>Priority</Label>
            <select
              className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={priority}
              onChange={(event) => setPriority(event.target.value as typeof priority)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High / urgent</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Short title</Label>
          <Input
            className="mt-1.5"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: I did not understand this quadratic equation step"
            maxLength={160}
          />
        </div>
        <div>
          <Label>Full doubt</Label>
          <Textarea
            className="mt-1.5 min-h-36"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write the question, page number, step, or concept details..."
            maxLength={6000}
          />
        </div>
        <div>
          <Label>Attachment link (optional)</Label>
          <Input
            className="mt-1.5"
            value={attachmentUrl}
            onChange={(event) => setAttachmentUrl(event.target.value)}
            placeholder="Paste Drive/photo/PDF link if needed"
            maxLength={4000}
          />
        </div>
        <Button
          className="rounded-full"
          disabled={
            createMutation.isPending || title.trim().length < 3 || message.trim().length < 8
          }
        >
          {createMutation.isPending ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-1.5 h-4 w-4" />
          )}
          Send doubt
        </Button>
      </form>

      <section>
        <h2 className="text-lg font-bold">My doubts</h2>
        <div className="mt-4 space-y-4">
          {doubtsQuery.isLoading && <div className="surface-panel p-6">Loading doubts...</div>}
          {(doubtsQuery.data ?? []).map((doubt) => (
            <article key={doubt.id} className="surface-panel p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={doubt.status === "answered" ? "default" : "secondary"}>
                  {doubt.status}
                </Badge>
                <Badge variant={doubt.priority === "high" ? "destructive" : "outline"}>
                  {doubt.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {doubt.course_id
                    ? courseMap.get(doubt.course_id) || "Selected course"
                    : "General"}{" "}
                  · {doubt.subject}
                </span>
              </div>
              <h3 className="mt-3 font-semibold">{doubt.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                {doubt.message}
              </p>
              {doubt.attachment_url && (
                <a
                  href={doubt.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Open attachment
                </a>
              )}
              {doubt.admin_reply ? (
                <div className="mt-4 rounded-2xl border bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Faculty answer
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm">{doubt.admin_reply}</p>
                </div>
              ) : (
                <p className="mt-4 text-xs text-muted-foreground">
                  Faculty reply pending. You will see the answer here.
                </p>
              )}
            </article>
          ))}
          {!doubtsQuery.isLoading && (doubtsQuery.data ?? []).length === 0 && (
            <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
              No doubts yet. Send your first doubt above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

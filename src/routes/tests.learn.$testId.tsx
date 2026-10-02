import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { LearningFlow } from "@/components/kkcc/learning-flow";

export const Route = createFileRoute("/tests/learn/$testId")({
  ssr: false,
  validateSearch: z.object({ subject: z.string().optional(), chapter: z.string().optional() }),
  beforeLoad: async ({ location }) => {
    if (!isSupabaseConfigured())
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
  },
  head: () => ({
    meta: [{ title: "Start Learning — KKCC" }, { name: "robots", content: "noindex" }],
  }),
  component: IndividualLearning,
});
function IndividualLearning() {
  const { testId } = Route.useParams();
  const { subject, chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <LearningFlow
      selection={{ test_id: testId }}
      subject={subject}
      chapter={chapter}
      select={(nextSubject, nextChapter) => {
        void navigate({
          search: {
            ...(nextSubject ? { subject: nextSubject } : {}),
            ...(nextChapter ? { chapter: nextChapter } : {}),
          },
        });
      }}
    />
  );
}

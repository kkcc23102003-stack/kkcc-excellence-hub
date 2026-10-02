/** Historical deployment entry point is deliberately disabled.
 * Research now runs in src/lib/ai-question-research.server.ts on the app server.
 * Supabase is ONLY student/auth/profile/access-related data. No targets,
 * question candidates, options, answers, review indexes or educational config
 * may be inserted into Supabase. This preserves the admin research feature
 * through runAIQuestionEngine without a second question system.
 */
Deno.serve(
  () =>
    new Response(
      JSON.stringify({
        error:
          "Research moved to the application server. Use Admin → AI Question Engine or the authenticated app cron route.",
      }),
      { status: 410, headers: { "content-type": "application/json", "cache-control": "no-store" } },
    ),
);

import { createHash } from "node:crypto";
import { z } from "zod";
import { projectContent, type AIContentRow } from "@/lib/project-content.server";
import { checkDeterministicQuality } from "@/lib/exam-bank/deterministic-quality";
import { unwrap } from "@/lib/learning.server";

const candidateSchema = z.object({
  prompt: z.string().trim().min(25).max(3000),
  options: z.array(z.string().trim().min(1).max(700)).length(4),
  correct_index: z.number().int().min(0).max(3),
  explanation: z.string().trim().min(40).max(3000),
  difficulty: z.enum(["Easy", "Moderate", "Difficult"]),
  quality_score: z.number().min(0).max(100),
  source_notes: z.string().max(3000).optional().default(""),
});
/** Runs on the APP server; no questions, targets, candidate indexes or API keys go to Supabase. */
export async function runProjectAIResearch(actor: string) {
  const rows = unwrap(await projectContent.from("private_settings").select("key,value"));
  const settings = new Map(rows.map((row) => [row.key, row.value]));
  if (settings.get("ai_question_engine_enabled") !== "true")
    throw new Error("AI research is disabled. Enable it in Admin after configuring the key.");
  const key = settings.get("ai_question_engine_gemini_api_key");
  if (!key) throw new Error("Configure the server-only research API key first.");
  const day = new Date().toISOString().slice(0, 10);
  const previous = unwrap(
    await projectContent
      .from("ai_question_candidates")
      .select("id")
      .gte("created_at", `${day}T00:00:00Z`),
  );
  const remaining = Math.max(
    0,
    Math.min(100, Number(settings.get("ai_question_engine_daily_limit") || 30)) - previous.length,
  );
  if (!remaining)
    return { generated: 0, remaining: 0, message: "Daily review-candidate limit reached." };
  const targets = unwrap(
    await projectContent
      .from("ai_question_targets")
      .select("*")
      .eq("enabled", true)
      .order("priority", { ascending: false })
      .order("last_run_at")
      .limit(Math.min(3, remaining)),
  );
  let generated = 0;
  for (const target of targets) {
    const model = settings.get("ai_question_engine_model") || "gemini-2.5-flash";
    const prompt = `Create ONE ORIGINAL PRACTICE multiple-choice question for exam ${target.exam}, subject ${target.subject}, chapter ${target.topic}. Never claim it is official or a PYQ, and do not invent an exam year or provenance. Return JSON only: prompt, four options, correct_index 0-3, explanation, difficulty Easy|Moderate|Difficult, quality_score 0-100 and source_notes. If unsure of the facts or current syllabus, set quality_score to zero. Human review is mandatory.`;
    const request: {
      contents: { role: string; parts: { text: string }[] }[];
      tools?: { google_search: object }[];
    } = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    if (settings.get("ai_question_engine_google_search") !== "false")
      request.tools = [{ google_search: {} }];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!response.ok)
      throw new Error(
        `Research provider rejected the request (${response.status}); check server configuration. The secret key was not logged.`,
      );
    const payload = (await response.json()) as {
      candidates?: {
        content?: { parts?: { text?: string }[] };
        groundingMetadata?: { groundingChunks?: { web?: { uri?: string } }[] };
      }[];
    };
    const text =
      payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, ""));
    } catch {
      continue;
    }
    const validated = candidateSchema.safeParse(parsed);
    if (!validated.success) continue;
    const candidate = validated.data;
    if (
      new Set(candidate.options.map((option) => option.toLowerCase())).size !== 4 ||
      candidate.quality_score < Number(settings.get("ai_question_engine_min_quality") || 85)
    )
      continue;
    const answer = candidate.options[candidate.correct_index]!;
    const quality = checkDeterministicQuality({
      prompt: candidate.prompt,
      answer,
      distractors: candidate.options.filter((_, index) => index !== candidate.correct_index),
      explanation: candidate.explanation,
      difficulty: candidate.difficulty,
      subject: target.subject,
      topic: target.topic,
      exams: [target.exam],
    });
    if (!quality.publishable) continue;
    const duplicate_key = createHash("sha256")
      .update(
        `${target.exam}|${target.subject}|${target.topic}|${candidate.prompt.toLowerCase().replace(/\s+/g, " ")}`,
      )
      .digest("hex");
    const saved = await projectContent.from("ai_question_candidates").upsert(
      {
        ...candidate,
        exam: target.exam,
        subject: target.subject,
        topic: target.topic,
        quality_score: Math.min(quality.score, Math.round(candidate.quality_score)),
        source_urls:
          payload.candidates?.[0]?.groundingMetadata?.groundingChunks?.flatMap((chunk) =>
            chunk.web?.uri ? [chunk.web.uri] : [],
          ) ?? [],
        status: "review",
        duplicate_key,
        archive_key: null,
        archive_provider: "project",
        reviewed_by: null,
        reviewed_at: null,
        provenance: "practice",
        generated_by: actor,
      } as Partial<AIContentRow>,
      { onConflict: "duplicate_key", ignoreDuplicates: true },
    );
    if (saved.error) throw new Error(saved.error.message);
    if (saved.data.length) generated += 1;
    unwrap(
      await projectContent
        .from("ai_question_targets")
        .update({ last_run_at: new Date().toISOString() })
        .eq("id", target.id),
    );
  }
  return {
    generated,
    targets: targets.length,
    remaining: remaining - generated,
    review_required: true,
  };
}

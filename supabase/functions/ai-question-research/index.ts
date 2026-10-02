import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PutObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";

type ArchiveSettings = {
  provider: string;
  bucket: string;
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
};

type ArchivedAIQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  quality_score: number;
  source_urls: string[];
  source_notes: string;
  status: "review" | "approved";
  created_at: string;
};

type QuestionDraft = Omit<
  ArchivedAIQuestion,
  "id" | "exam" | "subject" | "topic" | "source_urls" | "status" | "created_at"
>;
type JsonRecord = Record<string, unknown>;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

function norm(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, " ");
}
function key(prompt: string, exam: string, subject: string, topic: string) {
  return [exam, subject, topic, norm(prompt)].join("|");
}

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function firstCandidate(data: unknown): JsonRecord | null {
  const candidates = asRecord(data)?.candidates;
  return Array.isArray(candidates) ? asRecord(candidates[0]) : null;
}

function modelText(data: unknown): string {
  const content = asRecord(firstCandidate(data)?.content);
  const parts = Array.isArray(content?.parts) ? content.parts : [];
  return parts
    .map((part) => asRecord(part)?.text)
    .filter((text): text is string => typeof text === "string")
    .join("");
}

function modelSourceUrls(data: unknown): string[] {
  const metadata = asRecord(firstCandidate(data)?.groundingMetadata);
  const chunks = Array.isArray(metadata?.groundingChunks) ? metadata.groundingChunks : [];
  return chunks
    .map((chunk) => asRecord(asRecord(chunk)?.web)?.uri)
    .filter((uri): uri is string => typeof uri === "string" && uri.length > 0);
}

function parseQuestionDraft(text: string): QuestionDraft | null {
  let decoded: unknown;
  try {
    decoded = JSON.parse(
      text
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim(),
    );
  } catch {
    return null;
  }
  const record = asRecord(decoded);
  const rawOptions = record?.options;
  const correctIndex = record?.correct_index;
  if (
    !record ||
    typeof record.prompt !== "string" ||
    !Array.isArray(rawOptions) ||
    !Number.isInteger(correctIndex) ||
    typeof correctIndex !== "number" ||
    correctIndex < 0 ||
    correctIndex > 3 ||
    typeof record.explanation !== "string"
  ) {
    return null;
  }
  const options = rawOptions.filter((option): option is string => typeof option === "string");
  const qualityScore = Number(record.quality_score);
  if (
    options.length !== 4 ||
    options.length !== rawOptions.length ||
    !Number.isFinite(qualityScore)
  ) {
    return null;
  }
  const difficulty = record.difficulty;
  return {
    prompt: record.prompt,
    options,
    correct_index: correctIndex,
    explanation: record.explanation,
    difficulty:
      difficulty === "Easy" || difficulty === "Moderate" || difficulty === "Difficult"
        ? difficulty
        : "Moderate",
    quality_score: qualityScore,
    source_notes: typeof record.source_notes === "string" ? record.source_notes : "",
  };
}

async function isAdmin(supabase: ReturnType<typeof createClient>, req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) return false;
  const token = auth.replace(/^Bearer\s+/i, "");
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) return false;
  const { data } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  return !!data;
}

async function getArchiveSettings(supabase: ReturnType<typeof createClient>) {
  const [{ data: pub, error: pe }, { data: priv, error: se }] = await Promise.all([
    supabase
      .from("site_settings")
      .select("key,value")
      .in("key", [
        "storage_provider",
        "storage_bucket",
        "storage_region",
        "storage_endpoint",
        "storage_public_base_url",
      ]),
    supabase
      .from("private_settings")
      .select("key,value")
      .in("key", ["storage_access_key_id", "storage_secret_access_key"]),
  ]);
  if (pe) throw new Error(pe.message);
  if (se) throw new Error(se.message);
  const m = new Map<string, string>();
  for (const r of [...(pub ?? []), ...(priv ?? [])]) m.set(r.key, r.value ?? "");
  const provider = m.get("storage_provider") || "supabase";
  const accessKeyId = m.get("storage_access_key_id") || "",
    secretAccessKey = m.get("storage_secret_access_key") || "";
  if (provider === "supabase" || provider === "external_url" || !accessKeyId || !secretAccessKey)
    throw new Error(
      "External question archive is not configured. Set an S3-compatible provider in Admin → Storage.",
    );
  return {
    provider,
    bucket: m.get("storage_bucket") || "course-content",
    region: m.get("storage_region") || "auto",
    endpoint: m.get("storage_endpoint") || "",
    accessKeyId,
    secretAccessKey,
  };
}
function archiveClient(s: ArchiveSettings) {
  return new S3Client({
    region: s.region || "auto",
    ...(s.endpoint ? { endpoint: s.endpoint } : {}),
    forcePathStyle: s.provider !== "aws_s3",
    credentials: { accessKeyId: s.accessKeyId, secretAccessKey: s.secretAccessKey },
  });
}
function archiveKey(id: string) {
  return `kkcc-question-bank/v1/${id.slice(0, 2)}/${id}.json`;
}
async function archiveQuestion(supabase: ReturnType<typeof createClient>, q: ArchivedAIQuestion) {
  const s = await getArchiveSettings(supabase);
  const id = q.id;
  const key = archiveKey(id);
  await archiveClient(s).send(
    new PutObjectCommand({
      Bucket: s.bucket,
      Key: key,
      Body: JSON.stringify(q),
      ContentType: "application/json",
      CacheControl: "private,no-store",
    }),
  );
  return { key, provider: s.provider };
}

async function run() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("Supabase Edge Function secrets are not configured.");

  const supabase = createClient(url, serviceKey);
  const { data: settings, error: settingsError } = await supabase
    .from("private_settings")
    .select("key,value")
    .in("key", [
      "ai_question_engine_enabled",
      "ai_question_engine_model",
      "ai_question_engine_daily_limit",
      "ai_question_engine_min_quality",
      "ai_question_engine_auto_publish",
      "ai_question_engine_google_search",
      "ai_question_engine_gemini_api_key",
    ]);
  if (settingsError) throw new Error(settingsError.message);

  const cfg = new Map<string, string>((settings ?? []).map((row) => [row.key, row.value ?? ""]));
  if (cfg.get("ai_question_engine_enabled") !== "true") {
    return { skipped: true, reason: "AI engine is disabled" };
  }

  const apiKey = (cfg.get("ai_question_engine_gemini_api_key") ?? "").trim();
  if (!apiKey) return { skipped: true, reason: "Gemini API key is not configured" };

  const dailyLimit = Math.max(
    1,
    Math.min(100, Number(cfg.get("ai_question_engine_daily_limit") || 30)),
  );
  const minQuality = Math.max(
    70,
    Math.min(100, Number(cfg.get("ai_question_engine_min_quality") || 85)),
  );
  const autoPublish = cfg.get("ai_question_engine_auto_publish") === "true";
  const googleSearch = cfg.get("ai_question_engine_google_search") === "true";
  const model = cfg.get("ai_question_engine_model") || "gemini-2.5-flash";

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("ai_question_candidates")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if (countError) throw new Error(countError.message);
  const remaining = Math.max(0, dailyLimit - (count ?? 0));
  if (!remaining) return { skipped: true, reason: "daily limit reached" };

  const { data: targets, error: targetsError } = await supabase
    .from("ai_question_targets")
    .select("*")
    .eq("enabled", true)
    .order("priority", { ascending: false })
    .order("next_run_at", { ascending: true, nullsFirst: true })
    .limit(Math.min(3, remaining));
  if (targetsError) throw new Error(targetsError.message);
  if (!targets?.length) return { skipped: true, reason: "no enabled targets" };

  let generated = 0;
  for (const target of targets) {
    const prompt = `You are KKCC Excellence Hub's exam-question research and verification engine.\n\nCreate exactly ONE high-yield multiple-choice question for ${target.exam}, subject ${target.subject}, topic ${target.topic}. Use current web research and authentic/authoritative sources where useful. Prioritize syllabus alignment, established PYQ patterns, recurring concepts and exam relevance. Never invent facts. Do not copy a copyrighted question verbatim.\n\nReturn ONLY valid JSON with: prompt, options (exactly 4 strings), correct_index (0-3), explanation, difficulty (Easy|Moderate|Difficult), quality_score (0-100), source_notes. The quality score must reflect factual confidence, syllabus fit, clarity, distractor quality and exam relevance. Reject ambiguity.\n\nMinimum standard: the question must be suitable for a serious paid test bank. If you cannot verify it confidently, return quality_score 0.`;
    const requestBody: {
      contents: Array<{ role: "user"; parts: Array<{ text: string }> }>;
      tools?: Array<{ google_search: Record<string, never> }>;
    } = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    if (googleSearch) requestBody.tools = [{ google_search: {} }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      },
    );
    if (!response.ok) continue;

    const responseData: unknown = await response.json();
    const question = parseQuestionDraft(modelText(responseData));
    if (!question) continue;
    if (
      question.prompt.trim().length < 12 ||
      question.options.length !== 4 ||
      new Set(question.options.map((option) => norm(option))).size !== 4 ||
      !Number.isFinite(question.quality_score) ||
      question.quality_score < minQuality ||
      question.explanation.trim().length < 24
    ) {
      continue;
    }

    const duplicateKey = key(question.prompt, target.exam, target.subject, target.topic);
    const id = crypto.randomUUID();
    const status: ArchivedAIQuestion["status"] =
      autoPublish && question.quality_score >= minQuality ? "approved" : "review";
    const archivePayload: ArchivedAIQuestion = {
      id,
      prompt: question.prompt.trim(),
      options: question.options.map((option) => option.trim()),
      correct_index: question.correct_index,
      explanation: question.explanation.trim(),
      exam: target.exam,
      subject: target.subject,
      topic: target.topic,
      difficulty: question.difficulty,
      quality_score: Math.round(question.quality_score),
      source_urls: modelSourceUrls(responseData),
      source_notes: question.source_notes.trim(),
      status,
      created_at: new Date().toISOString(),
    };
    const archived = await archiveQuestion(supabase, archivePayload);
    const { error: insertError } = await supabase.from("ai_question_candidates").upsert(
      {
        id,
        prompt: null,
        options: null,
        explanation: null,
        correct_index: question.correct_index,
        exam: target.exam,
        subject: target.subject,
        topic: target.topic,
        difficulty: archivePayload.difficulty,
        quality_score: archivePayload.quality_score,
        source_urls: archivePayload.source_urls,
        source_notes: archivePayload.source_notes,
        status,
        duplicate_key: duplicateKey,
        archive_key: archived.key,
        archive_provider: archived.provider,
      },
      { onConflict: "duplicate_key", ignoreDuplicates: true },
    );
    if (!insertError) generated++;
    await supabase
      .from("ai_question_targets")
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      })
      .eq("id", target.id);
  }
  await supabase.rpc("ai_question_engine_cleanup");
  return { generated, targets: targets.length, remaining: remaining - generated };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, serviceKey);
    const cronSecret = Deno.env.get("AI_CRON_SECRET");
    const supplied = req.headers.get("x-cron-secret");
    const authorizedCron = !!cronSecret && supplied === cronSecret;
    if (!authorizedCron && !(await isAdmin(supabase, req)))
      return json({ error: "Forbidden" }, 403);
    return json(await run());
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "AI engine failed" }, 500);
  }
});

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DB } from "@/integrations/supabase/db";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type ArchivedAIQuestion = {
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
  created_at: string;
  status: "review" | "approved" | "rejected";
};

type Settings = {
  provider: string;
  bucket: string;
  region: string;
  endpoint: string;
  publicBaseUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
};

async function settings(supabase: SupabaseClient<DB>): Promise<Settings> {
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
  return {
    provider: m.get("storage_provider") || "supabase",
    bucket: m.get("storage_bucket") || "course-content",
    region: m.get("storage_region") || "auto",
    endpoint: m.get("storage_endpoint") || "",
    publicBaseUrl: m.get("storage_public_base_url") || "",
    accessKeyId: m.get("storage_access_key_id") || "",
    secretAccessKey: m.get("storage_secret_access_key") || "",
  };
}
function client(s: Settings) {
  if (s.provider === "supabase" || s.provider === "external_url")
    throw new Error(
      "AI question archive needs an external S3-compatible storage provider. Configure R2, AWS S3, Backblaze B2 or Wasabi in Admin → Storage.",
    );
  if (!s.accessKeyId || !s.secretAccessKey)
    throw new Error("External archive storage credentials are not configured.");
  return new S3Client({
    region: s.region || "auto",
    ...(s.endpoint ? { endpoint: s.endpoint } : {}),
    forcePathStyle: s.provider !== "aws_s3",
    credentials: { accessKeyId: s.accessKeyId, secretAccessKey: s.secretAccessKey },
  });
}
export function archiveKey(id: string) {
  return `kkcc-question-bank/v1/${id.slice(0, 2)}/${id}.json`;
}
export async function putArchivedQuestion(supabase: SupabaseClient<DB>, q: ArchivedAIQuestion) {
  const s = await settings(supabase);
  const c = client(s);
  const key = archiveKey(q.id);
  await c.send(
    new PutObjectCommand({
      Bucket: s.bucket,
      Key: key,
      Body: JSON.stringify(q),
      ContentType: "application/json",
      CacheControl: "private,no-store",
    }),
  );
  return { key, provider: s.provider, bucket: s.bucket };
}
export async function getArchivedQuestion(
  supabase: SupabaseClient<DB>,
  key: string,
): Promise<ArchivedAIQuestion> {
  const s = await settings(supabase);
  const c = client(s);
  const out = await c.send(new GetObjectCommand({ Bucket: s.bucket, Key: key }));
  const text = await out.Body?.transformToString();
  if (!text) throw new Error("Archived question is empty or missing");
  return JSON.parse(text) as ArchivedAIQuestion;
}

export const getAIQuestionArchiveStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const s = await settings(context.supabase);
    return {
      configured:
        s.provider !== "supabase" &&
        s.provider !== "external_url" &&
        !!s.accessKeyId &&
        !!s.secretAccessKey,
      provider: s.provider,
      bucket: s.bucket,
    };
  });

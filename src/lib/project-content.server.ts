import { MANAGED_CONTENT_TABLES, NOTES_SETUP_ERROR } from "./managed-content-tables";
/**
 * Shared CMS adapter: managed notes/settings/files use dedicated Supabase tables.
 * Explicit file mode supports local fixtures. Other educational tables retain
 * the existing remote/JSON backend path; template banks remain source files.
 * The seed is bundled server-side, never served from public/.
 */
import { randomUUID, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile, rename, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import seed from "../../data/project-content.json";
import type { DB } from "@/integrations/supabase/db";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const PROJECT_TABLES = [
  "courses",
  "lectures",
  "materials",
  "tests",
  "test_questions",
  "test_series_overrides",
  "site_settings",
  "private_settings",
  "storage_files",
  "files",
  "ai_question_targets",
  "ai_question_candidates",
  "ai_question_runs",
] as const;
export type ProjectTable = (typeof PROJECT_TABLES)[number];
type LegacyTables = DB["public"]["Tables"];
export type AIContentRow = {
  id: string;
  exam: string;
  subject: string;
  topic: string;
  difficulty: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
  quality_score: number;
  source_urls: string[];
  source_notes: string;
  status: string;
  duplicate_key: string;
  archive_key: string | null;
  archive_provider: string;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  enabled: boolean;
  priority: number;
  last_run_at: string | null;
  next_run_at: string | null;
};
type ProjectRows = {
  [K in ProjectTable]: K extends keyof LegacyTables ? LegacyTables[K]["Row"] : AIContentRow;
};
type AnyRow = Record<string, unknown>;
export type ContentDocument = {
  version: number;
  tables: Record<string, AnyRow[]>;
  history?: { table: string; row: AnyRow; operation: string; at: string }[];
};
type Result<T> = { data: T; error: { message: string; code: string } | null; count: number | null };

function copy<T>(value: T): T {
  return structuredClone(value);
}
function seedDocument(): ContentDocument {
  return copy(seed) as ContentDocument;
}
function backend() {
  return process.env["KKCC_CONTENT_BACKEND"] || (process.env["VERCEL"] ? "readonly" : "file");
}
function filePath() {
  return resolve(process.env["KKCC_CONTENT_FILE"] || "data/project-content.runtime.json");
}
function s3() {
  const endpoint = process.env["KKCC_CONTENT_ENDPOINT"];
  return new S3Client({
    region: process.env["KKCC_CONTENT_REGION"] || "auto",
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    ...(process.env["KKCC_CONTENT_ACCESS_KEY_ID"]
      ? {
          credentials: {
            accessKeyId: process.env["KKCC_CONTENT_ACCESS_KEY_ID"]!,
            secretAccessKey: process.env["KKCC_CONTENT_SECRET_ACCESS_KEY"] || "",
          },
        }
      : {}),
  });
}
function objectAddress() {
  const Bucket = process.env["KKCC_CONTENT_BUCKET"];
  if (!Bucket) throw new Error("KKCC_CONTENT_BUCKET is required for persistent project content.");
  return { Bucket, Key: process.env["KKCC_CONTENT_KEY"] || "kkcc/project-content-v1.json" };
}

let cachedFileDoc: { path: string; mtimeMs: number; document: ContentDocument } | null = null;
const missingRemoteTables = new Set<string>();
const remoteSelectCache = new Map<string, { expiresAt: number; result: Result<unknown> }>();

export function invalidateProjectContentCache(table?: string) {
  if (!table) {
    remoteSelectCache.clear();
    return;
  }
  for (const key of remoteSelectCache.keys()) {
    if (key.startsWith(`${MANAGED_CONTENT_TABLES[table] || table}:`)) remoteSelectCache.delete(key);
  }
}

export function flushProjectContentCaches() {
  const clearedSelectEntries = remoteSelectCache.size;
  const clearedMissingTables = missingRemoteTables.size;
  remoteSelectCache.clear();
  missingRemoteTables.clear();
  cachedFileDoc = null;
  return { clearedSelectEntries, clearedMissingTables };
}

export async function readProjectDocument(): Promise<{ document: ContentDocument; etag?: string }> {
  if (backend() === "s3") {
    try {
      const out = await s3().send(new GetObjectCommand(objectAddress()));
      const text = await out.Body?.transformToString();
      if (!text) throw new Error("Project content object is empty.");
      return {
        document: JSON.parse(text) as ContentDocument,
        ...(out.ETag ? { etag: out.ETag } : {}),
      };
    } catch (error) {
      if ((error as { name?: string }).name !== "NoSuchKey") throw error;
      return { document: seedDocument() };
    }
  }
  if (backend() === "readonly") return { document: seedDocument() };
  const path = filePath();
  try {
    const fileStat = await stat(path);
    if (
      cachedFileDoc &&
      cachedFileDoc.path === path &&
      cachedFileDoc.mtimeMs === fileStat.mtimeMs
    ) {
      return { document: copy(cachedFileDoc.document) };
    }
    const parsed = JSON.parse(await readFile(path, "utf8")) as ContentDocument;
    cachedFileDoc = { path, mtimeMs: fileStat.mtimeMs, document: copy(parsed) };
    return { document: parsed };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return { document: seedDocument() };
  }
}

/** Compare-and-swap on S3; cross-process exclusive lock + atomic rename on a volume. */
export async function mutateProjectDocument<T>(
  mutate: (document: ContentDocument) => T,
): Promise<T> {
  if (backend() === "readonly")
    throw new Error(
      "Project content is read-only. Configure private S3 storage or a persistent volume before editing.",
    );
  if (backend() === "s3") {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const { document, etag } = await readProjectDocument();
      const result = mutate(document);
      try {
        await s3().send(
          new PutObjectCommand({
            ...objectAddress(),
            Body: JSON.stringify(document),
            ContentType: "application/json",
            CacheControl: "private,no-store",
            ...(etag ? { IfMatch: etag } : { IfNoneMatch: "*" }),
          }),
        );
        return result;
      } catch (error) {
        if (
          (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode !== 412
        )
          throw error;
      }
    }
    throw new Error("Content was changed by another administrator. Please retry.");
  }
  const path = filePath();
  await mkdir(dirname(path), { recursive: true });
  const lock = `${path}.lock`;
  let locked = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      await mkdir(lock);
      locked = true;
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      // Recover a lock abandoned by a killed worker, never a live short write.
      const details = await stat(lock).catch(() => null);
      if (details && Date.now() - details.mtimeMs > 60_000)
        await rm(lock, { recursive: true, force: true });
      await new Promise((done) => setTimeout(done, 20));
    }
  }
  if (!locked) throw new Error("Another content write is in progress. Please retry.");
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    const { document } = await readProjectDocument();
    const result = mutate(document);
    await writeFile(temporary, JSON.stringify(document, null, 2), { mode: 0o600 });
    await rename(temporary, path);
    cachedFileDoc = null;
    return result;
  } finally {
    await rm(temporary, { force: true });
    await rm(lock, { recursive: true, force: true });
  }
}

function encryptionKey() {
  const value = process.env["KKCC_SETTINGS_ENCRYPTION_KEY"] || "";
  if (!/^[a-f\d]{64}$/i.test(value))
    throw new Error(
      "Set a server-only, 32-byte hex KKCC_SETTINGS_ENCRYPTION_KEY before saving private settings.",
    );
  return Buffer.from(value, "hex");
}
function encrypt(value: string) {
  if (!value) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const body = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `enc:v1:${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${body.toString("hex")}`;
}
function decrypt(value: string) {
  if (!value) return "";
  if (!value.startsWith("enc:v1:"))
    throw new Error(
      "Unencrypted private setting detected; import it with the secure migration script.",
    );
  const [, , iv, tag, body] = value.split(":");
  const cipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv!, "hex"));
  cipher.setAuthTag(Buffer.from(tag!, "hex"));
  return Buffer.concat([cipher.update(Buffer.from(body!, "hex")), cipher.final()]).toString("utf8");
}

/** Owner CLI transfer helpers; this entire module is server-only and never bundled to browsers. */
export function encryptPrivateSettingForTransfer(value: string) {
  return value.startsWith("enc:v1:") ? (decrypt(value), value) : encrypt(value);
}
export function privateSettingForImport(value: string) {
  return value.startsWith("enc:v1:") ? decrypt(value) : value;
}

const defaults: Record<string, AnyRow> = {
  courses: {
    slug: "",
    title: "",
    category: "",
    class_level: "",
    subject: "",
    faculty: "",
    course_type: "Recorded",
    thumbnail_url: null,
    hue: 200,
    summary: "",
    description: "",
    outcomes: [],
    price: 0,
    coin_price: 0,
    original_price: 0,
    discount_percent: 0,
    duration_hours: 0,
    lectures_count: 0,
    tests_count: 0,
    materials_count: 0,
    rating: 0,
    status: "draft",
    sort_order: 0,
  },
  lectures: {
    course_id: null,
    module_title: "",
    title: "",
    description: "",
    video_url: null,
    duration: "",
    is_free: false,
    sort_order: 0,
  },
  materials: {
    course_id: null,
    lecture_id: null,
    title: "",
    description: "",
    subject: "",
    chapter: "",
    class_level: "",
    pages: 0,
    file_url: null,
    thumbnail_url: null,
    module_title: "",
    batch: "",
    material_type: "Notes",
    access_type: "free",
    price: 0,
    coin_price: 0,
    is_published: false,
    sort_order: 0,
  },
  tests: {
    course_id: null,
    lecture_id: null,
    title: "",
    instructions: "",
    subject: "",
    duration_minutes: 60,
    question_timer_seconds: 0,
    timer_mode: "test",
    questions_count: 0,
    total_marks: 0,
    is_published: false,
    sort_order: 0,
    exam_track: "",
    level: "Mixed",
    series_name: "",
    is_paid: false,
    price_inr: 0,
    price_coins: 0,
    question_source: "manual",
    generation_exam: "All Exams",
    generation_subject: "",
    generation_topic: "Mixed",
    generation_difficulty: "Mixed",
    generation_count: 0,
    syllabus_subject: "",
    syllabus_chapter: "",
    syllabus_topic: "",
    generation_marks: 1,
    generation_negative_marks: 0,
  },
  test_questions: {
    test_id: null,
    subject: "",
    question_text: "",
    options: [],
    correct_index: 0,
    marks: 1,
    negative_marks: 0,
    explanation: "",
    sort_order: 0,
    provenance: "practice",
  },
  test_series_overrides: {
    enabled: true,
    name: null,
    summary: null,
    price_inr: null,
    price_coins: null,
    sort_order: null,
    updated_by: null,
  },
  site_settings: { value: "" },
  private_settings: { value: "", updated_by: null },
};

function refreshCounts(doc: ContentDocument) {
  for (const test of doc.tables["tests"] ?? []) {
    if (test["question_source"] === "deterministic") continue;
    const rows = (doc.tables["test_questions"] ?? []).filter((q) => q["test_id"] === test["id"]);
    test["questions_count"] = rows.length;
    test["total_marks"] = rows.reduce((sum, q) => sum + Number(q["marks"] || 0), 0);
  }
  for (const course of doc.tables["courses"] ?? []) {
    for (const [field, table] of [
      ["lectures_count", "lectures"],
      ["tests_count", "tests"],
      ["materials_count", "materials"],
    ]) {
      course[field!] = (doc.tables[table!] ?? []).filter(
        (row) => row["course_id"] === course["id"],
      ).length;
    }
  }
}

class ContentQuery<Row extends object, Output = Row[]> implements PromiseLike<Result<Output>> {
  private filters: ((row: AnyRow) => boolean)[] = [];
  private remoteFilters: { op: string; key: string; value: unknown }[] = [];
  private orders: { key: string; ascending: boolean }[] = [];
  private cap = Infinity;
  private offset = 0;
  private operation = "select";
  private payload: AnyRow[] = [];
  private conflict = "";
  private ignoreDuplicates = false;
  private cardinality = "many";
  private head = false;
  private selectColumns = "*";
  private execution?: Promise<Result<Output>>;
  constructor(private table: ProjectTable) {}
  select(columns = "*", options?: { count?: string; head?: boolean }) {
    this.selectColumns = columns;
    this.head = options?.head ?? false;
    return this;
  }
  eq(key: string, value: unknown) {
    this.filters.push((row) => row[key] === value);
    this.remoteFilters.push({ op: "eq", key, value });
    return this;
  }
  gte(key: string, value: string | number) {
    this.filters.push((row) => (row[key] as string | number) >= value);
    this.remoteFilters.push({ op: "gte", key, value });
    return this;
  }
  lte(key: string, value: string | number) {
    this.filters.push((row) => (row[key] as string | number) <= value);
    this.remoteFilters.push({ op: "lte", key, value });
    return this;
  }
  neq(key: string, value: unknown) {
    this.filters.push((row) => row[key] !== value);
    this.remoteFilters.push({ op: "neq", key, value });
    return this;
  }
  is(key: string, value: unknown) {
    this.filters.push((row) => row[key] === value);
    this.remoteFilters.push({ op: "is", key, value });
    return this;
  }
  in(key: string, values: readonly unknown[]) {
    this.filters.push((row) => values.includes(row[key]));
    this.remoteFilters.push({ op: "in", key, value: values });
    return this;
  }
  ilike(key: string, value: string) {
    const escaped = value
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/%/g, ".*")
      .replace(/_/g, ".");
    const re = new RegExp(`^${escaped}$`, "i");
    this.filters.push((row) => re.test(String(row[key] ?? "")));
    this.remoteFilters.push({ op: "ilike", key, value });
    return this;
  }
  order(key: string, options?: { ascending?: boolean }) {
    this.orders.push({ key, ascending: options?.ascending ?? true });
    return this;
  }
  limit(value: number) {
    this.cap = value;
    return this;
  }
  range(from: number, to: number) {
    this.offset = from;
    this.cap = to - from + 1;
    return this;
  }
  insert(value: Partial<Row> | Partial<Row>[]) {
    this.operation = "insert";
    this.payload = copy(Array.isArray(value) ? value : [value]) as AnyRow[];
    return this;
  }
  update(value: Partial<Row>) {
    this.operation = "update";
    this.payload = [copy(value) as AnyRow];
    return this;
  }
  delete() {
    this.operation = "delete";
    return this;
  }
  upsert(
    value: Partial<Row> | Partial<Row>[],
    options?: { onConflict?: string; ignoreDuplicates?: boolean },
  ) {
    this.operation = "upsert";
    this.payload = copy(Array.isArray(value) ? value : [value]) as AnyRow[];
    this.conflict = options?.onConflict || (this.table.endsWith("settings") ? "key" : "id");
    this.ignoreDuplicates = options?.ignoreDuplicates ?? false;
    return this;
  }
  single() {
    this.cardinality = "single";
    return this as unknown as ContentQuery<Row, Row>;
  }
  maybeSingle() {
    this.cardinality = "maybe";
    return this as unknown as ContentQuery<Row, Row | null>;
  }
  private matches(row: AnyRow) {
    return this.filters.every((filter) => filter(row));
  }
  private apply(doc: ContentDocument): AnyRow[] {
    const rows = doc.tables[this.table] ?? (doc.tables[this.table] = []);
    if (this.operation === "select") return rows.filter((row) => this.matches(row)).map(copy);
    const now = new Date().toISOString();
    const changed: AnyRow[] = [];
    doc.history ??= [];
    if (this.operation === "update" || this.operation === "delete") {
      for (let i = rows.length - 1; i >= 0; i -= 1) {
        const row = rows[i]!;
        if (!this.matches(row)) continue;
        doc.history.push({ table: this.table, row: copy(row), operation: this.operation, at: now });
        if (this.operation === "delete") {
          rows.splice(i, 1);
          changed.unshift(copy(row));
        } else {
          Object.assign(row, this.payload[0], { updated_at: now });
          changed.unshift(copy(row));
        }
      }
    } else {
      for (const item of this.payload) {
        const keys = this.conflict.split(",").filter(Boolean);
        const existing =
          this.operation === "upsert"
            ? rows.find((row) => keys.every((key) => row[key] === item[key]))
            : undefined;
        if (existing) {
          if (this.ignoreDuplicates) continue;
          doc.history.push({
            table: this.table,
            row: copy(existing),
            operation: "upsert",
            at: now,
          });
          Object.assign(existing, item, { updated_at: now });
          changed.push(copy(existing));
        } else {
          if (item["id"] && rows.some((row) => row["id"] === item["id"]))
            throw new Error("Duplicate content ID.");
          const row: AnyRow = {
            id: randomUUID(),
            ...(defaults[this.table] ?? {}),
            created_at: now,
            updated_at: now,
            ...item,
          };
          if (
            this.table === "courses" &&
            rows.some((existingRow) => existingRow["slug"] === row["slug"])
          )
            throw new Error("Course slug already exists.");
          rows.push(row);
          changed.push(copy(row));
        }
      }
    }
    if (this.table === "private_settings") {
      for (const row of rows)
        if (changed.some((item) => item["key"] === row["key"]))
          row["value"] = encrypt(String(row["value"] || ""));
      for (const entry of doc.history)
        if (
          entry.table === "private_settings" &&
          entry.row["value"] &&
          !String(entry.row["value"]).startsWith("enc:v1:")
        )
          entry.row["value"] = encrypt(String(entry.row["value"]));
    }
    refreshCounts(doc);
    return changed;
  }
  private async executeLocal(): Promise<Result<Output>> {
    try {
      let rows =
        this.operation === "select"
          ? this.apply((await readProjectDocument()).document)
          : await mutateProjectDocument((doc) => this.apply(doc));
      if (this.table === "private_settings" && this.operation === "select")
        rows = rows.map((row) => ({ ...row, value: decrypt(String(row["value"] || "")) }));
      const count = rows.length;
      if (this.orders.length)
        rows.sort((a, b) => {
          for (const { key, ascending } of this.orders) {
            const av = a[key] as string | number;
            const bv = b[key] as string | number;
            if (av === bv) continue;
            return (av < bv ? -1 : 1) * (ascending ? 1 : -1);
          }
          return 0;
        });
      rows = rows.slice(this.offset, this.offset + this.cap);
      if (this.cardinality === "single" && rows.length !== 1)
        throw new Error("Content row not found or not unique.");
      if (this.cardinality === "maybe" && rows.length > 1)
        throw new Error("Content row is not unique.");
      const data = this.head ? null : this.cardinality === "many" ? rows : (rows[0] ?? null);
      return { data: data as Output, error: null, count };
    } catch (error) {
      return {
        data: null as Output,
        error: {
          message: error instanceof Error ? error.message : String(error),
          code: "PROJECT_CONTENT_ERROR",
        },
        count: null,
      };
    }
  }
  private async execute(): Promise<Result<Output>> {
    if (
      process.env["KKCC_CONTENT_BACKEND"]?.toLowerCase() === "file" ||
      (!MANAGED_CONTENT_TABLES[this.table] && missingRemoteTables.has(this.table))
    ) {
      return this.executeLocal();
    }
    const managed = MANAGED_CONTENT_TABLES[this.table];
    const table = managed || this.table;
    const cacheKey =
      this.operation === "select"
        ? `${table}:${this.selectColumns}:${this.cardinality}:${this.head}:${this.offset}:${this.cap}:${JSON.stringify(this.remoteFilters)}:${JSON.stringify(this.orders)}`
        : "";
    if (cacheKey) {
      const hit = remoteSelectCache.get(cacheKey);
      if (hit && hit.expiresAt > Date.now()) {
        return copy(hit.result) as Result<Output>;
      }
    } else {
      invalidateProjectContentCache(table);
      if (table === "lectures" || table === "materials" || table === "tests") {
        invalidateProjectContentCache("courses");
      }
      if (table === "test_questions") {
        invalidateProjectContentCache("tests");
      }
    }
    try {
      type RemoteQuery = PromiseLike<{
        data: unknown;
        error: { message: string; code?: string } | null;
        count?: number | null;
      }> & {
        select: (cols?: string, opts?: { count?: string; head?: boolean }) => RemoteQuery;
        insert: (rows: unknown) => RemoteQuery;
        update: (row: unknown) => RemoteQuery;
        delete: () => RemoteQuery;
        upsert: (
          rows: unknown,
          opts?: { onConflict?: string | undefined; ignoreDuplicates?: boolean },
        ) => RemoteQuery;
        eq: (k: string, v: unknown) => RemoteQuery;
        neq: (k: string, v: unknown) => RemoteQuery;
        gte: (k: string, v: unknown) => RemoteQuery;
        lte: (k: string, v: unknown) => RemoteQuery;
        is: (k: string, v: unknown) => RemoteQuery;
        in: (k: string, v: readonly unknown[]) => RemoteQuery;
        ilike: (k: string, v: string) => RemoteQuery;
        order: (k: string, opts?: { ascending?: boolean }) => RemoteQuery;
        range: (from: number, to: number) => RemoteQuery;
        single: () => RemoteQuery;
        maybeSingle: () => RemoteQuery;
      };
      const client = supabaseAdmin as unknown as { from: (t: string) => RemoteQuery };
      let query: RemoteQuery;

      if (this.operation === "select") {
        query = client.from(table).select(this.selectColumns, {
          count: "exact",
          head: this.head,
        });
      } else if (this.operation === "insert") {
        query = client.from(table).insert(this.payload).select(this.selectColumns);
      } else if (this.operation === "update") {
        query = client.from(table).update(this.payload[0] ?? {});
      } else if (this.operation === "delete") {
        query = client.from(table).delete();
      } else {
        query = client
          .from(table)
          .upsert(this.payload, {
            onConflict: this.conflict || undefined,
            ignoreDuplicates: this.ignoreDuplicates,
          })
          .select(this.selectColumns);
      }

      for (const f of this.remoteFilters) {
        if (f.op === "eq") query = query.eq(f.key, f.value);
        else if (f.op === "neq") query = query.neq(f.key, f.value);
        else if (f.op === "gte") query = query.gte(f.key, f.value);
        else if (f.op === "lte") query = query.lte(f.key, f.value);
        else if (f.op === "is") query = query.is(f.key, f.value);
        else if (f.op === "in")
          query = query.in(f.key, Array.isArray(f.value) ? (f.value as unknown[]) : []);
        else if (f.op === "ilike") query = query.ilike(f.key, String(f.value));
      }
      for (const { key, ascending } of this.orders) query = query.order(key, { ascending });
      if (this.offset !== 0 || this.cap !== Infinity) {
        const to = this.cap === Infinity ? 999999999 : this.offset + this.cap - 1;
        query = query.range(this.offset, to);
      }
      if (this.operation === "update") query = query.select(this.selectColumns);
      if (this.cardinality === "single") query = query.single();
      else if (this.cardinality === "maybe") query = query.maybeSingle();

      const result = await query;
      if (result.error) {
        if (
          /unavailable in fixture|does not exist|schema cache|not configured|Missing Supabase/i.test(
            result.error.message || "",
          )
        ) {
          if (managed)
            return {
              data: null as Output,
              error: { message: NOTES_SETUP_ERROR, code: "NOTES_SETUP_REQUIRED" },
              count: null,
            };
          missingRemoteTables.add(table);
          return this.executeLocal();
        }
        return {
          data: null as Output,
          error: { message: result.error.message, code: result.error.code || "SUPABASE_ERROR" },
          count: result.count ?? null,
        };
      }
      const data = result.data as Output;
      const outResult: Result<Output> = {
        data,
        error: null,
        count:
          result.count ?? (Array.isArray(result.data) ? result.data.length : result.data ? 1 : 0),
      };
      if (cacheKey) {
        remoteSelectCache.set(cacheKey, {
          expiresAt: Date.now() + 4_000,
          result: copy(outResult) as Result<unknown>,
        });
      }
      return outResult;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (/not configured|Missing Supabase|unavailable in fixture|does not exist/i.test(msg)) {
        if (managed)
          return {
            data: null as Output,
            error: { message: NOTES_SETUP_ERROR, code: "NOTES_SETUP_REQUIRED" },
            count: null,
          };
        missingRemoteTables.add(table);
        return this.executeLocal();
      }
      return {
        data: null as Output,
        error: { message: msg, code: "SUPABASE_PROJECT_CONTENT_ERROR" },
        count: null,
      };
    }
  }
  then<A = Result<Output>, B = never>(
    resolveFn?: ((result: Result<Output>) => A | PromiseLike<A>) | null,
    rejectFn?: ((error: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    this.execution ??= this.execute();
    return this.execution.then(resolveFn, rejectFn);
  }
}

export const projectContent = {
  from<K extends ProjectTable>(table: K) {
    if (!PROJECT_TABLES.includes(table)) throw new Error(`Not a project-content table: ${table}`);
    return new ContentQuery<ProjectRows[K]>(table);
  },
};

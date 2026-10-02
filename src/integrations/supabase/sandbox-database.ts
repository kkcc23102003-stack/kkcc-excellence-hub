import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { DB as Database } from "./db";
import { SANDBOX_ADMIN_ID, SANDBOX_ADMIN_USER } from "./sandbox";

type SandboxRow = Record<string, unknown>;
type SandboxQueryResponse = {
  data: unknown;
  error: { message: string; code?: string } | null;
  count: number | null;
};

type Filter = (row: SandboxRow) => boolean;

type QueryState = {
  table: string;
  mutation: "insert" | "upsert" | "update" | "delete" | null;
  mutationData: SandboxRow | SandboxRow[] | null;
  conflictKeys: string[];
  filters: Filter[];
  anyFilters: Filter[];
  orders: Array<{ column: string; ascending: boolean; nullsFirst?: boolean }>;
  columns: string;
  returnRows: boolean;
  single: boolean;
  limit: number | null;
  range: [number, number] | null;
};

const SANDBOX_STUDENT_TEST_ID = "00000000-0000-4000-8000-000000000201";
const SANDBOX_DRAFT_TEST_ID = "00000000-0000-4000-8000-000000000202";
const SANDBOX_COURSE_ID = "00000000-0000-4000-8000-000000000101";
const SANDBOX_ENROLLED_SERIES_ID = "ppsc-pcs";
const secondsPerDay = 86_400_000;
const now = () => new Date().toISOString();

const SANDBOX_SEED: Record<string, SandboxRow[]> = {
  profiles: [
    {
      id: SANDBOX_ADMIN_ID,
      email: SANDBOX_ADMIN_USER.email,
      full_name: "Sandbox Admin",
      mobile: "",
      class_level: "",
      target_exam: "Punjab PCS",
      avatar_url: null,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  courses: [
    {
      id: SANDBOX_COURSE_ID,
      slug: "sandbox-physics-practice",
      title: "Sandbox Physics Practice Course",
      category: "School",
      class_level: "Class 11",
      subject: "Physics",
      faculty: "KKCC Demo Faculty",
      course_type: "Recorded",
      thumbnail_url: null,
      hue: 195,
      summary: "A demo course for safely exploring the editable KKCC admin experience.",
      description: "Sandbox-only sample content. Changes are held in local preview memory.",
      outcomes: ["Explore course administration", "Try safe local editing"],
      price: 0,
      coin_price: 0,
      original_price: 0,
      discount_percent: 0,
      duration_hours: 2,
      lectures_count: 1,
      tests_count: 1,
      materials_count: 0,
      rating: 4.8,
      status: "published",
      sort_order: 0,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  lectures: [
    {
      id: "00000000-0000-4000-8000-000000000111",
      course_id: SANDBOX_COURSE_ID,
      module_title: "Getting started",
      title: "How to use this sandbox course",
      description: "A seeded preview lesson; no video or private asset is attached.",
      video_url: null,
      duration: "10 min",
      is_free: true,
      sort_order: 0,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  tests: [
    {
      id: SANDBOX_STUDENT_TEST_ID,
      course_id: SANDBOX_COURSE_ID,
      lecture_id: null,
      title: "Sandbox generated test — editable draft",
      instructions: "Preview the admin test editor. No exam questions are seeded in this test.",
      subject: "Physics",
      duration_minutes: 30,
      question_timer_seconds: 0,
      timer_mode: "test",
      questions_count: 20,
      total_marks: 20,
      is_published: true,
      sort_order: 0,
      exam_track: "Punjab PCS",
      level: "Mixed",
      series_name: SANDBOX_ENROLLED_SERIES_ID,
      is_paid: false,
      price_inr: 0,
      price_coins: 0,
      question_source: "deterministic",
      generation_exam: "Punjab PCS",
      generation_subject: "Physics",
      generation_topic: "Mixed",
      generation_difficulty: "Mixed",
      generation_count: 20,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
    {
      id: SANDBOX_DRAFT_TEST_ID,
      course_id: SANDBOX_COURSE_ID,
      lecture_id: null,
      title: "Sandbox test publication review",
      instructions: "A second sample row for testing publish/unpublish and editing.",
      subject: "General Awareness",
      duration_minutes: 15,
      question_timer_seconds: 0,
      timer_mode: "test",
      questions_count: 0,
      total_marks: 0,
      is_published: false,
      sort_order: 1,
      exam_track: "Punjab PCS",
      level: "Difficult",
      series_name: SANDBOX_ENROLLED_SERIES_ID,
      is_paid: false,
      price_inr: 0,
      price_coins: 0,
      question_source: "manual",
      generation_exam: "Punjab PCS",
      generation_subject: "General Awareness",
      generation_topic: "Mixed",
      generation_difficulty: "Difficult",
      generation_count: 0,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  test_questions: [],
  test_access_grants: [],
  series_access_grants: [
    {
      id: "00000000-0000-4000-8000-000000000301",
      series_id: SANDBOX_ENROLLED_SERIES_ID,
      user_id: SANDBOX_ADMIN_ID,
      granted_by: SANDBOX_ADMIN_ID,
      method: "sandbox demo",
      amount_inr: 0,
      note: "Seeded local demo access; no real payment was made.",
      expires_at: new Date(Date.now() + 45 * secondsPerDay).toISOString(),
      revoked_at: null,
      created_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  test_series_overrides: [
    {
      series_id: SANDBOX_ENROLLED_SERIES_ID,
      enabled: true,
      name: null,
      summary: null,
      price_inr: null,
      price_coins: null,
      sort_order: null,
      updated_by: SANDBOX_ADMIN_ID,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  test_series_syllabi: [
    {
      series_id: SANDBOX_ENROLLED_SERIES_ID,
      exam_track: "Punjab PCS",
      syllabus: {
        subjects: [
          {
            name: "Punjab GK",
            bank_subject: "Punjab GK",
            chapters: [
              {
                name: "Punjab at a glance",
                topics: [
                  { name: "Districts and headquarters", bank_topic: "Districts and Headquarters" },
                  { name: "Punjab folk culture", bank_topic: "Folk Dances and Fairs" },
                ],
              },
            ],
          },
        ],
      },
      status: "published",
      updated_by: SANDBOX_ADMIN_ID,
      created_at: "2026-10-02T00:00:00.000Z",
      updated_at: "2026-10-02T00:00:00.000Z",
    },
  ],
  site_settings: [
    { key: "payment_provider", value: "razorpay", created_at: now(), updated_at: now() },
    { key: "payment_enabled", value: "false", created_at: now(), updated_at: now() },
    { key: "payment_mode", value: "test", created_at: now(), updated_at: now() },
    { key: "razorpay_key_id", value: "", created_at: now(), updated_at: now() },
    {
      key: "offline_payment_instructions",
      value: "Sandbox only — no payment provider is connected.",
      created_at: now(),
      updated_at: now(),
    },
  ],
  private_settings: [],
  ai_question_targets: [],
  ai_question_candidates: [],
  ai_question_bank: [],
};

// One editable store belongs to this Vite server process only. Production and
// configured Supabase deployments never import it as their persistence layer.
const sandboxTables = new Map<string, SandboxRow[]>(
  Object.entries(SANDBOX_SEED).map(([table, rows]) => [table, rows.map(cloneRow)]),
);

function cloneRow<T>(row: T): T {
  if (typeof structuredClone === "function") return structuredClone(row);
  return JSON.parse(JSON.stringify(row)) as T;
}

function rowsFor(table: string) {
  if (!sandboxTables.has(table)) sandboxTables.set(table, []);
  return sandboxTables.get(table)!;
}

function matchesFilter(row: SandboxRow, column: string, operation: string, value: unknown) {
  const actual = row[column];
  switch (operation) {
    case "eq":
      return actual === value;
    case "neq":
      return actual !== value;
    case "gt":
      return String(actual ?? "") > String(value ?? "");
    case "gte":
      return String(actual ?? "") >= String(value ?? "");
    case "lt":
      return String(actual ?? "") < String(value ?? "");
    case "lte":
      return String(actual ?? "") <= String(value ?? "");
    case "is":
      return actual === value;
    case "not-is":
      return actual !== value;
    case "like":
    case "ilike": {
      const pattern = String(value ?? "")
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/%/g, ".*")
        .replace(/_/g, ".");
      const flags = operation === "ilike" ? "i" : "";
      return new RegExp(`^${pattern}$`, flags).test(String(actual ?? ""));
    }
    case "in":
      return Array.isArray(value) && value.includes(actual);
    case "contains":
      return Array.isArray(actual)
        ? Array.isArray(value) && value.every((item) => actual.includes(item))
        : false;
    default:
      return true;
  }
}

function parseOrExpression(expression: string): Filter[] {
  return expression.split(",").map((term) => {
    const [column, operation, ...valueParts] = term.split(".");
    const valueText = valueParts.join(".");
    const value = valueText === "null" ? null : valueText;
    if (!column || !operation) return () => false;
    if (operation === "is") return (row) => row[column] === value;
    if (operation === "not") return (row) => row[column] !== value;
    return (row) => matchesFilter(row, column, operation, value);
  });
}

function withDefaults(table: string, row: SandboxRow): SandboxRow {
  const next = cloneRow(row);
  if (["test_series_syllabi", "test_series_overrides"].includes(table)) {
    next["created_at"] ??= now();
    next["updated_at"] ??= now();
  } else if (["site_settings", "private_settings"].includes(table)) {
    next["created_at"] ??= now();
    next["updated_at"] ??= now();
  } else {
    if (!("id" in next)) next["id"] = globalThis.crypto?.randomUUID?.() ?? `sandbox-${Date.now()}`;
    next["created_at"] ??= now();
    next["updated_at"] ??= now();
  }
  return next;
}

function project(row: SandboxRow, columns: string): SandboxRow {
  if (!columns || columns.trim() === "*") return cloneRow(row);
  const keys = columns
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (keys.some((key) => key.includes("("))) return cloneRow(row);
  const selected: SandboxRow = {};
  for (const key of keys) {
    const [alias, source] = key.split(":").map((part) => part.trim());
    const actual = source ?? alias;
    if (actual && actual in row) selected[alias!] = row[actual];
  }
  return selected;
}

function executeQuery(state: QueryState): SandboxQueryResponse {
  const tableRows = rowsFor(state.table);
  const filtered = (row: SandboxRow) =>
    state.filters.every((filter) => filter(row)) &&
    (!state.anyFilters.length || state.anyFilters.some((filter) => filter(row)));

  let resultRows: SandboxRow[] = [];
  if (state.mutation === "insert" || state.mutation === "upsert") {
    const inputRows = Array.isArray(state.mutationData)
      ? state.mutationData
      : [state.mutationData ?? {}];
    for (const source of inputRows) {
      const row = withDefaults(state.table, source);
      const keys = state.conflictKeys.length
        ? state.conflictKeys
        : state.table === "site_settings" || state.table === "private_settings"
          ? ["key"]
          : state.table === "test_series_syllabi" || state.table === "test_series_overrides"
            ? ["series_id"]
            : ["id"];
      const existing = tableRows.find((item) => keys.every((key) => item[key] === row[key]));
      if (existing) {
        if (state.mutation === "insert") {
          return {
            data: null,
            error: {
              message: `duplicate key value violates unique constraint on ${state.table}`,
              code: "23505",
            },
            count: null,
          };
        }
        Object.assign(existing, row, { updated_at: now() });
        resultRows.push(existing);
      } else {
        tableRows.push(row);
        resultRows.push(row);
      }
    }
  } else if (state.mutation === "update") {
    for (const row of tableRows) {
      if (!filtered(row)) continue;
      Object.assign(row, cloneRow((state.mutationData ?? {}) as SandboxRow));
      resultRows.push(row);
    }
  } else if (state.mutation === "delete") {
    const removed = tableRows.filter(filtered);
    const keep = tableRows.filter((row) => !filtered(row));
    sandboxTables.set(state.table, keep);
    resultRows = removed;
    if (state.table === "tests") {
      const ids = new Set(removed.map((row) => row["id"]));
      sandboxTables.set(
        "test_questions",
        rowsFor("test_questions").filter((row) => !ids.has(row["test_id"])),
      );
    }
  } else {
    resultRows = tableRows.filter(filtered);
  }

  if (state.mutation === null) {
    for (const order of [...state.orders].reverse()) {
      resultRows.sort((a, b) => {
        const left = a[order.column];
        const right = b[order.column];
        if (left == null || right == null) {
          if (left == null && right == null) return 0;
          return left == null ? (order.nullsFirst ? -1 : 1) : order.nullsFirst ? 1 : -1;
        }
        const comparison = String(left).localeCompare(String(right), undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return order.ascending ? comparison : -comparison;
      });
    }
    if (state.range) resultRows = resultRows.slice(state.range[0], state.range[1] + 1);
    if (state.limit !== null) resultRows = resultRows.slice(0, state.limit);
  }

  const output = resultRows.map((row) => project(row, state.columns));
  if (state.single) {
    if (output.length > 1) {
      return {
        data: null,
        error: { message: "Expected at most one row", code: "PGRST116" },
        count: output.length,
      };
    }
    return { data: output[0] ?? null, error: null, count: output.length };
  }

  return {
    data: state.mutation && !state.returnRows ? null : output,
    error: null,
    count: resultRows.length,
  };
}

function createQueryBuilder(table: string) {
  const state: QueryState = {
    table,
    mutation: null,
    mutationData: null,
    conflictKeys: [],
    filters: [],
    anyFilters: [],
    orders: [],
    columns: "*",
    returnRows: false,
    single: false,
    limit: null,
    range: null,
  };
  const chain = new Proxy<Record<string, unknown>>(
    {},
    {
      get(_target, property) {
        const name = String(property);
        if (name === "then") {
          return (
            resolve?: (value: SandboxQueryResponse) => unknown,
            reject?: (reason: unknown) => unknown,
          ) =>
            Promise.resolve()
              .then(() => executeQuery(state))
              .then(resolve, reject);
        }
        if (name === "single" || name === "maybeSingle") {
          return async () => {
            state.single = true;
            return executeQuery(state);
          };
        }
        if (name === "select") {
          return (columns = "*") => {
            state.columns = String(columns || "*");
            if (state.mutation) state.returnRows = true;
            return chain;
          };
        }
        if (["insert", "upsert", "update", "delete"].includes(name)) {
          return (payload?: SandboxRow | SandboxRow[], options?: { onConflict?: string }) => {
            state.mutation = name as QueryState["mutation"];
            state.mutationData = payload ?? null;
            if (name === "upsert" && options?.onConflict) {
              state.conflictKeys = options.onConflict.split(",").map((key) => key.trim());
            }
            return chain;
          };
        }
        if (name === "order") {
          return (column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => {
            state.orders.push({
              column,
              ascending: options?.ascending ?? true,
              ...(options?.nullsFirst === undefined ? {} : { nullsFirst: options.nullsFirst }),
            });
            return chain;
          };
        }
        if (name === "limit") {
          return (limit: number) => {
            state.limit = Math.max(0, limit);
            return chain;
          };
        }
        if (name === "range") {
          return (start: number, end: number) => {
            state.range = [Math.max(0, start), Math.max(start, end)];
            return chain;
          };
        }
        if (name === "or") {
          return (expression: string) => {
            state.anyFilters = parseOrExpression(expression);
            return chain;
          };
        }
        if (name === "not") {
          return (column: string, operation: string, value: unknown) => {
            state.filters.push((row) => !matchesFilter(row, column, operation, value));
            return chain;
          };
        }
        if (name === "in") {
          return (column: string, values: unknown[]) => {
            state.filters.push((row) => matchesFilter(row, column, "in", values));
            return chain;
          };
        }
        if (name === "filter") {
          return (column: string, operation: string, value: unknown) => {
            state.filters.push((row) => matchesFilter(row, column, operation, value));
            return chain;
          };
        }
        if (
          ["eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike", "is", "contains"].includes(name)
        ) {
          return (column: string, value: unknown) => {
            state.filters.push((row) => matchesFilter(row, column, name, value));
            return chain;
          };
        }
        if (["containedBy", "overlaps", "textSearch", "match", "abortSignal"].includes(name)) {
          return () => chain;
        }
        return undefined;
      },
    },
  );
  return chain;
}

function rpcResponse(name: string, args?: Record<string, unknown>) {
  if (name === "get_public_platform_stats") {
    const courses = rowsFor("courses").filter((row) => row["status"] === "published");
    const tests = rowsFor("tests").filter((row) => row["is_published"] === true);
    return {
      data: [
        {
          students_joined: Math.max(1, rowsFor("profiles").length),
          active_students: 1,
          published_courses: courses.length,
          published_lectures: rowsFor("lectures").length,
          published_materials: 0,
          published_tests: tests.length,
        },
      ],
      error: null,
    };
  }
  if (name === "get_my_block_status") {
    return { data: { is_blocked: false, reason: "", blocked_at: null }, error: null };
  }
  if (name === "has_role") {
    return {
      data: args?.["_user_id"] === SANDBOX_ADMIN_ID && args?.["_role"] === "admin",
      error: null,
    };
  }
  if (name === "is_user_blocked") return { data: false, error: null };
  if (name === "has_series_access") {
    const seriesId = args?.["p_series_id"];
    return {
      data: rowsFor("series_access_grants").some(
        (grant) =>
          grant["series_id"] === seriesId &&
          grant["user_id"] === SANDBOX_ADMIN_ID &&
          !grant["revoked_at"] &&
          (!grant["expires_at"] || new Date(String(grant["expires_at"])).getTime() > Date.now()),
      ),
      error: null,
    };
  }
  if (name.startsWith("has_") || name.startsWith("is_")) return { data: false, error: null };
  if (name.startsWith("list_") || name.startsWith("get_")) return { data: [], error: null };
  return {
    data: null,
    error: { message: `Sandbox RPC ${name} is not implemented`, code: "SANDBOX_RPC" },
  };
}

function storageBucket() {
  return {
    list: async () => ({ data: [], error: null }),
    upload: async () => ({
      data: null,
      error: {
        message: "File storage is unavailable in the local sandbox.",
        code: "SANDBOX_STORAGE",
      },
    }),
    update: async () => ({
      data: null,
      error: {
        message: "File storage is unavailable in the local sandbox.",
        code: "SANDBOX_STORAGE",
      },
    }),
    move: async () => ({
      data: null,
      error: {
        message: "File storage is unavailable in the local sandbox.",
        code: "SANDBOX_STORAGE",
      },
    }),
    copy: async () => ({
      data: null,
      error: {
        message: "File storage is unavailable in the local sandbox.",
        code: "SANDBOX_STORAGE",
      },
    }),
    remove: async () => ({
      data: null,
      error: {
        message: "File storage is unavailable in the local sandbox.",
        code: "SANDBOX_STORAGE",
      },
    }),
    createSignedUrl: async () => ({
      data: null,
      error: {
        message: "File storage is unavailable in the local sandbox.",
        code: "SANDBOX_STORAGE",
      },
    }),
    createSignedUrls: async () => ({ data: [], error: null }),
    getPublicUrl: () => ({ data: { publicUrl: "" } }),
  };
}

/** Editable demo database stored only in this development server's memory. */
export function createSandboxSupabaseClient(): SupabaseClient<Database> {
  const auth = {
    getUser: async () => ({ data: { user: SANDBOX_ADMIN_USER as User }, error: null }),
    getClaims: async () => ({
      data: {
        claims: { sub: SANDBOX_ADMIN_ID, role: "authenticated", email: SANDBOX_ADMIN_USER.email },
      },
      error: null,
    }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
    signOut: async () => ({ error: null }),
  };
  const client = {
    from: (table: string) => createQueryBuilder(table),
    rpc: async (name: string, args?: Record<string, unknown>) => rpcResponse(name, args),
    auth,
    storage: { from: (_bucket: string) => storageBucket() },
    functions: {
      invoke: async () => ({
        data: null,
        error: {
          message: "Edge Functions are not available in the local sandbox.",
          code: "SANDBOX_FUNCTION",
        },
      }),
    },
  };
  return client as unknown as SupabaseClient<Database>;
}

/** Test-only inspection hook for sandbox-isolation regression tests. */
export function getSandboxRowsForTest(table: string): SandboxRow[] {
  return rowsFor(table).map(cloneRow);
}

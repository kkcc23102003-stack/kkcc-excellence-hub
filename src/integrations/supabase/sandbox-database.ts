import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { DB as Database } from "./db";
import { SANDBOX_ADMIN_ID, SANDBOX_ADMIN_USER } from "./sandbox";

type SandboxQueryResponse = {
  data: unknown;
  error: { message: string; code?: string } | null;
  count: number | null;
};

const READ_ONLY_ERROR = {
  message: "This local sandbox is read-only. No Supabase data or production records are changed.",
  code: "SANDBOX_READ_ONLY",
};

function queryResponse(mutation: boolean, single: boolean): SandboxQueryResponse {
  if (mutation) return { data: null, error: READ_ONLY_ERROR, count: null };
  return { data: single ? null : [], error: null, count: 0 };
}

function createQueryBuilder() {
  let mutation = false;
  let single = false;
  const chain: Record<string, unknown> = new Proxy<Record<string, unknown>>(
    {},
    {
      get(_target, property) {
        const name = String(property);
        if (name === "then") {
          return (
            resolve?: (value: SandboxQueryResponse) => unknown,
            reject?: (reason: unknown) => unknown,
          ) => Promise.resolve(queryResponse(mutation, single)).then(resolve, reject);
        }
        if (name === "single" || name === "maybeSingle") {
          single = true;
          return async () => queryResponse(mutation, true);
        }
        if (["insert", "upsert", "update", "delete"].includes(name)) {
          return () => {
            mutation = true;
            return chain;
          };
        }
        if (
          [
            "select",
            "eq",
            "neq",
            "gt",
            "gte",
            "lt",
            "lte",
            "like",
            "ilike",
            "is",
            "in",
            "contains",
            "containedBy",
            "overlaps",
            "textSearch",
            "match",
            "not",
            "or",
            "filter",
            "order",
            "limit",
            "range",
            "abortSignal",
          ].includes(name)
        ) {
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
    return {
      data: [
        {
          students_joined: 0,
          active_students: 0,
          published_courses: 0,
          published_lectures: 0,
          published_materials: 0,
          published_tests: 0,
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
  if (name.startsWith("has_") || name.startsWith("is_")) return { data: false, error: null };
  if (name.startsWith("list_") || name.startsWith("get_")) return { data: [], error: null };
  return { data: null, error: READ_ONLY_ERROR };
}

function storageBucket() {
  return {
    list: async () => ({ data: [], error: null }),
    upload: async () => ({ data: null, error: READ_ONLY_ERROR }),
    update: async () => ({ data: null, error: READ_ONLY_ERROR }),
    move: async () => ({ data: null, error: READ_ONLY_ERROR }),
    copy: async () => ({ data: null, error: READ_ONLY_ERROR }),
    remove: async () => ({ data: null, error: READ_ONLY_ERROR }),
    createSignedUrl: async () => ({ data: null, error: READ_ONLY_ERROR }),
    createSignedUrls: async () => ({ data: [], error: null }),
    getPublicUrl: () => ({ data: { publicUrl: "" } }),
  };
}

/** Mock Supabase surface for a no-backend Vite preview. It never writes data. */
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

  const storage = {
    from: (_bucket: string) => storageBucket(),
  };

  const client = {
    from: (_table: string) => createQueryBuilder(),
    rpc: async (name: string, args?: Record<string, unknown>) => rpcResponse(name, args),
    auth,
    storage,
    functions: { invoke: async () => ({ data: null, error: READ_ONLY_ERROR }) },
  };

  return client as unknown as SupabaseClient<Database>;
}

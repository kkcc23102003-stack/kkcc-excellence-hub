import { createProductionServer } from "../../scripts/serve.mjs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
/** LOCAL-ONLY fixture. Real PostgreSQL/RLS and actual application handlers; GoTrue/PostgREST HTTP contracts are emulated.
 * No production Supabase connection, credentials or remote mutation is involved.
 */
import { createServer } from "node:http";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { createFixtureDatabase, seedFixtureUsers, fixtureIds as ids } from "./database";
import { getExamBankExams } from "../../src/lib/exam-bank/index";

const database = await createFixtureDatabase();
await seedFixtureUsers(database);
const secret = randomBytes(32);
const to64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
function token(subject: string, role: string) {
  const unsigned = `${to64({ alg: "HS256", typ: "JWT" })}.${to64({ sub: subject, role, aud: "authenticated", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86_400, session_id: randomUUID() })}`;
  return `${unsigned}.${createHmac("sha256", secret).update(unsigned).digest("base64url")}`;
}
const publicKey = token("", "anon");
const serviceKey = token("", "service_role");
function decode(value: string | undefined) {
  if (!value) return { sub: "", role: "anon" };
  const [head, payload, signature] = value.split(".");
  if (!head || !payload || !signature) throw new Error("Invalid fixture token");
  const expected = createHmac("sha256", secret).update(`${head}.${payload}`).digest();
  const supplied = Buffer.from(signature, "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(expected, supplied))
    throw new Error("Invalid fixture token");
  const claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
    sub: string;
    role: string;
    exp: number;
  };
  if (
    claims.exp < Date.now() / 1000 ||
    !["anon", "authenticated", "service_role"].includes(claims.role)
  )
    throw new Error("Expired fixture token");
  return claims;
}
const users = new Map<
  string,
  { id: string; email: string; user_metadata: Record<string, unknown>; created_at: string }
>(
  Object.entries(ids)
    .slice(0, 4)
    .map(([name, id]) => [
      id,
      {
        id,
        email: `${name.toLowerCase()}@fixture.invalid`,
        user_metadata: { full_name: name },
        created_at: new Date().toISOString(),
      },
    ]),
);
const sessionFor = (user: NonNullable<ReturnType<typeof users.get>>) => ({
  access_token: token(user.id, "authenticated"),
  token_type: "bearer",
  expires_in: 86_400,
  expires_at: Math.floor(Date.now() / 1000) + 86_400,
  refresh_token: `fixture:${user.id}`,
  user: {
    ...user,
    aud: "authenticated",
    role: "authenticated",
    app_metadata: { provider: "email", providers: ["email"] },
    identities: [],
  },
});

/** Demo note used by the local preview to prove the auto diagrams work. */
/**
 * A tiny inline "handwritten page" used by the demo note. Real uploads go to
 * storage; this one is inline so the local preview works with no network.
 */
const DEMO_HANDWRITTEN_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
<rect width="640" height="360" fill="#fffdf5"/>
<line x1="40" y1="70" x2="600" y2="70" stroke="#fcd34d" stroke-width="3"/>
<text x="48" y="52" font-family="Georgia,serif" font-size="26" font-weight="bold" fill="#1e293b">GST — mera handwritten page</text>
<text x="48" y="118" font-family="Georgia,serif" font-size="22" fill="#1d4ed8">GST = Rate x Base / 100</text>
<text x="48" y="164" font-family="Georgia,serif" font-size="22" fill="#1d4ed8">Base 1000, Rate 18% -&gt; GST 180</text>
<text x="48" y="210" font-family="Georgia,serif" font-size="22" fill="#b91c1c">CGST 9% + SGST 9% (intra-state)</text>
<text x="48" y="256" font-family="Georgia,serif" font-size="22" fill="#047857">IGST 18% (inter-state)</text>
<text x="48" y="318" font-family="Georgia,serif" font-size="20" font-style="italic" fill="#475569">Admin ne Samsung Notes jaise canvas me likha</text>
</svg>`,
)}`;

const DEMO_NOTES_WITH_DIAGRAMS = `Types of GST

- CGST — collected by the Centre on intra-state supply
- SGST — collected by the State on intra-state supply
- IGST — collected by the Centre on inter-state supply
- UTGST — collected by Union Territories

Registration process

- Applicant files the REG-01 form online
- Aadhaar authentication is completed
- Officer verifies the documents
- GSTIN is issued within 7 working days

Rate structure

1. GST slabs
- 5 percent essential goods
- 12 percent standard goods
- 18 percent most services
- 28 percent luxury goods

Advantages
- One nation, one tax
- Removes cascading of taxes

Disadvantages
- Compliance cost for small firms
- Multiple return filings

Important milestones

2017 GST came into force on 1 July
2019 E-invoicing started for large firms
2023 GSTR-3B automation expanded

:::cycle GST money flow
Consumer -> Business -> Government -> Public services -> Consumer
:::

Tax formulas (math typesetting)

Amount = Rate \times Base
\text{GST} = \frac{\text{Rate} \times \text{Base}}{100}
Net price = Base + GST
`;

/**
 * Punjabi note: the admin switched diagrams off for language subjects, so the
 * reader shows clean text only — no tree, no chart.
 */
const DEMO_NOTES_TEXT_ONLY = `ਪੰਜਾਬੀ ਵਿਆਕਰਨ — ਨਾਂਵ

ਨਾਂਵ (Noun)

- ਕਿਸੇ ਵਿਅਕਤੀ, ਥਾਂ ਜਾਂ ਵਸਤੂ ਦੇ ਨਾਂ ਨੂੰ ਨਾਂਵ ਕਹਿੰਦੇ ਹਨ
- ਨਾਂਵ ਦੇ ਪੰਜ ਭੇਦ ਹੁੰਦੇ ਹਨ
- ਵਿਆਕਰਨ ਦੀ ਸਮਝ ਪੜ੍ਹਨ ਅਤੇ ਲਿਖਣ ਦੋਵਾਂ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ

Examples

- ਰਾਮ, ਦਿੱਲੀ, ਕਿਤਾਬ, ਪੰਜਾਬ
- ਵਾਕ ਵਿੱਚ ਨਾਂਵ ਪਛਾਣਨਾ ਸਿੱਖੋ
- ਰੋਜ਼ ਅਭਿਆਸ ਕਰੋ

:::visuals {"mode":"none"}
:::
`;

const runtime = "data/fixture-content.runtime.json";
const doc = JSON.parse(readFileSync("data/project-content.json", "utf8")) as {
  version: number;
  tables: Record<string, Record<string, unknown>[]>;
};
const now = new Date().toISOString();
doc.tables["courses"] = [
  {
    id: ids.course,
    slug: "fixture-paid-course",
    title: "Fixture Paid Course",
    category: "School",
    class_level: "Class 10",
    subject: "Mathematics",
    faculty: "KKCC",
    course_type: "Recorded",
    price: 500,
    coin_price: 100,
    original_price: 500,
    rating: 4.8,
    hue: 220,
    summary: "LOCAL TEST FIXTURE — not production content",
    description: "Fixture course for grant/access testing.",
    outcomes: [],
    thumbnail_url: null,
    discount_percent: 0,
    duration_hours: 2,
    lectures_count: 1,
    tests_count: 1,
    materials_count: 1,
    status: "published",
    sort_order: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "fixture-free-course",
    title: "Fixture Free Course",
    category: "School",
    class_level: "Class 9",
    subject: "Mathematics",
    faculty: "KKCC",
    course_type: "Recorded",
    price: 0,
    coin_price: 0,
    original_price: 0,
    rating: 4.5,
    hue: 160,
    summary: "LOCAL TEST FIXTURE",
    description: "Free course",
    outcomes: [],
    status: "published",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
];
doc.tables["lectures"] = [
  {
    id: "11000000-0000-4000-8000-000000000001",
    course_id: ids.course,
    module_title: "Real grant test",
    title: "Protected Fixture Lecture",
    description: "Local fixture",
    video_url: "https://example.invalid/fixture-video.mp4",
    duration: "05:00",
    is_free: false,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
];
doc.tables["materials"] = [
  {
    // A language note where the admin switched auto diagrams OFF — pure text.
    id: "12000000-0000-4000-8000-000000000004",
    course_id: null,
    lecture_id: null,
    title: "ਪੰਜਾਬੀ ਵਿਆਕਰਨ — ਨਾਂਵ (text only, no diagrams)",
    description: DEMO_NOTES_TEXT_ONLY,
    subject: "Punjabi",
    class_level: "Class 10",
    chapter: "ਵਿਆਕਰਨ",
    file_url: null,
    thumbnail_url: null,
    pages: 3,
    module_title: "Language",
    batch: "",
    material_type: "Notes",
    access_type: "free",
    price: 0,
    coin_price: 0,
    is_published: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    // A note with no PDF at all: the reader shows the text plus the diagrams and
    // charts that are generated from it, and printing carries the KKCC watermark.
    id: "12000000-0000-4000-8000-000000000002",
    course_id: null,
    lecture_id: null,
    title: "GST — Notes with auto diagrams (demo)",
    description: DEMO_NOTES_WITH_DIAGRAMS,
    subject: "Commerce",
    class_level: "Class 12",
    chapter: "GST",
    file_url: null,
    thumbnail_url: null,
    pages: 6,
    module_title: "Indirect Tax",
    batch: "",
    material_type: "Notes",
    access_type: "free",
    price: 0,
    coin_price: 0,
    is_published: true,
    sort_order: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "12000000-0000-4000-8000-000000000003",
    title: "Paid Notes — buy from checkout (demo)",
    description: [
      "Advanced GST revision notes. Paid hai, to student checkout se kharid sakta hai.",
      "",
      "Rate structure",
      "- 5 percent essential goods",
      "- 18 percent most services",
      "- 28 percent luxury goods",
      "",
      "Tax formulas",
      "GST = \\frac{Rate \\times Base}{100}",
      "",
      "Admin par demo: ek diagram photo se replace, ek handwritten page add.",
      `:::visuals {"replace":{"1":{"url":"${DEMO_HANDWRITTEN_IMAGE}","caption":"Handwritten GST page"}},"images":[{"url":"${DEMO_HANDWRITTEN_IMAGE}","caption":"Handwritten GST page"}]}`,
      ":::",
    ].join("\n"),
    course_id: null,
    lecture_id: null,
    subject: "Commerce",
    class_level: "Class 12",
    chapter: "GST revision",
    file_url: null,
    thumbnail_url: null,
    pages: 3,
    module_title: "Indirect Tax",
    batch: "",
    material_type: "Notes",
    access_type: "paid",
    price: 99,
    coin_price: 99,
    is_published: true,
    sort_order: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "12000000-0000-4000-8000-000000000001",
    course_id: ids.course,
    lecture_id: null,
    title: "Protected Fixture Notes",
    description: "Local fixture",
    subject: "Mathematics",
    class_level: "Class 10",
    chapter: "Real grant test",
    file_url: "https://example.invalid/fixture-notes.pdf",
    thumbnail_url: null,
    pages: 1,
    module_title: "Real grant test",
    batch: "",
    material_type: "Notes",
    access_type: "course",
    price: 0,
    coin_price: 0,
    is_published: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
];
const testBase = {
  course_id: null,
  lecture_id: null,
  title: "Fixture Paid NEET Test",
  instructions: "LOCAL TEST FIXTURE — original bank practice only",
  subject: "Physics",
  duration_minutes: 60,
  question_timer_seconds: 0,
  timer_mode: "test",
  questions_count: 6,
  total_marks: 6,
  is_published: true,
  sort_order: 1,
  exam_track: "NEET",
  level: "Mixed",
  series_name: "neet-ug",
  is_paid: true,
  price_inr: 100,
  price_coins: 40,
  question_source: "deterministic",
  generation_exam: "NEET",
  generation_subject: "Physics",
  generation_topic: "Mixed",
  generation_difficulty: "Mixed",
  generation_count: 6,
  generation_marks: 1,
  generation_negative_marks: 0.25,
  created_at: now,
  updated_at: now,
};
const isLivePreview = process.env["KKCC_LIVE_PREVIEW"] === "1";
doc.tables["tests"] = isLivePreview
  ? []
  : [
      { ...testBase, id: ids.test },
      {
        ...testBase,
        id: "20000000-0000-4000-8000-000000000002",
        title: "Fixture Course-Linked Test",
        course_id: ids.course,
        series_name: "",
        sort_order: 2,
      },
      {
        ...testBase,
        id: "20000000-0000-4000-8000-000000000003",
        title: "Fixture Free Test",
        is_paid: false,
        series_name: "",
        sort_order: 3,
      },
      ...getExamBankExams().map((exam, index) => ({
        ...testBase,
        id: `21000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
        title: `Fixture ${exam}`,
        exam_track: exam,
        generation_exam: exam,
        generation_subject: "",
        subject: exam,
        series_name: "",
        is_paid: false,
        sort_order: index + 10,
      })),
    ];
doc.tables["test_questions"] = [];
doc.tables["test_series_overrides"] = [];
if (!isLivePreview) {
  doc.tables["site_settings"] = [
    ...(doc.tables["site_settings"] || []).filter(
      (row) => row["key"] !== "test_series_custom_catalog",
    ),
    {
      id: "99000000-0000-4000-8000-000000000099",
      key: "test_series_custom_catalog",
      value: JSON.stringify({
        includeBuiltIn: true,
        removedSeriesIds: [],
        addedSeries: [],
        syllabusBySeriesId: {},
      }),
      category: "exam-bank",
      label: "Custom Test Series & Text Syllabus Catalog",
      updated_at: now,
    },
  ];
} else {
  doc.tables["site_settings"] = (doc.tables["site_settings"] || []).filter(
    (row) => row["key"] !== "test_series_custom_catalog",
  );
}
doc.tables["private_settings"] = [];
mkdirSync("data", { recursive: true });
writeFileSync(runtime, JSON.stringify(doc), { mode: 0o600 });
await database.query(
  "INSERT INTO public.coin_transactions(user_id,amount,source,reason) VALUES($1,1000,'admin_grant','fixture'),($2,1000,'admin_grant','fixture')",
  [ids.studentA, ids.studentB],
);

const identifier = (name: string) => {
  if (!/^[a-z_][a-z0-9_]*$/i.test(name)) throw new Error("Invalid identifier");
  return `"${name}"`;
};
const functions = new Set(
  (
    await database.query<{ name: string }>(
      "SELECT proname name FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND prokind='f'",
    )
  ).rows.map((row) => row.name),
);
const tables = new Set(
  (
    await database.query<{ name: string }>(
      "SELECT tablename name FROM pg_tables WHERE schemaname='public'",
    )
  ).rows.map((row) => row.name),
);
const types = new Map(
  (
    await database.query<{ table_name: string; column_name: string; data_type: string }>(
      "SELECT table_name,column_name,data_type FROM information_schema.columns WHERE table_schema='public'",
    )
  ).rows.map((row) => [`${row.table_name}.${row.column_name}`, row.data_type]),
);
const scalar = (table: string, column: string, value: unknown) =>
  types.get(`${table}.${column}`) === "jsonb" ? JSON.stringify(value) : value;
await database.exec(
  "GRANT EXECUTE ON FUNCTION public.get_my_block_status() TO anon, authenticated;",
);
const server = createServer(async (req, res) => {
  const respond = (value: unknown, status = 200) => {
    res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(value));
  };
  try {
    const url = new URL(req.url || "/", "http://fixture.invalid");
    if (url.pathname === "/health") return respond({ fixture: true });
    if (url.pathname === "/zip") {
      const zipPath = "full fledge kkcc excellence hub.zip";
      if (!existsSync(zipPath)) return respond({ error: "ZIP file not found" }, 404);
      const buf = readFileSync(zipPath);
      res.writeHead(200, {
        "content-type": "application/zip",
        "content-length": String(buf.length),
        "content-disposition": 'attachment; filename="full fledge kkcc excellence hub.zip"',
        "cache-control": "no-store",
      });
      res.end(buf);
      return;
    }
    if (url.pathname === "/download/production.sql") {
      const sqlPath = "KKCC-Excellence-Hub-PRODUCTION-SQL.sql";
      const buf = readFileSync(sqlPath);
      res.writeHead(200, {
        "content-type": "application/sql; charset=utf-8",
        "content-length": String(buf.length),
        "content-disposition": 'attachment; filename="KKCC-Excellence-Hub-PRODUCTION-SQL.sql"',
        "cache-control": "no-store",
      });
      res.end(buf);
      return;
    }
    if (url.pathname === "/download/cleaner.sql") {
      const sqlPath = "KKCC-Excellence-Hub-SQL-CLEANER.sql";
      const buf = readFileSync(sqlPath);
      res.writeHead(200, {
        "content-type": "application/sql; charset=utf-8",
        "content-length": String(buf.length),
        "content-disposition": 'attachment; filename="KKCC-Excellence-Hub-SQL-CLEANER.sql"',
        "cache-control": "no-store",
      });
      res.end(buf);
      return;
    }
    if (url.pathname === "/sql") {
      const cleanerSql = existsSync("KKCC-Excellence-Hub-SQL-CLEANER.sql")
        ? readFileSync("KKCC-Excellence-Hub-SQL-CLEANER.sql", "utf8")
        : "";
      const productionSql = existsSync("KKCC-Excellence-Hub-PRODUCTION-SQL.sql")
        ? readFileSync("KKCC-Excellence-Hub-PRODUCTION-SQL.sql", "utf8")
        : "";
      return respond({ ok: true, cleanerSql, productionSql });
    }
    if (url.pathname === "/clean") {
      await database.exec("RESET ROLE");
      const abandoned = await database.query(
        "DELETE FROM public.learning_attempts WHERE status = 'started' RETURNING id",
      );
      const expiredGrants = await database.query(
        "DELETE FROM public.test_access_grants WHERE revoked_at IS NOT NULL OR (expires_at IS NOT NULL AND expires_at < now()) RETURNING id",
      );
      await database.query(
        "DELETE FROM public.series_access_grants WHERE revoked_at IS NOT NULL OR (expires_at IS NOT NULL AND expires_at < now())",
      );
      const counts = await database.query<{
        profiles: number;
        enrollments: number;
        attempts: number;
      }>(
        "SELECT (SELECT count(*)::int FROM public.profiles) AS profiles, (SELECT count(*)::int FROM public.course_enrollments) AS enrollments, (SELECT count(*)::int FROM public.learning_attempts) AS attempts",
      );
      return respond({
        ok: true,
        cleanedAbandonedAttempts: abandoned.rows.length,
        cleanedExpiredGrants: expiredGrants.rows.length,
        ettSeriesFree: true,
        stats: counts.rows[0] ?? { profiles: 0, enrollments: 0, attempts: 0 },
        cleanedAt: new Date().toISOString(),
      });
    }
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const text = Buffer.concat(chunks).toString();
    const body = text ? JSON.parse(text) : {};
    const bearer = String(req.headers.authorization || "").replace(/^Bearer /, "");
    const claims = decode(bearer || String(req.headers["apikey"] || ""));
    if (url.pathname.startsWith("/auth/v1/")) {
      if (url.pathname.endsWith("/token")) {
        const user = body.refresh_token
          ? users.get(String(body.refresh_token).replace("fixture:", ""))
          : [...users.values()].find((user) => user.email === String(body.email).toLowerCase());
        if (!user || (!body.refresh_token && body.password !== "FixturePass123!"))
          return respond(
            { error: "invalid_grant", error_description: "Invalid login credentials" },
            400,
          );
        return respond(sessionFor(user));
      }
      if (url.pathname.endsWith("/signup")) {
        const id = randomUUID(),
          email = String(body.email || "").toLowerCase();
        if ([...users.values()].some((user) => user.email === email))
          return respond({ msg: "User already registered" }, 422);
        const user = {
          id,
          email,
          user_metadata: body.data || {},
          created_at: new Date().toISOString(),
        };
        users.set(id, user);
        await database.query(
          "INSERT INTO auth.users(id,email,raw_user_meta_data,email_confirmed_at) VALUES($1,$2,$3::jsonb,now())",
          [id, email, JSON.stringify(user.user_metadata)],
        );
        return respond(sessionFor(user));
      }
      if (url.pathname.endsWith("/logout")) return respond({});
      if (url.pathname.endsWith("/user")) {
        const user = users.get(claims.sub);
        if (!user) return respond({ msg: "Invalid token" }, 401);
        if (req.method === "PUT") {
          user.user_metadata = { ...user.user_metadata, ...body.data };
          if (body.email) user.email = String(body.email).toLowerCase();
          await database.query(
            "UPDATE auth.users SET email=$2,raw_user_meta_data=$3::jsonb WHERE id=$1",
            [user.id, user.email, JSON.stringify(user.user_metadata)],
          );
        }
        return respond(sessionFor(user).user);
      }
      if (url.pathname.endsWith("/settings"))
        return respond({ disable_signup: false, external: { email: true } });
      return respond({ keys: [] });
    }
    if (!url.pathname.startsWith("/rest/v1/"))
      return respond({ error: "Local fixture route not found" }, 404);
    const path = url.pathname.slice("/rest/v1/".length);
    const singular = String(req.headers.accept || "").includes("vnd.pgrst.object");
    const result = await database.transaction(async (tx) => {
      await tx.exec(`SET LOCAL ROLE ${claims.role}`);
      await tx.query(
        "SELECT set_config('request.jwt.claim.role',$1,true),set_config('request.jwt.claim.sub',$2,true)",
        [claims.role, claims.sub],
      );
      if (path.startsWith("rpc/")) {
        const name = path.slice(4);
        if (!functions.has(name)) throw new Error("Unknown fixture RPC");
        const args =
          req.method === "GET"
            ? Object.fromEntries(url.searchParams)
            : (body as Record<string, unknown>);
        const entries = Object.entries(args);
        const argsSql = entries
          .map(([key], index) => `${identifier(key)}=>$${index + 1}`)
          .join(",");
        const params = entries.map(([, value]) =>
          value !== null && typeof value === "object" && !Array.isArray(value)
            ? JSON.stringify(value)
            : value,
        );
        const set = await tx.query(`SELECT * FROM public.${identifier(name)}(${argsSql})`, params);
        const definition = await tx.query<{ proretset: boolean }>(
          "SELECT proretset FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND proname=$1 LIMIT 1",
          [name],
        );
        return {
          rpc: true,
          value: definition.rows[0]?.proretset
            ? set.rows
            : (Object.values(set.rows[0] || {})[0] ?? null),
        };
      }
      if (!tables.has(path))
        throw new Error(`Educational/non-student table unavailable in fixture Supabase: ${path}`);
      const params: unknown[] = [];
      const condition: string[] = [];
      const bind = (value: unknown) => {
        params.push(value);
        return `$${params.length}`;
      };
      for (const [key, raw] of url.searchParams) {
        if (["select", "limit", "offset", "order", "on_conflict"].includes(key)) continue;
        const dot = raw.indexOf(".");
        const op = raw.slice(0, dot);
        const value = raw.slice(dot + 1);
        const column = identifier(key);
        if (op === "is")
          condition.push(
            `${column} IS ${value === "null" ? "NULL" : value === "true" ? "TRUE" : "FALSE"}`,
          );
        else if (op === "in") {
          const values = value
            .slice(1, -1)
            .split(",")
            .filter(Boolean)
            .map((item) => item.replace(/^"|"$/g, ""));
          condition.push(values.length ? `${column} IN (${values.map(bind).join(",")})` : "FALSE");
        } else {
          const operators: Record<string, string> = {
            eq: "=",
            neq: "<>",
            gt: ">",
            gte: ">=",
            lt: "<",
            lte: "<=",
            ilike: "ILIKE",
            like: "LIKE",
          };
          const operator = operators[op];
          if (!operator) throw new Error(`Unsupported fixture filter ${op}`);
          condition.push(`${column} ${operator} ${bind(value)}`);
        }
      }
      const where = condition.length ? ` WHERE ${condition.join(" AND ")}` : "";
      const table = `public.${identifier(path)}`;
      if (req.method === "POST") {
        const rows = Array.isArray(body) ? body : [body];
        const output: Record<string, unknown>[] = [];
        for (const row of rows) {
          const columns = Object.keys(row);
          const p = columns.map((column) => scalar(path, column, row[column]));
          let conflict = "";
          const preference = String(req.headers.prefer || "");
          if (preference.includes("resolution=")) {
            const keys = (url.searchParams.get("on_conflict") || "id").split(",");
            const update = columns
              .filter((column) => !keys.includes(column))
              .map((column) => `${identifier(column)}=excluded.${identifier(column)}`)
              .join(",");
            conflict = ` ON CONFLICT (${keys.map(identifier).join(",")}) ${preference.includes("ignore-duplicates") || !update ? "DO NOTHING" : `DO UPDATE SET ${update}`}`;
          }
          const inserted = await tx.query(
            `INSERT INTO ${table} (${columns.map(identifier).join(",")}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(",")})${conflict} RETURNING *`,
            p,
          );
          output.push(...inserted.rows);
        }
        return { rows: output, total: output.length };
      }
      if (req.method === "PATCH") {
        const set = Object.keys(body)
          .map((column) => `${identifier(column)}=${bind(scalar(path, column, body[column]))}`)
          .join(",");
        const updated = await tx.query(`UPDATE ${table} SET ${set}${where} RETURNING *`, params);
        return { rows: updated.rows, total: updated.rows.length };
      }
      if (req.method === "DELETE") {
        const deleted = await tx.query(`DELETE FROM ${table}${where} RETURNING *`, params);
        return { rows: deleted.rows, total: deleted.rows.length };
      }
      const select = url.searchParams.get("select") || "*";
      const columns = select === "*" ? "*" : select.split(",").map(identifier).join(",");
      const order = (url.searchParams.get("order") || "")
        .split(",")
        .filter(Boolean)
        .map((value) => {
          const [column, direction] = value.split(".");
          return `${identifier(column!)} ${direction === "desc" ? "DESC" : "ASC"}`;
        })
        .join(",");
      const limit = Math.min(10000, Math.max(0, Number(url.searchParams.get("limit") ?? 10000)));
      const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
      const queried = await tx.query(
        `SELECT ${columns} FROM ${table}${where}${order ? ` ORDER BY ${order}` : ""} LIMIT ${limit} OFFSET ${offset}`,
        params,
      );
      const count = await tx.query<{ total: number }>(
        `SELECT count(*)::integer total FROM ${table}${where}`,
        params,
      );
      return { rows: queried.rows, total: count.rows[0]?.total ?? 0 };
    });
    if ("rpc" in result) return respond(result.value);
    res.setHeader("content-range", `0-${Math.max(0, result.rows.length - 1)}/${result.total}`);
    if (req.method === "HEAD") {
      res.writeHead(200);
      return res.end();
    }
    if (singular) {
      if (result.rows.length !== 1)
        return respond(
          {
            message: "JSON object requested, multiple (or no) rows returned",
            code: "PGRST116",
            details: `${result.rows.length} rows`,
          },
          406,
        );
      return respond(result.rows[0]);
    }
    respond(result.rows, req.method === "POST" ? 201 : 200);
  } catch (error) {
    const failure = error as Error & { code?: string };
    console.error(`[local fixture] ${req.method} ${req.url?.split("?")[0]}: ${failure.message}`);
    respond(
      {
        message: failure.message,
        code: failure.code || "FIXTURE_ERROR",
        details: null,
        hint: null,
      },
      /permission|row-level|Invalid fixture token/i.test(failure.message)
        ? 403
        : failure.code === "23505"
          ? 409
          : 400,
    );
  }
});
const appPort = Number(process.env["PORT"]) || 3000;
const env = {
  ...process.env,
  VITE_KKCC_SANDBOX_PREVIEW: "1",
  VITE_SUPABASE_URL: "/__fixture__/supabase",
  SUPABASE_URL: `http://127.0.0.1:${appPort}/__fixture__/supabase`,
  VITE_SUPABASE_PUBLISHABLE_KEY: publicKey,
  SUPABASE_PUBLISHABLE_KEY: publicKey,
  SUPABASE_SERVICE_ROLE_KEY: serviceKey,
  KKCC_CONTENT_BACKEND: "file",
  KKCC_CONTENT_FILE: runtime,
  KKCC_SETTINGS_ENCRYPTION_KEY: randomBytes(32).toString("hex"),
};
Object.assign(process.env, env);
let appServer: ReturnType<typeof createProductionServer> | undefined;
let build: ReturnType<typeof spawn> | undefined;
const stop = () => {
  build?.kill("SIGTERM");
  appServer?.close();
  server.close();
  void database.close().finally(() => process.exit(0));
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);

async function startAppServer() {
  try {
    const module = await import(pathToFileURL(resolve("dist/server/server.js")).href);
    const baseAppServer = createProductionServer(module.default || module);
    appServer = createServer((req, res) => {
      if (req.url && req.url.startsWith("/__fixture__/supabase")) {
        req.url = req.url.slice("/__fixture__/supabase".length) || "/";
        server.emit("request", req, res);
        return;
      }
      baseAppServer.emit("request", req, res);
    });
    appServer.listen(appPort, "0.0.0.0", () =>
      console.log(
        `LOCAL PRODUCTION-BUILD fixture ready on 0.0.0.0:${appPort}; GoTrue/PostgREST emulated, actual SQL/RLS/app handlers.`,
      ),
    );
  } catch (error) {
    console.error(error);
    stop();
  }
}

if (process.env["SKIP_BUILD"] === "1" && existsSync(resolve("dist/server/server.js"))) {
  await startAppServer();
} else {
  build = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "build", "--mode", "fixture"], {
    env,
    stdio: "inherit",
  });
  build.on("exit", async (code) => {
    if (code) {
      server.close();
      await database.close();
      process.exit(code);
    }
    await startAppServer();
  });
}

import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";

/** A local PostgreSQL WASM database, not a connection to the production Supabase project. */
export async function createFixtureDatabase(legacy = false, install = true) {
  const database = new PGlite();
  await database.exec(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE, raw_user_meta_data jsonb NOT NULL DEFAULT '{}', email_confirmed_at timestamptz, created_at timestamptz DEFAULT now());
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.role',true),'') $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon,authenticated,service_role;
    CREATE SCHEMA storage;
    CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean DEFAULT false,file_size_limit bigint,allowed_mime_types text[]);
    CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text,name text,owner uuid,owner_id text,metadata jsonb DEFAULT '{}',created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    CREATE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE sql AS $$ SELECT string_to_array(name,'/') $$;
    GRANT USAGE ON SCHEMA storage TO anon,authenticated,service_role;
  `);
  if (legacy) {
    for (const file of readdirSync("supabase/migrations")
      .filter((file) => file.endsWith(".sql") && file < "20261001120000")
      .sort()) {
      try {
        await database.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
      } catch (error) {
        throw new Error(
          `Historical migration ${file}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
  if (!install) return database;
  if (legacy)
    await database.query("SELECT set_config('kkcc.verified_project_export','true',false)");
  const schema = readFileSync("supabase/STUDENT_ONLY_SCHEMA.sql", "utf8");
  await database.exec(schema);
  return database;
}
export const fixtureIds = {
  admin: "00000000-0000-4000-8000-000000000001",
  studentA: "00000000-0000-4000-8000-000000000002",
  studentB: "00000000-0000-4000-8000-000000000003",
  blocked: "00000000-0000-4000-8000-000000000004",
  course: "10000000-0000-4000-8000-000000000001",
  test: "20000000-0000-4000-8000-000000000001",
  attempt: "30000000-0000-4000-8000-000000000001",
};
export async function seedFixtureUsers(database: PGlite) {
  for (const [name, id] of Object.entries(fixtureIds).slice(0, 4))
    await database.query(
      "INSERT INTO auth.users(id,email,raw_user_meta_data,email_confirmed_at) VALUES($1,$2,$3::jsonb,now())",
      [id, `${name.toLowerCase()}@fixture.invalid`, JSON.stringify({ full_name: name })],
    );
  await database.query("INSERT INTO public.user_roles(user_id,role) VALUES($1,'admin')", [
    fixtureIds.admin,
  ]);
  await database.query(
    "INSERT INTO public.student_blocks(user_id,reason,blocked_by) VALUES($1,'Fixture block',$2)",
    [fixtureIds.blocked, fixtureIds.admin],
  );
}
export async function asRole(
  database: PGlite,
  role: "anon" | "authenticated" | "service_role",
  user = "",
) {
  await database.exec(`RESET ROLE; SET ROLE ${role}`);
  await database.query(
    "SELECT set_config('request.jwt.claim.role',$1,false),set_config('request.jwt.claim.sub',$2,false)",
    [role, user],
  );
}

/** Server-managed CMS tables. Template/question banks are deliberately excluded. */
export const MANAGED_CONTENT_TABLES: Record<string, string> = {
  tests: "kkcc_tests",
  test_questions: "kkcc_test_questions",
  materials: "kkcc_materials",
  site_settings: "kkcc_site_settings",
  private_settings: "kkcc_private_settings",
  files: "kkcc_content_files",
  storage_files: "kkcc_content_files",
};
export const NOTES_SETUP_ERROR =
  "Supabase notes setup required. Run KKCC-Excellence-Hub-NOTES-SUPABASE.sql in Supabase SQL Editor, set SUPABASE_SERVICE_ROLE_KEY on the server, and redeploy. S3 is not required.";

export const TESTS_SETUP_ERROR =
  "Test setup required: run the latest KKCC-Excellence-Hub-PUBLISH-FIX.sql in Supabase SQL Editor, set the server-only SUPABASE_SERVICE_ROLE_KEY, then redeploy. S3 is not required. Only published test rows are saved; template banks remain in project files.";

/** A legacy global file/S3 setting must never divert live notes/tests off Supabase.
 * Explicit local fixtures retain their disposable CMS; never on Vercel. */
export function isLocalManagedFixture(
  table: string,
  env: Record<string, string | undefined>,
): boolean {
  return (
    Boolean(MANAGED_CONTENT_TABLES[table]) &&
    env["KKCC_FIXTURE_LOCAL_CMS"] === "1" &&
    !env["VERCEL"] &&
    !(env["KKCC_TESTS_BACKEND"] === "supabase" && ["tests", "test_questions"].includes(table))
  );
}

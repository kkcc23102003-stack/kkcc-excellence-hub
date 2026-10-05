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
  "Test setup required: run KKCC-Excellence-Hub-EASY-TESTS.sql in Supabase SQL Editor, then redeploy. Only published test rows are saved; template banks remain in project files.";

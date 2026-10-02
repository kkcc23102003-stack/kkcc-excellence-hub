-- KKCC security/app controls and admin system health.
-- Safe additive migration: no student, course, wallet, storage or payment data is changed.
-- Run this file once in Supabase SQL Editor after the earlier KKCC migrations.

-- Public-safe app flags. Admin writes through existing site_settings RLS admin policies.
INSERT INTO public.site_settings (key, value) VALUES
  ('app_maintenance_mode', 'false'),
  ('app_maintenance_message', 'KKCC learning services are temporarily being refreshed. Please check back shortly.'),
  ('security_protection_enabled', 'true'),
  ('security_copy_guard_enabled', 'true'),
  ('security_context_menu_guard_enabled', 'true'),
  ('security_shortcut_guard_enabled', 'true'),
  ('security_watermark_enabled', 'true'),
  ('security_screenshot_blur_enabled', 'true'),
  ('security_print_guard_enabled', 'true'),
  ('feature_kittu_quiz_enabled', 'true'),
  ('feature_test_series_enabled', 'true'),
  ('feature_study_material_enabled', 'true'),
  ('kittu_daily_reward_cap', '160'),
  ('kittu_daily_practice_hours', '8'),
  ('kittu_daily_gift', '5'),
  ('kittu_practice_batches', '[]')
ON CONFLICT (key) DO NOTHING;

-- Refresh the earlier placeholder-style offline payment instruction only when it is
-- still the exact old default; admin-edited custom text is preserved.
UPDATE public.site_settings
SET value = 'Use the KKCC inquiry flow for UPI, cash or bank-transfer access. Course access is activated after the KKCC team confirms the payment.', updated_at = now()
WHERE key = 'offline_payment_instructions'
  AND value = 'Contact admin for UPI/cash/bank-transfer access. After payment, admin will unlock your course.';

-- Refresh old auto-default UI text in saved public JSON. Exact placeholder sentences only;
-- custom admin edits remain untouched.
UPDATE public.site_settings
SET value = replace(
    replace(
      value,
      'Start a free batch or ask admin to activate access after paid/offline payment.',
      'Start a free batch or contact KKCC support to activate paid/offline access.'
    ),
    'If your validity is about to expire, send a message from the Support page or contact admin.',
    'If your validity is about to expire, send a message from the Support page for renewal help.'
  ),
  updated_at = now()
WHERE key = 'ui_text_json'
  AND (
    value LIKE '%Start a free batch or ask admin to activate access after paid/offline payment.%'
    OR value LIKE '%If your validity is about to expire, send a message from the Support page or contact admin.%'
  );

-- Compact, read-only health metrics for admins. This exposes no emails, user IDs,
-- secrets, file URLs, payment keys, student personal data or quiz progress.
CREATE OR REPLACE FUNCTION public.get_kkcc_admin_system_health()
RETURNS TABLE (area text, label text, value text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden — admin access required';
  END IF;

  RETURN QUERY
    SELECT
      'database'::text AS area,
      'database used'::text AS label,
      pg_size_pretty(pg_database_size(current_database()))::text AS value
    UNION ALL
    SELECT 'database', 'students', count(*)::text FROM public.profiles
    UNION ALL
    SELECT 'database', 'courses', count(*)::text FROM public.courses
    UNION ALL
    SELECT 'database', 'lectures', count(*)::text FROM public.lectures
    UNION ALL
    SELECT 'database', 'materials', count(*)::text FROM public.materials
    UNION ALL
    SELECT 'database', 'tests', count(*)::text FROM public.tests
    UNION ALL
    SELECT 'database', 'question rows', count(*)::text FROM public.test_questions
    UNION ALL
    SELECT 'database', 'enrollments', count(*)::text FROM public.course_enrollments
    UNION ALL
    SELECT 'database', 'file metadata rows', count(*)::text FROM public.files
    UNION ALL
    SELECT 'database', 'coin packages', count(*)::text FROM public.coin_packages
    UNION ALL
    SELECT 'database', 'coin transactions', count(*)::text FROM public.coin_transactions
    UNION ALL
    SELECT 'database', 'notifications', count(*)::text FROM public.notifications
    UNION ALL
    SELECT 'database', 'student doubts', count(*)::text FROM public.student_doubts
    UNION ALL
    SELECT 'database', 'admission enquiries', count(*)::text FROM public.admission_enquiries
    UNION ALL
    SELECT 'database', 'payment transactions', count(*)::text FROM public.payment_transactions
    UNION ALL
    SELECT 'database', 'settings rows', count(*)::text FROM public.site_settings
    UNION ALL
    SELECT 'largest tables', 'courses size', pg_size_pretty(pg_total_relation_size('public.courses'))
    UNION ALL
    SELECT 'largest tables', 'lectures size', pg_size_pretty(pg_total_relation_size('public.lectures'))
    UNION ALL
    SELECT 'largest tables', 'materials size', pg_size_pretty(pg_total_relation_size('public.materials'))
    UNION ALL
    SELECT 'largest tables', 'tests size', pg_size_pretty(pg_total_relation_size('public.tests'))
    UNION ALL
    SELECT 'largest tables', 'test questions size', pg_size_pretty(pg_total_relation_size('public.test_questions'))
    UNION ALL
    SELECT 'largest tables', 'files metadata size', pg_size_pretty(pg_total_relation_size('public.files'))
    UNION ALL
    SELECT 'storage', 'storage objects row', count(*)::text FROM storage.objects
    UNION ALL
    SELECT 'free-plan', 'database shared budget', '500 MB on Supabase Free'
    UNION ALL
    SELECT 'free-plan', 'storage shared budget', '1 GB file storage on Supabase Free'
    UNION ALL
    SELECT 'recommendation', 'large media', 'Keep videos on YouTube; move large files to external storage before storage quota is near.'
    UNION ALL
    SELECT 'recommendation', 'Kit 2 Coins Quiz data', 'Browser-local rewards and recent-question signatures do not use Supabase storage.';
END;
$$;

REVOKE ALL ON FUNCTION public.get_kkcc_admin_system_health() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_kkcc_admin_system_health() TO authenticated;

COMMENT ON FUNCTION public.get_kkcc_admin_system_health() IS
  'Admin-only read-only KKCC platform health summary. Returns counts and sizes only; never secrets, PII, URLs, or quiz progress.';

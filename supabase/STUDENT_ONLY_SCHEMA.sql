-- Fresh-install entry point. Same contents as 20261001120000_student_only_learning_access.sql.
-- KKCC student-only Supabase boundary. Educational content stays in project data.
-- Fresh project: run this file, NOT the historical combined CMS SQL.
-- Existing project: export educational/config data first; this migration is
-- non-destructive and does not delete legacy rows. It detaches their FKs.
BEGIN;

-- Cutover guard: an existing CMS must be exported/imported and verified by the owner first.
DO $$ DECLARE t text; has_rows boolean; BEGIN
 IF coalesce(current_setting('kkcc.verified_project_export',true),'')<>'true' THEN
  FOREACH t IN ARRAY ARRAY['courses','lectures','materials','tests','test_questions','site_settings','private_settings','test_series_overrides','ai_question_targets','ai_question_candidates','ai_question_runs','files'] LOOP
   IF to_regclass('public.'||t) IS NOT NULL THEN
    EXECUTE format('SELECT EXISTS(SELECT 1 FROM public.%I)',t) INTO has_rows;
    IF has_rows THEN RAISE EXCEPTION 'Verified project-content export required before cutover (legacy table % is nonempty). After the owner verifies external IDs/counts/assets, SET kkcc.verified_project_export=true in this SQL session and rerun.',t; END IF;
   END IF;
  END LOOP;
 END IF;
END $$;

DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin','user'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  mobile text not null default '',
  class_level text not null default '',
  target_exam text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique(user_id,role)
);
CREATE TABLE IF NOT EXISTS public.student_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  is_active boolean not null default true,
  reason text not null default '',
  blocked_by uuid references auth.users(id),
  blocked_at timestamptz not null default now(),
  unblocked_by uuid references auth.users(id),
  unblocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null,
  status text not null default 'active' check(status in ('active','revoked','expired')),
  source text not null default 'offline',
  payment_method text not null default 'offline',
  amount_paid integer not null default 0 check(amount_paid>=0),
  currency text not null default 'INR',
  admin_note text not null default '',
  expires_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,course_id)
);
CREATE TABLE IF NOT EXISTS public.offline_access_grants (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null default '',
  course_id uuid not null,
  status text not null default 'pending',
  amount_paid integer not null default 0,
  currency text not null default 'INR',
  payment_method text not null default 'offline',
  admin_note text not null default '',
  expires_at timestamptz,
  activated_user_id uuid references auth.users(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(email,course_id)
);
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  course_id uuid,
  provider text not null default 'offline',
  status text not null default 'pending',
  amount integer not null default 0,
  currency text not null default 'INR',
  provider_order_id text not null default '',
  provider_payment_id text not null default '',
  admin_note text not null default '',
  metadata jsonb not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.coin_packages (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  coins integer not null default 0 check(coins>=0),
  bonus_coins integer not null default 0 check(bonus_coins>=0),
  price integer not null default 0 check(price>=0),
  currency text not null default 'INR',
  description text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  amount integer not null check(amount<>0),
  source text not null default 'admin_grant',
  reason text not null default '',
  related_type text not null default '',
  related_id uuid,
  metadata jsonb not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.material_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  material_id uuid not null,
  paid_coins integer not null default 0,
  status text not null default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,material_id)
);
CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null default '',
  description text not null default '',
  discount_percent integer not null default 0 check(discount_percent between 0 and 100),
  max_uses integer not null default 0,
  used_count integer not null default 0,
  per_user_limit integer not null default 1,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  applies_to_course_id uuid,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupon_codes(id),
  user_id uuid not null references auth.users(id),
  course_id uuid not null,
  discount_percent integer not null,
  discount_amount integer not null,
  original_amount integer not null,
  final_amount integer not null,
  currency text not null default 'INR',
  status text not null default 'applied',
  created_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  message text not null default '',
  type text not null default 'general',
  audience text not null default 'all',
  course_id uuid,
  target_user_id uuid references auth.users(id),
  priority text not null default 'normal',
  action_label text not null default 'Open',
  action_url text not null default '',
  is_published boolean not null default false,
  send_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.notification_reads (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  read_at timestamptz not null default now(),
  unique(notification_id,user_id)
);
CREATE TABLE IF NOT EXISTS public.student_doubts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  course_id uuid,
  subject text not null default '',
  title text not null default '',
  message text not null default '',
  attachment_url text not null default '',
  status text not null default 'open',
  priority text not null default 'normal',
  admin_reply text not null default '',
  answered_by uuid references auth.users(id),
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.admission_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  class_level text not null default '',
  interest text not null default '',
  message text not null default '',
  source text not null default 'support',
  status text not null default 'new',
  priority text not null default 'normal',
  admin_note text not null default '',
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.voucher_types (
  id text primary key,
  label text not null,
  value_inr integer not null default 100,
  daily_quota integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.voucher_claims (
  id uuid primary key default gen_random_uuid(),
  voucher_type text not null references public.voucher_types(id),
  user_id uuid not null references auth.users(id),
  claim_day date not null,
  status text not null default 'pending',
  code text not null default '',
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  unique(voucher_type,user_id,claim_day)
);
CREATE TABLE IF NOT EXISTS public.learning_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  test_id uuid,
  series_id text,
  duration_seconds integer not null,
  status text not null default 'started',
  question_count integer not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric,
  total_marks numeric,
  correct_count integer,
  attempted_count integer,
  answers jsonb not null default '{}',
  source_refs text[] not null default '{}'
);
CREATE TABLE IF NOT EXISTS public.test_access_grants (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null,
  user_id uuid not null references auth.users(id),
  granted_by uuid references auth.users(id),
  method text not null default 'offline',
  amount_inr integer not null default 0 check(amount_inr between 0 and 1000000),
  note text not null default '',
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS public.series_access_grants (
  id uuid primary key default gen_random_uuid(),
  series_id text not null,
  user_id uuid not null references auth.users(id),
  granted_by uuid references auth.users(id),
  method text not null default 'offline',
  amount_inr integer not null default 0 check(amount_inr between 0 and 1000000),
  note text not null default '',
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

ALTER TABLE public.course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_source_check;
ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_source_check CHECK(source IN ('free','manual','offline','razorpay','admin','23kaat','coupon'));
ALTER TABLE public.test_access_grants ADD COLUMN IF NOT EXISTS expires_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS test_access_grants_live_idx ON public.test_access_grants(test_id,user_id) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_series_access_grants_one_live ON public.series_access_grants(series_id,user_id) WHERE revoked_at IS NULL;
DO $$ DECLARE row record; BEGIN
 FOR row IN SELECT conrelid::regclass AS tbl, conname FROM pg_constraint
 WHERE contype='f' AND confrelid IN (SELECT c.oid FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('courses','lectures','materials','tests'))
 AND conrelid IN (SELECT c.oid FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('course_enrollments','offline_access_grants','payment_transactions','material_purchases','coupon_codes','coupon_redemptions','notifications','student_doubts','test_access_grants'))
 LOOP EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', row.tbl, row.conname); END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;
CREATE OR REPLACE FUNCTION public.is_user_blocked(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.student_blocks WHERE user_id=_user_id AND is_active) $$;
CREATE OR REPLACE FUNCTION public.get_my_block_status() RETURNS TABLE(is_blocked boolean, reason text, blocked_at timestamptz) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT COALESCE(b.is_active,false), COALESCE(b.reason,''), b.blocked_at FROM (SELECT auth.uid() AS uid) u LEFT JOIN public.student_blocks b ON b.user_id=u.uid $$;
REVOKE ALL ON FUNCTION public.has_role(uuid,public.app_role), public.is_user_blocked(uuid), public.get_my_block_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role), public.is_user_blocked(uuid) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_block_status() TO authenticated;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.profiles TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='profiles' LOOP EXECUTE format('DROP POLICY %I ON public.profiles',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.profiles FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
CREATE POLICY kkcc_profile_update ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.user_roles TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.user_roles TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' LOOP EXECUTE format('DROP POLICY %I ON public.user_roles',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.user_roles FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.user_roles FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.student_blocks ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.student_blocks TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.student_blocks TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='student_blocks' LOOP EXECUTE format('DROP POLICY %I ON public.student_blocks',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.student_blocks FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.student_blocks FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.course_enrollments TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.course_enrollments TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='course_enrollments' LOOP EXECUTE format('DROP POLICY %I ON public.course_enrollments',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.course_enrollments FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.course_enrollments FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.offline_access_grants ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.offline_access_grants TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.offline_access_grants TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='offline_access_grants' LOOP EXECUTE format('DROP POLICY %I ON public.offline_access_grants',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.offline_access_grants FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.offline_access_grants FOR SELECT TO authenticated USING(activated_user_id=auth.uid());
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.payment_transactions TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.payment_transactions TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='payment_transactions' LOOP EXECUTE format('DROP POLICY %I ON public.payment_transactions',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.payment_transactions FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.payment_transactions FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.coin_packages ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.coin_packages TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.coin_packages TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='coin_packages' LOOP EXECUTE format('DROP POLICY %I ON public.coin_packages',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.coin_packages FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
GRANT SELECT ON public.coin_packages TO anon;
CREATE POLICY kkcc_public ON public.coin_packages FOR SELECT TO anon,authenticated USING(is_active);
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.coin_transactions TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.coin_transactions TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='coin_transactions' LOOP EXECUTE format('DROP POLICY %I ON public.coin_transactions',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.coin_transactions FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.coin_transactions FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.material_purchases ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.material_purchases TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.material_purchases TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='material_purchases' LOOP EXECUTE format('DROP POLICY %I ON public.material_purchases',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.material_purchases FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.material_purchases FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.coupon_codes TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.coupon_codes TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='coupon_codes' LOOP EXECUTE format('DROP POLICY %I ON public.coupon_codes',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.coupon_codes FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.coupon_redemptions TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.coupon_redemptions TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='coupon_redemptions' LOOP EXECUTE format('DROP POLICY %I ON public.coupon_redemptions',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.coupon_redemptions FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.coupon_redemptions FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.notifications TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.notifications TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='notifications' LOOP EXECUTE format('DROP POLICY %I ON public.notifications',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.notifications FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_notification_read ON public.notifications FOR SELECT TO authenticated USING(
    is_published AND (send_at IS NULL OR send_at<=now()) AND (expires_at IS NULL OR expires_at>now()) AND
    (audience IN ('all','students') OR (audience='user' AND target_user_id=auth.uid()) OR
    (audience='course' AND EXISTS(SELECT 1 FROM public.course_enrollments e WHERE e.user_id=auth.uid() AND e.course_id=notifications.course_id AND e.status='active' AND (e.expires_at IS NULL OR e.expires_at>now())))));
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.notification_reads TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.notification_reads TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='notification_reads' LOOP EXECUTE format('DROP POLICY %I ON public.notification_reads',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.notification_reads FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.notification_reads FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY kkcc_own_write ON public.notification_reads FOR ALL TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
ALTER TABLE public.student_doubts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.student_doubts TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.student_doubts TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='student_doubts' LOOP EXECUTE format('DROP POLICY %I ON public.student_doubts',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.student_doubts FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.student_doubts FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY kkcc_own_insert ON public.student_doubts FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND status='open' AND admin_reply='' AND answered_by IS NULL);
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.admission_enquiries TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.admission_enquiries TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='admission_enquiries' LOOP EXECUTE format('DROP POLICY %I ON public.admission_enquiries',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.admission_enquiries FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
GRANT INSERT ON public.admission_enquiries TO anon;
CREATE POLICY kkcc_enquiry ON public.admission_enquiries FOR INSERT TO anon,authenticated WITH CHECK(status='new' AND admin_note='' AND length(message) BETWEEN 10 AND 2000);
ALTER TABLE public.voucher_types ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.voucher_types TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.voucher_types TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='voucher_types' LOOP EXECUTE format('DROP POLICY %I ON public.voucher_types',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.voucher_types FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
GRANT SELECT ON public.voucher_types TO anon;
CREATE POLICY kkcc_public ON public.voucher_types FOR SELECT TO anon,authenticated USING(is_active);
ALTER TABLE public.voucher_claims ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.voucher_claims TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.voucher_claims TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='voucher_claims' LOOP EXECUTE format('DROP POLICY %I ON public.voucher_claims',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.voucher_claims FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.voucher_claims FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.learning_attempts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.learning_attempts TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.learning_attempts TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='learning_attempts' LOOP EXECUTE format('DROP POLICY %I ON public.learning_attempts',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.learning_attempts FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.learning_attempts FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.test_access_grants ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.test_access_grants TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.test_access_grants TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='test_access_grants' LOOP EXECUTE format('DROP POLICY %I ON public.test_access_grants',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.test_access_grants FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.test_access_grants FOR SELECT TO authenticated USING(user_id=auth.uid());
ALTER TABLE public.series_access_grants ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.series_access_grants TO service_role;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.series_access_grants TO authenticated;
DO $$ DECLARE row record; BEGIN FOR row IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='series_access_grants' LOOP EXECUTE format('DROP POLICY %I ON public.series_access_grants',row.policyname); END LOOP; END $$;
CREATE POLICY kkcc_admin ON public.series_access_grants FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY kkcc_own_read ON public.series_access_grants FOR SELECT TO authenticated USING(user_id=auth.uid());

-- Profiles' identity/email always comes from auth.users, never from browser fields.
CREATE OR REPLACE FUNCTION public.sync_profile_identity() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN SELECT coalesce(lower(email),'') INTO NEW.email FROM auth.users WHERE id=NEW.id; IF NEW.email IS NULL THEN RAISE EXCEPTION 'Missing auth user'; END IF; RETURN NEW; END $$;
DROP TRIGGER IF EXISTS kkcc_profile_identity ON public.profiles;
CREATE TRIGGER kkcc_profile_identity BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.sync_profile_identity();
CREATE OR REPLACE FUNCTION public.kkcc_auth_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN INSERT INTO public.profiles(id,email,full_name,mobile,class_level,target_exam) VALUES(NEW.id,coalesce(lower(NEW.email),''),COALESCE(NEW.raw_user_meta_data->>'full_name',''),COALESCE(NEW.raw_user_meta_data->>'mobile',''),COALESCE(NEW.raw_user_meta_data->>'class_level',''),COALESCE(NEW.raw_user_meta_data->>'target_exam','')) ON CONFLICT(id) DO UPDATE SET email=excluded.email;
INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,'user') ON CONFLICT(user_id,role) DO NOTHING;
IF NEW.email_confirmed_at IS NOT NULL THEN
 INSERT INTO public.course_enrollments(user_id,course_id,status,source,payment_method,amount_paid,admin_note,expires_at,created_by)
 SELECT NEW.id,g.course_id,'active','offline',g.payment_method,g.amount_paid,g.admin_note,g.expires_at,g.created_by FROM public.offline_access_grants g WHERE lower(g.email)=lower(NEW.email) AND g.status='pending' AND (g.expires_at IS NULL OR g.expires_at>now()) ON CONFLICT(user_id,course_id) DO UPDATE SET status='active',expires_at=excluded.expires_at,updated_at=now();
 UPDATE public.offline_access_grants SET status='activated',activated_user_id=NEW.id,updated_at=now() WHERE lower(email)=lower(NEW.email) AND status='pending' AND (expires_at IS NULL OR expires_at>now());
END IF;
RETURN NEW; END $$;
DO $$ DECLARE tr record; BEGIN FOR tr IN SELECT t.tgname FROM pg_trigger t JOIN pg_proc p ON p.oid=t.tgfoid WHERE t.tgrelid='auth.users'::regclass AND NOT t.tgisinternal AND p.proname IN ('handle_new_user','handle_new_auth_user','activate_pending_offline_access') LOOP EXECUTE format('DROP TRIGGER %I ON auth.users',tr.tgname); END LOOP; END $$;
DROP TRIGGER IF EXISTS kkcc_student_profile ON auth.users;
CREATE TRIGGER kkcc_student_profile AFTER INSERT OR UPDATE OF email,email_confirmed_at ON auth.users FOR EACH ROW EXECUTE FUNCTION public.kkcc_auth_profile();
CREATE OR REPLACE FUNCTION public.claim_admin() RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_role(auth.uid(),'admin') $$;
REVOKE ALL ON FUNCTION public.claim_admin() FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

-- Blocked users are denied sensitive writes even if their JWT has not expired.
CREATE OR REPLACE FUNCTION public.admin_grant_learning_access(p_kind text,p_key text,p_user_id uuid,p_method text,p_amount integer,p_note text,p_expires_at timestamptz,p_coin_bonus integer DEFAULT 0) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE renewed boolean := false;
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') OR public.is_user_blocked(auth.uid()) THEN RAISE EXCEPTION 'Forbidden — admin access required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=p_user_id) THEN RAISE EXCEPTION 'Student profile not found'; END IF;
 IF public.is_user_blocked(p_user_id) THEN RAISE EXCEPTION 'Student account is blocked; unblock before enrolling'; END IF;
 IF p_amount NOT BETWEEN 0 AND 1000000 OR p_coin_bonus NOT BETWEEN 0 AND 10000000 OR (p_expires_at IS NOT NULL AND p_expires_at<=now()) THEN RAISE EXCEPTION 'Invalid payment or validity'; END IF;
 PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text || ':' || p_kind || ':' || p_key));
 IF p_kind='course' THEN
   SELECT EXISTS(SELECT 1 FROM public.course_enrollments WHERE user_id=p_user_id AND course_id=p_key::uuid) INTO renewed;
   INSERT INTO public.course_enrollments(user_id,course_id,status,source,payment_method,amount_paid,admin_note,expires_at,created_by)
   VALUES(p_user_id,p_key::uuid,'active','offline',p_method,p_amount,p_note,p_expires_at,auth.uid())
   ON CONFLICT(user_id,course_id) DO UPDATE SET status='active',source='offline',payment_method=excluded.payment_method,amount_paid=excluded.amount_paid,admin_note=excluded.admin_note,expires_at=excluded.expires_at,created_by=excluded.created_by,updated_at=now();
 ELSIF p_kind='test' THEN
   SELECT EXISTS(SELECT 1 FROM public.test_access_grants WHERE user_id=p_user_id AND test_id=p_key::uuid AND revoked_at IS NULL) INTO renewed;
   INSERT INTO public.test_access_grants(user_id,test_id,granted_by,method,amount_inr,note,expires_at) VALUES(p_user_id,p_key::uuid,auth.uid(),p_method,p_amount,p_note,p_expires_at)
   ON CONFLICT(test_id,user_id) WHERE revoked_at IS NULL DO UPDATE SET expires_at=excluded.expires_at,method=excluded.method,amount_inr=excluded.amount_inr,note=excluded.note,granted_by=excluded.granted_by;
 ELSIF p_kind='series' THEN
   IF length(btrim(p_key))=0 THEN RAISE EXCEPTION 'Missing series ID'; END IF;
   SELECT EXISTS(SELECT 1 FROM public.series_access_grants WHERE user_id=p_user_id AND series_id=p_key AND revoked_at IS NULL) INTO renewed;
   INSERT INTO public.series_access_grants(user_id,series_id,granted_by,method,amount_inr,note,expires_at) VALUES(p_user_id,p_key,auth.uid(),p_method,p_amount,p_note,p_expires_at)
   ON CONFLICT(series_id,user_id) WHERE revoked_at IS NULL DO UPDATE SET expires_at=excluded.expires_at,method=excluded.method,amount_inr=excluded.amount_inr,note=excluded.note,granted_by=excluded.granted_by;
 ELSE RAISE EXCEPTION 'Unknown access kind'; END IF;
 IF p_coin_bonus>0 AND NOT renewed THEN INSERT INTO public.coin_transactions(user_id,amount,source,reason,related_type,related_id,created_by) VALUES(p_user_id,p_coin_bonus,'admin_grant','Enrollment bonus',p_kind,CASE WHEN p_kind='series' THEN NULL ELSE p_key::uuid END,auth.uid()); END IF;
 RETURN jsonb_build_object('ok',true,'renewed',renewed,'user_id',p_user_id,'key',p_key);
END $$;
REVOKE ALL ON FUNCTION public.admin_grant_learning_access(text,text,uuid,text,integer,text,timestamptz,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_grant_learning_access(text,text,uuid,text,integer,text,timestamptz,integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_23kaat_balance(_user_id uuid) RETURNS integer LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
BEGIN IF auth.role()<>'service_role' AND (_user_id IS DISTINCT FROM auth.uid()) AND NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
IF public.has_role(_user_id,'admin') THEN RETURN 2147483647; END IF;
RETURN COALESCE((SELECT SUM(amount) FROM public.coin_transactions WHERE user_id=_user_id),0)::integer; END $$;
CREATE OR REPLACE FUNCTION public.grant_23kaat_to_user(_user_id uuid,_amount integer,_reason text DEFAULT 'Admin grant',_related_type text DEFAULT '',_related_id uuid DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN IF NOT public.has_role(auth.uid(),'admin') OR public.is_user_blocked(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
IF _amount NOT BETWEEN 1 AND 10000000 THEN RAISE EXCEPTION 'Invalid amount'; END IF;
PERFORM pg_advisory_xact_lock(hashtext(_user_id::text));
INSERT INTO public.coin_transactions(user_id,amount,source,reason,related_type,related_id,created_by) VALUES(_user_id,_amount,'admin_grant',_reason,_related_type,_related_id,auth.uid());
RETURN jsonb_build_object('ok',true,'amount',_amount,'balance',public.get_23kaat_balance(_user_id)); END $$;
REVOKE ALL ON FUNCTION public.get_23kaat_balance(uuid),public.grant_23kaat_to_user(uuid,integer,text,text,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_23kaat_balance(uuid),public.grant_23kaat_to_user(uuid,integer,text,text,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_23kaat_balance(uuid) TO service_role;

-- Price is looked up in PRIVATE PROJECT DATA by a verified server function.
-- This RPC is service-role-only: a browser can never choose its own price.
CREATE OR REPLACE FUNCTION public.purchase_learning_item(p_actor uuid,p_kind text,p_key text,p_price integer) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE balance integer; owned boolean := false; cost integer := p_price;
BEGIN IF auth.role()<>'service_role' THEN RAISE EXCEPTION 'Server only'; END IF;
IF public.is_user_blocked(p_actor) OR NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=p_actor) THEN RAISE EXCEPTION 'Student unavailable'; END IF;
IF cost NOT BETWEEN 0 AND 1000000 THEN RAISE EXCEPTION 'Invalid price'; END IF;
PERFORM pg_advisory_xact_lock(hashtext(p_actor::text));
IF p_kind='course' THEN SELECT EXISTS(SELECT 1 FROM public.course_enrollments WHERE user_id=p_actor AND course_id=p_key::uuid AND status='active' AND (expires_at IS NULL OR expires_at>now())) INTO owned;
ELSIF p_kind='material' THEN SELECT EXISTS(SELECT 1 FROM public.material_purchases WHERE user_id=p_actor AND material_id=p_key::uuid AND status='active') INTO owned;
ELSIF p_kind='series' THEN SELECT EXISTS(SELECT 1 FROM public.series_access_grants WHERE user_id=p_actor AND series_id=p_key AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at>now())) INTO owned;
ELSIF p_kind='test' THEN SELECT EXISTS(SELECT 1 FROM public.test_access_grants WHERE user_id=p_actor AND test_id=p_key::uuid AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at>now())) INTO owned;
ELSE RAISE EXCEPTION 'Unknown purchase'; END IF;
balance := public.get_23kaat_balance(p_actor);
IF owned THEN RETURN jsonb_build_object('ok',true,'already_owned',true,'balance',balance); END IF;
IF public.has_role(p_actor,'admin') THEN cost:=0; END IF;
IF balance<cost THEN RAISE EXCEPTION 'Not enough 23KAAT coins'; END IF;
IF cost>0 THEN INSERT INTO public.coin_transactions(user_id,amount,source,reason,related_type,related_id,created_by) VALUES(p_actor,-cost,'purchase','Learning access purchase',p_kind,CASE WHEN p_kind='series' THEN NULL ELSE p_key::uuid END,p_actor); END IF;
IF p_kind='course' THEN INSERT INTO public.course_enrollments(user_id,course_id,status,source,payment_method,amount_paid,currency,created_by) VALUES(p_actor,p_key::uuid,'active',CASE WHEN cost=0 THEN 'free' ELSE '23kaat' END,'23KAAT',cost,'23KAAT',p_actor) ON CONFLICT(user_id,course_id) DO UPDATE SET status='active',source=excluded.source,payment_method='23KAAT',amount_paid=cost,expires_at=NULL,updated_at=now();
ELSIF p_kind='material' THEN INSERT INTO public.material_purchases(user_id,material_id,status,paid_coins,created_by) VALUES(p_actor,p_key::uuid,'active',cost,p_actor) ON CONFLICT(user_id,material_id) DO UPDATE SET status='active',paid_coins=cost,updated_at=now();
ELSIF p_kind='series' THEN INSERT INTO public.series_access_grants(user_id,series_id,method,amount_inr,granted_by) VALUES(p_actor,p_key,'23KAAT',0,p_actor) ON CONFLICT(series_id,user_id) WHERE revoked_at IS NULL DO UPDATE SET expires_at=NULL,method='23KAAT';
ELSE INSERT INTO public.test_access_grants(user_id,test_id,method,amount_inr,granted_by) VALUES(p_actor,p_key::uuid,'23KAAT',0,p_actor) ON CONFLICT(test_id,user_id) WHERE revoked_at IS NULL DO UPDATE SET expires_at=NULL,method='23KAAT'; END IF;
RETURN jsonb_build_object('ok',true,'spent',cost,'balance',public.get_23kaat_balance(p_actor),'free',cost=0);
END $$;
REVOKE ALL ON FUNCTION public.purchase_learning_item(uuid,text,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_learning_item(uuid,text,text,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.get_public_student_stats() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT jsonb_build_object('students_joined',(SELECT count(*) FROM public.profiles),'active_students',(SELECT count(DISTINCT user_id) FROM public.course_enrollments WHERE status='active' AND (expires_at IS NULL OR expires_at>now()))) $$;
REVOKE ALL ON FUNCTION public.get_public_student_stats() FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.get_public_student_stats() TO anon,authenticated;

CREATE OR REPLACE FUNCTION public.voucher_claim_day() RETURNS date LANGUAGE sql STABLE AS $$ SELECT ((now() AT TIME ZONE 'Asia/Kolkata')-interval '1 hour')::date $$;
CREATE OR REPLACE FUNCTION public.voucher_remaining_today(p_type text) RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT CASE WHEN daily_quota IS NULL THEN 2147483647 ELSE GREATEST(0,daily_quota-(SELECT count(*) FROM public.voucher_claims WHERE voucher_type=p_type AND claim_day=public.voucher_claim_day() AND status<>'rejected')::integer) END FROM public.voucher_types WHERE id=p_type AND is_active $$;
CREATE OR REPLACE FUNCTION public.claim_reward_voucher(p_type text,p_earned integer) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE request_code text;
BEGIN IF auth.uid() IS NULL OR public.is_user_blocked(auth.uid()) THEN RAISE EXCEPTION 'Login required'; END IF;
IF p_earned<1000000 THEN RAISE EXCEPTION 'Monthly target incomplete'; END IF;
PERFORM pg_advisory_xact_lock(hashtext('voucher:'||p_type));
IF NOT EXISTS(SELECT 1 FROM public.voucher_types WHERE id=p_type AND is_active AND (daily_quota IS NULL OR daily_quota>0)) THEN RAISE EXCEPTION 'This reward is not on offer'; END IF;
IF public.voucher_remaining_today(p_type)<=0 THEN RAISE EXCEPTION 'All vouchers claimed today; resets at 1 AM IST'; END IF;
request_code:='KV-'||upper(substr(p_type,1,3))||'-'||upper(substr(gen_random_uuid()::text,1,8));
INSERT INTO public.voucher_claims(voucher_type,user_id,claim_day,code) VALUES(p_type,auth.uid(),public.voucher_claim_day(),request_code);
RETURN jsonb_build_object('ok',true,'code',request_code,'status','pending','verification_required',true); END $$;
REVOKE ALL ON FUNCTION public.voucher_claim_day(),public.voucher_remaining_today(text),public.claim_reward_voucher(text,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.voucher_claim_day(),public.voucher_remaining_today(text) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_reward_voucher(text,integer) TO authenticated;
INSERT INTO public.voucher_types(id,label,value_inr,daily_quota,sort_order) VALUES('amazon','Amazon gift voucher',100,100,1),('flipkart','Flipkart gift voucher',100,100,2),('23kaat','23KAAT coin credit',100,NULL,3) ON CONFLICT(id) DO NOTHING;

-- Do not expose the historical educational tables through PostgREST after cutover.
-- They are retained pending a VERIFIED project-data export, not deleted here.
DO $$ DECLARE row record; BEGIN FOR row IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND c.relname IN ('courses','lectures','materials','tests','test_questions','ai_question_targets','ai_question_candidates','ai_question_runs','site_settings','private_settings','test_series_overrides','files') AND c.relkind='r'
LOOP EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated',row.relname); END LOOP; END $$;
-- Attempt answers are student-response metadata, never educational questions/keys.
ALTER TABLE public.learning_attempts ADD COLUMN IF NOT EXISTS question_timer_seconds integer NOT NULL DEFAULT 0;
ALTER TABLE public.learning_attempts ADD COLUMN IF NOT EXISTS answer_revision integer NOT NULL DEFAULT 0;
DROP FUNCTION IF EXISTS public.save_learning_attempt_answers(uuid,uuid,jsonb);
CREATE OR REPLACE FUNCTION public.save_learning_attempt_answers(p_actor uuid,p_attempt uuid,p_answers jsonb,p_revision integer DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v public.learning_attempts%ROWTYPE; active_key text;
BEGIN
 IF auth.role()<>'service_role' THEN RAISE EXCEPTION 'Server only'; END IF;
 IF public.is_user_blocked(p_actor) THEN RAISE EXCEPTION 'Account blocked'; END IF;
 SELECT * INTO v FROM public.learning_attempts WHERE id=p_attempt AND user_id=p_actor FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
 IF v.status<>'started' THEN RETURN jsonb_build_object('ok',false,'reason','submitted'); END IF;
 IF v.duration_seconds>0 AND clock_timestamp()>=v.started_at+make_interval(secs=>v.duration_seconds) THEN RETURN jsonb_build_object('ok',false,'reason','expired'); END IF;
 IF p_revision IS NOT NULL AND p_revision<=v.answer_revision THEN RETURN jsonb_build_object('ok',false,'reason','stale_revision'); END IF;
 IF p_revision IS NOT NULL AND p_revision>v.answer_revision+10000 THEN RAISE EXCEPTION 'Invalid answer revision'; END IF;
 IF jsonb_typeof(p_answers)<>'object' THEN RAISE EXCEPTION 'Invalid answers'; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_each(p_answers) a WHERE NOT (a.key=ANY(v.source_refs)) OR jsonb_typeof(a.value)<>'number' OR (a.value::text)::numeric NOT BETWEEN 0 AND 5 OR trunc((a.value::text)::numeric)<>(a.value::text)::numeric) THEN RAISE EXCEPTION 'Invalid answer reference'; END IF;
 IF v.question_timer_seconds>0 THEN
   active_key:=v.source_refs[1+floor(extract(epoch FROM clock_timestamp()-v.started_at)/v.question_timer_seconds)::integer];
   IF active_key IS NULL OR (p_answers-active_key)<>(v.answers-active_key) THEN RETURN jsonb_build_object('ok',false,'reason','question_window_closed'); END IF;
 END IF;
 UPDATE public.learning_attempts SET answers=p_answers,answer_revision=coalesce(p_revision,v.answer_revision+1) WHERE id=v.id;
 RETURN jsonb_build_object('ok',true);
END $$;
CREATE OR REPLACE FUNCTION public.finalize_learning_attempt(p_actor uuid,p_attempt uuid,p_answers jsonb,p_expected_saved_answers jsonb,p_fresh_result jsonb,p_saved_result jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v public.learning_attempts%ROWTYPE; result jsonb; active_key text; accept_fresh boolean;
BEGIN
 IF auth.role()<>'service_role' THEN RAISE EXCEPTION 'Server only'; END IF;
 IF public.is_user_blocked(p_actor) THEN RAISE EXCEPTION 'Account blocked'; END IF;
 SELECT * INTO v FROM public.learning_attempts WHERE id=p_attempt AND user_id=p_actor FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
 IF v.status='submitted' THEN RETURN to_jsonb(v); END IF;
 IF v.status<>'started' THEN RAISE EXCEPTION 'Attempt not active'; END IF;
 accept_fresh:=v.duration_seconds=0 OR clock_timestamp()<v.started_at+make_interval(secs=>v.duration_seconds);
 IF v.question_timer_seconds>0 AND accept_fresh THEN
   active_key:=v.source_refs[1+floor(extract(epoch FROM clock_timestamp()-v.started_at)/v.question_timer_seconds)::integer];
   accept_fresh:=active_key IS NOT NULL AND (p_answers-active_key)=(v.answers-active_key);
 END IF;
 IF accept_fresh THEN
   IF jsonb_typeof(p_answers)<>'object' OR EXISTS(SELECT 1 FROM jsonb_each(p_answers) a WHERE NOT (a.key=ANY(v.source_refs)) OR jsonb_typeof(a.value)<>'number') THEN RAISE EXCEPTION 'Invalid answers'; END IF;
   v.answers:=p_answers; result:=p_fresh_result;
 ELSE
   IF v.answers IS DISTINCT FROM p_expected_saved_answers THEN RAISE EXCEPTION 'ATTEMPT_RETRY'; END IF;
   result:=p_saved_result;
 END IF;
 UPDATE public.learning_attempts SET answers=v.answers,status='submitted',submitted_at=clock_timestamp(),score=(result->>'score')::numeric,total_marks=(result->>'totalMarks')::numeric,correct_count=(result->>'correct')::integer,attempted_count=(result->>'attempted')::integer WHERE id=v.id RETURNING * INTO v;
 RETURN to_jsonb(v);
END $$;
REVOKE ALL ON FUNCTION public.save_learning_attempt_answers(uuid,uuid,jsonb,integer),public.finalize_learning_attempt(uuid,uuid,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_learning_attempt_answers(uuid,uuid,jsonb,integer),public.finalize_learning_attempt(uuid,uuid,jsonb,jsonb,jsonb,jsonb) TO service_role;

-- Coupon prices are read from PRIVATE PROJECT DATA by a protected server function.
CREATE OR REPLACE FUNCTION public.redeem_project_course_coupon(p_actor uuid,p_code text,p_course_id uuid,p_original_amount integer) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE coupon public.coupon_codes%ROWTYPE; prior public.coupon_redemptions%ROWTYPE; discounted integer; final integer;
BEGIN
 IF auth.role()<>'service_role' THEN RAISE EXCEPTION 'Server only'; END IF;
 IF public.is_user_blocked(p_actor) THEN RAISE EXCEPTION 'Account blocked'; END IF;
 IF p_original_amount NOT BETWEEN 0 AND 1000000 THEN RAISE EXCEPTION 'Invalid project price'; END IF;
 SELECT * INTO coupon FROM public.coupon_codes WHERE code=upper(btrim(p_code)) FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Coupon code not found'; END IF;
 IF NOT coupon.is_active OR (coupon.starts_at IS NOT NULL AND coupon.starts_at>now()) OR (coupon.expires_at IS NOT NULL AND coupon.expires_at<=now()) THEN RAISE EXCEPTION 'Coupon inactive or expired'; END IF;
 IF coupon.applies_to_course_id IS NOT NULL AND coupon.applies_to_course_id<>p_course_id THEN RAISE EXCEPTION 'Coupon not valid for this course'; END IF;
 SELECT * INTO prior FROM public.coupon_redemptions WHERE coupon_id=coupon.id AND user_id=p_actor AND course_id=p_course_id ORDER BY created_at DESC LIMIT 1;
 IF FOUND THEN RETURN jsonb_build_object('ok',true,'already_redeemed',true,'code',coupon.code,'course_id',p_course_id,'final_amount',prior.final_amount,'discount_amount',prior.discount_amount,'discount_percent',prior.discount_percent,'enrolled',prior.final_amount=0); END IF;
 IF coupon.max_uses>0 AND coupon.used_count>=coupon.max_uses THEN RAISE EXCEPTION 'Coupon usage limit full'; END IF;
 IF (SELECT count(*) FROM public.coupon_redemptions WHERE coupon_id=coupon.id AND user_id=p_actor)>=coupon.per_user_limit THEN RAISE EXCEPTION 'Per-student coupon limit reached'; END IF;
 discounted:=least(p_original_amount,round(p_original_amount*coupon.discount_percent/100.0)::integer); final:=greatest(0,p_original_amount-discounted);
 INSERT INTO public.coupon_redemptions(coupon_id,user_id,course_id,discount_percent,discount_amount,original_amount,final_amount,status) VALUES(coupon.id,p_actor,p_course_id,coupon.discount_percent,discounted,p_original_amount,final,CASE WHEN final=0 THEN 'enrolled' ELSE 'applied' END);
 UPDATE public.coupon_codes SET used_count=used_count+1,updated_at=now() WHERE id=coupon.id;
 IF final=0 THEN INSERT INTO public.course_enrollments(user_id,course_id,status,source,payment_method,amount_paid,created_by) VALUES(p_actor,p_course_id,'active','coupon','coupon',0,p_actor) ON CONFLICT(user_id,course_id) DO UPDATE SET status='active',source='coupon',payment_method='coupon',amount_paid=0,expires_at=NULL,updated_at=now(); END IF;
 RETURN jsonb_build_object('ok',true,'code',coupon.code,'course_id',p_course_id,'final_amount',final,'discount_amount',discounted,'discount_percent',coupon.discount_percent,'enrolled',final=0);
END $$;
REVOKE ALL ON FUNCTION public.redeem_project_course_coupon(uuid,text,uuid,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_project_course_coupon(uuid,text,uuid,integer) TO service_role;

-- Revoke historical definer RPCs that queried educational tables or leaked paid URLs.
-- Keep all old rows for the verified export; no old question/template is deleted.
DO $$ DECLARE fn record; BEGIN FOR fn IN
 SELECT p.oid::regprocedure signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('spend_23kaat_for_course','spend_23kaat_for_material','spend_23kaat_for_test','spend_23kaat_for_series','redeem_coupon_for_course','get_my_material_access_url') OR pg_get_functiondef(p.oid) ~* '(from|join|into|update|delete[[:space:]]+from)[[:space:]]+(public[.])?"?(courses|lectures|materials|tests|test_questions|site_settings|private_settings|test_series_overrides|ai_question_targets|ai_question_candidates|ai_question_runs|files)"?([[:space:];(]|$)')
 LOOP EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',fn.signature); END LOOP; END $$;


-- Existing auth accounts get profiles/ordinary roles even if a former signup upsert failed.
INSERT INTO public.profiles(id,email,full_name,mobile,class_level,target_exam)
SELECT id,coalesce(lower(email),''),coalesce(raw_user_meta_data->>'full_name',''),coalesce(raw_user_meta_data->>'mobile',''),coalesce(raw_user_meta_data->>'class_level',''),coalesce(raw_user_meta_data->>'target_exam','') FROM auth.users
ON CONFLICT(id) DO UPDATE SET email=excluded.email;
INSERT INTO public.user_roles(user_id,role) SELECT id,'user' FROM auth.users ON CONFLICT(user_id,role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.kkcc_guard_admin_role() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF OLD.role='admin' AND (TG_OP='DELETE' OR NEW.role<>'admin' OR NEW.user_id<>OLD.user_id) THEN
  PERFORM pg_advisory_xact_lock(hashtext('kkcc:admin-roles'));
  IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE role='admin' AND id<>OLD.id) THEN RAISE EXCEPTION 'At least one admin must remain'; END IF;
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
DROP TRIGGER IF EXISTS kkcc_guard_admin_role ON public.user_roles;
CREATE TRIGGER kkcc_guard_admin_role BEFORE DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.kkcc_guard_admin_role();
CREATE OR REPLACE FUNCTION public.kkcc_guard_admin_block() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN IF NEW.is_active AND public.has_role(NEW.user_id,'admin') THEN RAISE EXCEPTION 'Admin accounts cannot be blocked with the student tool'; END IF; RETURN NEW; END $$;
DROP TRIGGER IF EXISTS kkcc_guard_admin_block ON public.student_blocks;
CREATE TRIGGER kkcc_guard_admin_block BEFORE INSERT OR UPDATE ON public.student_blocks FOR EACH ROW EXECUTE FUNCTION public.kkcc_guard_admin_block();

CREATE OR REPLACE FUNCTION public.kkcc_attempt_start_limit() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM public.learning_attempts WHERE id=NEW.id AND user_id=NEW.user_id) OR public.has_role(NEW.user_id,'admin') THEN RETURN NEW; END IF;
 PERFORM pg_advisory_xact_lock(hashtext('kkcc:attempts:'||NEW.user_id::text));
 IF (SELECT count(*) FROM public.learning_attempts WHERE user_id=NEW.user_id AND started_at>clock_timestamp()-interval '1 hour')>=30 THEN RAISE EXCEPTION 'Practice start limit reached (30/hour). Resume an existing attempt or try later.'; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS kkcc_attempt_start_limit ON public.learning_attempts;
CREATE TRIGGER kkcc_attempt_start_limit BEFORE INSERT ON public.learning_attempts FOR EACH ROW EXECUTE FUNCTION public.kkcc_attempt_start_limit();
CREATE INDEX IF NOT EXISTS kkcc_attempt_history_user ON public.learning_attempts(user_id,started_at DESC);

-- Stop historical educational uploads while preserving unrelated profile/avatar buckets.
DO $$ DECLARE p record; BEGIN FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND (coalesce(qual,'')||coalesce(with_check,'')) LIKE '%course-content%' LOOP EXECUTE format('DROP POLICY %I ON storage.objects',p.policyname); END LOOP; END $$;

CREATE TABLE IF NOT EXISTS public.syllabus_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.syllabus_nodes(id) ON DELETE CASCADE,
  node_type text NOT NULL CHECK (node_type IN ('subject','chapter','topic')),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_parent ON public.syllabus_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_type_name ON public.syllabus_nodes(node_type, name);
ALTER TABLE public.syllabus_nodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Syllabus is publicly readable" ON public.syllabus_nodes;
CREATE POLICY "Syllabus is publicly readable" ON public.syllabus_nodes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage syllabus" ON public.syllabus_nodes;
CREATE POLICY "Admins manage syllabus" ON public.syllabus_nodes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.syllabus_nodes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.syllabus_nodes TO authenticated;
GRANT ALL ON public.syllabus_nodes TO service_role;
COMMIT;
-- KKCC Free-plan space tools. Run ONCE in Supabase SQL Editor.
-- Installing this file deletes NOTHING. Admin panel defaults to preview only.
-- Back up before a confirmed cleanup. Submitted results/payments/users stay intact.
BEGIN;
CREATE OR REPLACE FUNCTION public.kkcc_space_report(
  p_cleanup boolean DEFAULT false,
  p_before timestamptz DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  cutoff timestamptz := coalesce(p_before, now() - interval '90 days');
  candidates integer := 0;
  removed integer := 0;
  sizes jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF cutoff > now() - interval '90 days' OR cutoff < timestamptz '2000-01-01' THEN
    RAISE EXCEPTION 'Cutoff must be at least 90 days old';
  END IF;
  -- Bound work to 5,000 rows per confirmed batch. No cron, no silent deletion.
  SELECT count(*) INTO candidates FROM (
    SELECT id FROM public.learning_attempts
    WHERE status = 'started' AND submitted_at IS NULL
      AND started_at < cutoff AND duration_seconds >= 0
      AND started_at + make_interval(secs => duration_seconds) < cutoff
    ORDER BY started_at, id LIMIT 5000
  ) eligible;
  IF p_cleanup THEN
    WITH eligible AS (
      SELECT id FROM public.learning_attempts
      WHERE status = 'started' AND submitted_at IS NULL
        AND started_at < cutoff AND duration_seconds >= 0
        AND started_at + make_interval(secs => duration_seconds) < cutoff
      ORDER BY started_at, id LIMIT 5000 FOR UPDATE SKIP LOCKED
    )
    DELETE FROM public.learning_attempts a USING eligible e
    WHERE a.id = e.id AND a.status = 'started' AND a.submitted_at IS NULL;
    GET DIAGNOSTICS removed = ROW_COUNT;
  END IF;
  SELECT coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO sizes FROM (
    SELECT c.relname AS name, pg_total_relation_size(c.oid) AS bytes
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r','m')
    ORDER BY pg_total_relation_size(c.oid) DESC LIMIT 12
  ) t;
  RETURN jsonb_build_object(
    'database_bytes', pg_database_size(current_database()),
    'tables', sizes, 'cutoff', cutoff, 'eligible_batch', candidates,
    'deleted', removed, 'batch_limit', 5000, 'preview', NOT p_cleanup
  );
END $$;
REVOKE ALL ON FUNCTION public.kkcc_space_report(boolean,timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.kkcc_space_report(boolean,timestamptz) TO authenticated;

-- Disable the old destructive cleaner entry point. It used to delete 24-hour
-- attempts and expire grants, and could run without checking the caller's role.
-- Legacy callers now get a non-destructive, admin-only report.
CREATE OR REPLACE FUNCTION public.kkcc_clean_database_bloat()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  RETURN public.kkcc_space_report(false, NULL);
END $$;
REVOKE ALL ON FUNCTION public.kkcc_clean_database_bloat() FROM PUBLIC, anon, service_role;
GRANT EXECUTE ON FUNCTION public.kkcc_clean_database_bloat() TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
-- PostgreSQL autovacuum can reuse deleted space later. File size/billed usage
-- need not shrink immediately. Do NOT run VACUUM FULL on a live app casually.
-- This report is database size, NOT Supabase Storage object quota or billing.
-- NOTES READ-ONLY FIX: durable Supabase notes/settings, no S3 required.
-- Additive. Does not delete legacy data, student records or question banks.
-- Deploy updated app alongside this migration. Never expose service_role in VITE_*.
BEGIN;
CREATE TABLE IF NOT EXISTS public.kkcc_materials (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 course_id uuid, lecture_id uuid,
 title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '',
 subject text NOT NULL DEFAULT '', chapter text NOT NULL DEFAULT '',
 module_title text NOT NULL DEFAULT '', batch text NOT NULL DEFAULT '',
 material_type text NOT NULL DEFAULT 'Notes', class_level text NOT NULL DEFAULT '',
 pages integer NOT NULL DEFAULT 0, file_url text, thumbnail_url text,
 access_type text NOT NULL DEFAULT 'free', price integer NOT NULL DEFAULT 0,
 coin_price integer NOT NULL DEFAULT 0, is_published boolean NOT NULL DEFAULT false,
 sort_order integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_site_settings (
 key text PRIMARY KEY, value text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_private_settings (
 key text PRIMARY KEY, value text NOT NULL DEFAULT '', updated_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_content_files (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text NOT NULL DEFAULT 'supabase',
 bucket text NOT NULL DEFAULT 'course-content', path text NOT NULL,
 public_url text NOT NULL DEFAULT '', original_url text NOT NULL DEFAULT '',
 mime_type text NOT NULL DEFAULT '', size_bytes bigint NOT NULL DEFAULT 0,
 linked_table text NOT NULL DEFAULT '', linked_id uuid, created_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
-- App server checks admin/student access before reading these tables.
-- Browser roles must NEVER read private settings or paid note bodies directly.
ALTER TABLE public.kkcc_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_private_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_content_files ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_materials,public.kkcc_site_settings,public.kkcc_private_settings,public.kkcc_content_files FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_materials,public.kkcc_site_settings,public.kkcc_private_settings,public.kkcc_content_files TO service_role;
CREATE INDEX IF NOT EXISTS kkcc_materials_published_order ON public.kkcc_materials(is_published,sort_order);

-- Copy matching old CMS rows once, without overwriting any newer admin edits.
DO $$ BEGIN
 IF to_regclass('public.materials') IS NOT NULL THEN
   EXECUTE $copy$
     INSERT INTO public.kkcc_materials
     SELECT (jsonb_populate_record(NULL::public.kkcc_materials,
       '{"title":"","description":"","subject":"","chapter":"","module_title":"","batch":"","material_type":"Notes","class_level":"","pages":0,"access_type":"free","price":0,"coin_price":0,"is_published":false,"sort_order":0}'::jsonb
       || jsonb_build_object('created_at',now(),'updated_at',now()) || jsonb_strip_nulls(to_jsonb(m)))).*
     FROM public.materials m ON CONFLICT(id) DO NOTHING
   $copy$;
 END IF;
 IF to_regclass('public.site_settings') IS NOT NULL THEN
   EXECUTE 'INSERT INTO public.kkcc_site_settings(key,value) SELECT key,coalesce(value,'''') FROM public.site_settings ON CONFLICT(key) DO NOTHING';
 END IF;
 IF to_regclass('public.private_settings') IS NOT NULL THEN
   EXECUTE 'INSERT INTO public.kkcc_private_settings(key,value) SELECT key,coalesce(value,'''') FROM public.private_settings ON CONFLICT(key) DO NOTHING';
 END IF;
END $$;
-- Do not overwrite an existing provider and break previously uploaded objects.
INSERT INTO public.kkcc_site_settings(key,value) VALUES
 ('storage_provider','supabase'),('storage_bucket','course-content')
ON CONFLICT(key) DO NOTHING;
INSERT INTO storage.buckets(id,name,public,file_size_limit)
VALUES('course-content','course-content',false,47185920)
ON CONFLICT(id) DO NOTHING;
DROP POLICY IF EXISTS "KKCC notes admin upload" ON storage.objects;
CREATE POLICY "KKCC notes admin upload" ON storage.objects FOR INSERT TO authenticated
 WITH CHECK(bucket_id='course-content' AND public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "KKCC notes admin update" ON storage.objects;
CREATE POLICY "KKCC notes admin update" ON storage.objects FOR UPDATE TO authenticated
 USING(bucket_id='course-content' AND public.has_role(auth.uid(),'admin'))
 WITH CHECK(bucket_id='course-content' AND public.has_role(auth.uid(),'admin'));
NOTIFY pgrst,'reload schema';
COMMIT;
-- Existing file/S3 project-content documents are not in legacy SQL tables and
-- are not copied by this SQL. Export/back up and import them separately if used.
-- One-time test-builder fix: published tests/questions in Supabase, template BANK stays in source.
-- Back up first. Additive migration; no student records or old CMS rows deleted.
BEGIN;
CREATE TABLE IF NOT EXISTS public.kkcc_tests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), course_id uuid, lecture_id uuid,
 title text NOT NULL DEFAULT '', instructions text NOT NULL DEFAULT '', subject text NOT NULL DEFAULT '',
 duration_minutes integer DEFAULT 30, question_timer_seconds integer DEFAULT 0, timer_mode text DEFAULT 'test',
 questions_count integer DEFAULT 0, total_marks numeric DEFAULT 0, is_published boolean DEFAULT false, sort_order integer DEFAULT 0,
 exam_track text DEFAULT '', level text DEFAULT 'Mixed', series_name text DEFAULT '',
 is_paid boolean DEFAULT false, price_inr integer DEFAULT 0, price_coins integer DEFAULT 0,
 question_source text DEFAULT 'manual', generation_exam text DEFAULT 'All Exams', generation_subject text DEFAULT '',
 generation_topic text DEFAULT 'Mixed', generation_difficulty text DEFAULT 'Mixed', generation_count integer DEFAULT 0,
 generation_marks numeric DEFAULT 1, generation_negative_marks numeric DEFAULT 0,
 syllabus_subject text DEFAULT '', syllabus_chapter text DEFAULT '', syllabus_topic text DEFAULT '',
 easy_request_hash text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_test_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), test_id uuid NOT NULL REFERENCES public.kkcc_tests(id) ON DELETE CASCADE,
 question_text text NOT NULL, subject text DEFAULT '', options text[] NOT NULL, correct_index integer NOT NULL,
 marks numeric DEFAULT 1, negative_marks numeric DEFAULT 0, explanation text DEFAULT '', sort_order integer DEFAULT 0,
 created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kkcc_test_questions_order ON public.kkcc_test_questions(test_id,sort_order);
ALTER TABLE public.kkcc_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_test_questions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_tests,public.kkcc_test_questions FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_tests,public.kkcc_test_questions TO service_role;
-- Copy legacy rows using shared columns; do not replace newer managed edits.
DO $$ DECLARE src text; dst text; cols text; BEGIN
 FOREACH src IN ARRAY ARRAY['tests','test_questions'] LOOP
  dst := 'kkcc_' || src;
  IF to_regclass('public.' || src) IS NOT NULL THEN
   SELECT string_agg(format('%I',s.column_name),',' ORDER BY s.ordinal_position) INTO cols
   FROM information_schema.columns s JOIN information_schema.columns d ON d.column_name=s.column_name
   WHERE s.table_schema='public' AND s.table_name=src AND d.table_schema='public' AND d.table_name=dst;
   EXECUTE format('INSERT INTO public.%I (%s) SELECT %s FROM public.%I ON CONFLICT(id) DO NOTHING',dst,cols,cols,src);
  END IF;
 END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.kkcc_refresh_test_counts() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE tid uuid; BEGIN
 tid := CASE WHEN TG_OP='DELETE' THEN OLD.test_id ELSE NEW.test_id END;
 UPDATE public.kkcc_tests SET questions_count=(SELECT count(*) FROM public.kkcc_test_questions WHERE test_id=tid),
 total_marks=coalesce((SELECT sum(marks) FROM public.kkcc_test_questions WHERE test_id=tid),0),updated_at=now()
 WHERE id=tid AND question_source='manual';
 RETURN NULL; END $$;
DROP TRIGGER IF EXISTS kkcc_refresh_test_counts ON public.kkcc_test_questions;
CREATE TRIGGER kkcc_refresh_test_counts AFTER INSERT OR UPDATE OR DELETE ON public.kkcc_test_questions FOR EACH ROW EXECUTE FUNCTION public.kkcc_refresh_test_counts();
REVOKE ALL ON FUNCTION public.kkcc_refresh_test_counts() FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.publish_easy_text_test(p_actor uuid,p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tid uuid; q jsonb; n integer; pos integer:=0; fingerprint text; old_hash text; BEGIN
 IF auth.role()<>'service_role' OR NOT public.has_role(p_actor,'admin') THEN RAISE EXCEPTION 'Admin server only'; END IF;
 tid := (p_payload->>'id')::uuid;
 IF tid IS NULL OR jsonb_typeof(p_payload->'questions') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid questions'; END IF;
 n:=jsonb_array_length(p_payload->'questions');
 IF n NOT BETWEEN 1 AND 200 OR coalesce(length(trim(p_payload->>'subject')),0)=0 OR coalesce(length(trim(p_payload->>'chapter')),0)=0 OR coalesce(length(trim(p_payload->>'title')),0)<2 OR (p_payload->>'duration_minutes')::integer NOT BETWEEN 1 AND 300 THEN RAISE EXCEPTION 'Invalid test details'; END IF;
 fingerprint:=md5(p_payload::text);
 PERFORM pg_advisory_xact_lock(hashtext(tid::text));
 SELECT easy_request_hash INTO old_hash FROM public.kkcc_tests WHERE id=tid;
 IF FOUND THEN
   IF old_hash IS DISTINCT FROM fingerprint THEN RAISE EXCEPTION 'Test already saved with different content. Open it in Advanced to edit.'; END IF;
   RETURN jsonb_build_object('id',tid,'count',n);
 END IF;
 INSERT INTO public.kkcc_tests(id,title,instructions,subject,duration_minutes,syllabus_subject,syllabus_chapter,series_name,easy_request_hash,is_published,question_source)
 VALUES(tid,p_payload->>'title','Answer every question. 1 mark each; no negative marking.',p_payload->>'subject',(p_payload->>'duration_minutes')::integer,p_payload->>'subject',p_payload->>'chapter',coalesce(p_payload->>'series_name',''),fingerprint,false,'manual');
 FOR q IN SELECT value FROM jsonb_array_elements(p_payload->'questions') LOOP
  IF coalesce(length(trim(q->>'question_text')),0)<3 OR jsonb_typeof(q->'options') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid question'; END IF;
  IF jsonb_array_length(q->'options') NOT BETWEEN 2 AND 4 OR q->>'correct_index' IS NULL OR (q->>'correct_index')::integer NOT BETWEEN 0 AND jsonb_array_length(q->'options')-1 THEN RAISE EXCEPTION 'Invalid answer/options'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(q->'options') v WHERE jsonb_typeof(v)<>'string' OR length(trim(v#>>'{}'))=0) OR (SELECT count(DISTINCT lower(trim(value))) FROM jsonb_array_elements_text(q->'options'))<>jsonb_array_length(q->'options') THEN RAISE EXCEPTION 'Empty/duplicate options'; END IF;
  INSERT INTO public.kkcc_test_questions(test_id,question_text,subject,options,correct_index,marks,negative_marks,explanation,sort_order)
  VALUES(tid,q->>'question_text',p_payload->>'subject',ARRAY(SELECT jsonb_array_elements_text(q->'options')),(q->>'correct_index')::integer,1,0,coalesce(q->>'explanation',''),pos);
  pos:=pos+1;
 END LOOP;
 UPDATE public.kkcc_tests SET is_published=true WHERE id=tid;
 RETURN jsonb_build_object('id',tid,'count',n);
END $$;
REVOKE ALL ON FUNCTION public.publish_easy_text_test(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.publish_easy_text_test(uuid,jsonb) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;

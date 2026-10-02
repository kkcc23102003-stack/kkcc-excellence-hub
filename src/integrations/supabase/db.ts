import type { Json } from "./types";

export type AppRole = "admin" | "user";

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  class_level: string;
  subject: string;
  faculty: string;
  course_type: string;
  thumbnail_url: string | null;
  hue: number;
  summary: string;
  description: string;
  outcomes: string[];
  price: number;
  coin_price: number;
  original_price: number;
  discount_percent: number;
  duration_hours: number;
  lectures_count: number;
  tests_count: number;
  materials_count: number;
  rating: number;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type LectureRow = {
  id: string;
  course_id: string;
  module_title: string;
  title: string;
  description: string;
  video_url: string | null;
  duration: string;
  is_free: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MaterialRow = {
  id: string;
  course_id: string | null;
  lecture_id: string | null;
  title: string;
  material_type: string;
  subject: string;
  chapter: string;
  class_level: string;
  pages: number;
  file_url: string | null;
  is_published: boolean;
  sort_order: number;
  description: string;
  thumbnail_url: string | null;
  module_title: string;
  batch: string;
  access_type: "course" | "free" | "paid";
  price: number;
  coin_price: number;
  created_at: string;
  updated_at: string;
};

export type TestRow = {
  id: string;
  course_id: string | null;
  lecture_id: string | null;
  title: string;
  instructions: string;
  subject: string;
  duration_minutes: number;
  question_timer_seconds: number;
  timer_mode: "test" | "question" | "unlimited";
  questions_count: number;
  total_marks: number;
  is_published: boolean;
  sort_order: number;
  /** Which exam this test is oriented for, shown on the test card. */
  exam_track: string;
  /** Easy, Moderate, Difficult or Mixed. Drives the three-level ladder. */
  level: "Easy" | "Moderate" | "Difficult" | "Mixed";
  /** Groups tests that belong to the same paid series. */
  series_name: string;
  is_paid: boolean;
  price_inr: number;
  price_coins: number;
  question_source: "manual" | "deterministic";
  generation_exam: string;
  generation_subject: string;
  generation_topic: string;
  generation_difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  generation_count: number;
  generation_marks?: number;
  generation_negative_marks?: number;
  created_at: string;
  updated_at: string;
};

/**
 * A manual unlock for a paid test, recorded when a student pays offline.
 * Only an admin can create one; a student can only read their own.
 */
/** Admin overrides layered on the code-defined test series catalogue. */
/** Access to a whole code-defined test series, keyed by its catalogue id. */
export type VoucherTypeRow = {
  id: string;
  label: string;
  value_inr: number;
  daily_quota: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type VoucherClaimRow = {
  id: string;
  voucher_type: string;
  user_id: string;
  claim_day: string;
  status: string;
  code: string;
  admin_note: string;
  created_at: string;
  fulfilled_at: string | null;
};

export type SeriesAccessGrantRow = {
  id: string;
  series_id: string;
  user_id: string;
  granted_by: string | null;
  method: string;
  amount_inr: number;
  note: string;
  /** When the access lapses. Null means lifetime. */
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type TestSeriesOverrideRow = {
  series_id: string;
  enabled: boolean;
  name: string | null;
  summary: string | null;
  price_inr: number | null;
  price_coins: number | null;
  sort_order: number | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TestAccessGrantRow = {
  id: string;
  test_id: string;
  user_id: string;
  granted_by: string | null;
  /** How the student paid, e.g. cash, upi, bank transfer, scholarship. */
  method: string;
  /** What was collected, in rupees. Zero for a goodwill or free grant. */
  amount_inr: number;
  /** Receipt number or any context the front desk wants to keep. */
  note: string;
  created_at: string;
  /** Set instead of deleting, so the history survives. */
  revoked_at: string | null;
  /** When the access lapses. Null means lifetime. */
  expires_at: string | null;
};

export type TestQuestionRow = {
  id: string;
  test_id: string;
  question_text: string;
  subject: string;
  options: string[];
  correct_index: number;
  marks: number;
  negative_marks: number;
  explanation: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
};

export type PrivateSettingRow = {
  key: string;
  value: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  mobile: string;
  class_level: string;
  target_exam: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type StudentBlockRow = {
  id: string;
  user_id: string;
  is_active: boolean;
  reason: string;
  blocked_by: string | null;
  blocked_at: string;
  unblocked_by: string | null;
  unblocked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CoinPackageRow = {
  id: string;
  title: string;
  coins: number;
  bonus_coins: number;
  price: number;
  currency: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CoinTransactionRow = {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  reason: string;
  related_type: string;
  related_id: string | null;
  metadata: Json;
  created_by: string | null;
  created_at: string;
};

export type MaterialPurchaseRow = {
  id: string;
  user_id: string;
  material_id: string;
  paid_coins: number;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseEnrollmentRow = {
  id: string;
  user_id: string;
  course_id: string;
  status: "active" | "revoked" | "expired";
  source: "free" | "manual" | "offline" | "razorpay" | "admin" | "coupon" | "23kaat";
  payment_method: string;
  amount_paid: number;
  currency: string;
  admin_note: string;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type OfflineAccessGrantRow = {
  id: string;
  email: string;
  full_name: string;
  course_id: string;
  status: "pending" | "activated" | "revoked";
  amount_paid: number;
  currency: string;
  payment_method: string;
  admin_note: string;
  expires_at: string | null;
  activated_user_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FileRow = {
  id: string;
  provider: string;
  bucket: string;
  path: string;
  public_url: string;
  original_url: string;
  mime_type: string;
  size_bytes: number;
  linked_table: string;
  linked_id: string | null;
  migration_status: string;
  metadata: Json;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentTransactionRow = {
  id: string;
  user_id: string | null;
  course_id: string | null;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  provider_order_id: string;
  provider_payment_id: string;
  admin_note: string;
  metadata: Json;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CouponCodeRow = {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  per_user_limit: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  applies_to_course_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CouponRedemptionRow = {
  id: string;
  coupon_id: string;
  user_id: string;
  course_id: string;
  discount_percent: number;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  title: string;
  message: string;
  type: string;
  audience: "all" | "students" | "admins" | "course" | "user";
  course_id: string | null;
  target_user_id: string | null;
  priority: "low" | "normal" | "high";
  action_label: string;
  action_url: string;
  is_published: boolean;
  send_at: string | null;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationReadRow = {
  id: string;
  notification_id: string;
  user_id: string;
  read_at: string;
};

export type StudentDoubtRow = {
  id: string;
  user_id: string;
  course_id: string | null;
  subject: string;
  title: string;
  message: string;
  attachment_url: string;
  status: "open" | "answered" | "closed";
  priority: "low" | "normal" | "high";
  admin_reply: string;
  answered_by: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdmissionEnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  class_level: string;
  interest: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "admitted" | "closed" | "spam";
  priority: "low" | "normal" | "high";
  admin_note: string;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Only student participation metadata. No prompts, options or answer keys. */
export type LearningAttemptRow = {
  id: string;
  user_id: string;
  test_id: string | null;
  series_id: string | null;
  duration_seconds: number;
  question_timer_seconds: number;
  status: string;
  question_count: number;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  total_marks: number | null;
  correct_count: number | null;
  attempted_count: number | null;
  answers: Json;
  answer_revision: number;
  source_refs: string[];
};

export type LearningAttemptView = LearningAttemptRow & {
  exam: string;
  subject: string;
  chapter: string;
};

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type WithGeneratedDefaults<T extends { id?: string; created_at?: string; updated_at?: string }> =
  Partial<T>;

export type DB = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      learning_attempts: TableDefinition<
        LearningAttemptRow,
        Partial<LearningAttemptRow>,
        Partial<LearningAttemptRow>
      >;
      courses: TableDefinition<CourseRow, WithGeneratedDefaults<CourseRow>, Partial<CourseRow>>;
      lectures: TableDefinition<LectureRow, WithGeneratedDefaults<LectureRow>, Partial<LectureRow>>;
      materials: TableDefinition<
        MaterialRow,
        WithGeneratedDefaults<MaterialRow>,
        Partial<MaterialRow>
      >;
      tests: TableDefinition<TestRow, WithGeneratedDefaults<TestRow>, Partial<TestRow>>;
      test_access_grants: TableDefinition<
        TestAccessGrantRow,
        WithGeneratedDefaults<TestAccessGrantRow>,
        Partial<TestAccessGrantRow>
      >;
      voucher_types: TableDefinition<
        VoucherTypeRow,
        WithGeneratedDefaults<VoucherTypeRow>,
        Partial<VoucherTypeRow>
      >;
      voucher_claims: TableDefinition<
        VoucherClaimRow,
        WithGeneratedDefaults<VoucherClaimRow>,
        Partial<VoucherClaimRow>
      >;
      series_access_grants: TableDefinition<
        SeriesAccessGrantRow,
        WithGeneratedDefaults<SeriesAccessGrantRow>,
        Partial<SeriesAccessGrantRow>
      >;
      test_series_overrides: TableDefinition<
        TestSeriesOverrideRow,
        WithGeneratedDefaults<TestSeriesOverrideRow>,
        Partial<TestSeriesOverrideRow>
      >;
      test_questions: TableDefinition<
        TestQuestionRow,
        WithGeneratedDefaults<TestQuestionRow>,
        Partial<TestQuestionRow>
      >;
      site_settings: TableDefinition<
        SiteSettingRow,
        Partial<SiteSettingRow> & Pick<SiteSettingRow, "key">,
        Partial<SiteSettingRow>
      >;
      private_settings: TableDefinition<
        PrivateSettingRow,
        Omit<PrivateSettingRow, "created_at" | "updated_at" | "updated_by"> & {
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<PrivateSettingRow>
      >;
      profiles: TableDefinition<
        ProfileRow,
        Omit<ProfileRow, "created_at" | "updated_at" | "avatar_url" | "email"> & {
          email?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<ProfileRow>
      >;
      user_roles: TableDefinition<
        UserRoleRow,
        Omit<UserRoleRow, "id" | "created_at"> & { id?: string; created_at?: string },
        Partial<UserRoleRow>
      >;
      student_blocks: TableDefinition<
        StudentBlockRow,
        Omit<StudentBlockRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<StudentBlockRow>
      >;
      coin_packages: TableDefinition<
        CoinPackageRow,
        WithGeneratedDefaults<CoinPackageRow>,
        Partial<CoinPackageRow>
      >;
      coin_transactions: TableDefinition<
        CoinTransactionRow,
        WithGeneratedDefaults<CoinTransactionRow>,
        Partial<CoinTransactionRow>
      >;
      material_purchases: TableDefinition<
        MaterialPurchaseRow,
        WithGeneratedDefaults<MaterialPurchaseRow>,
        Partial<MaterialPurchaseRow>
      >;
      course_enrollments: TableDefinition<
        CourseEnrollmentRow,
        WithGeneratedDefaults<CourseEnrollmentRow>,
        Partial<CourseEnrollmentRow>
      >;
      offline_access_grants: TableDefinition<
        OfflineAccessGrantRow,
        WithGeneratedDefaults<OfflineAccessGrantRow>,
        Partial<OfflineAccessGrantRow>
      >;
      files: TableDefinition<FileRow, WithGeneratedDefaults<FileRow>, Partial<FileRow>>;
      payment_transactions: TableDefinition<
        PaymentTransactionRow,
        WithGeneratedDefaults<PaymentTransactionRow>,
        Partial<PaymentTransactionRow>
      >;
      coupon_codes: TableDefinition<
        CouponCodeRow,
        WithGeneratedDefaults<CouponCodeRow>,
        Partial<CouponCodeRow>
      >;
      coupon_redemptions: TableDefinition<
        CouponRedemptionRow,
        WithGeneratedDefaults<CouponRedemptionRow>,
        Partial<CouponRedemptionRow>
      >;
      notifications: TableDefinition<
        NotificationRow,
        WithGeneratedDefaults<NotificationRow>,
        Partial<NotificationRow>
      >;
      notification_reads: TableDefinition<
        NotificationReadRow,
        WithGeneratedDefaults<NotificationReadRow>,
        Partial<NotificationReadRow>
      >;
      student_doubts: TableDefinition<
        StudentDoubtRow,
        WithGeneratedDefaults<StudentDoubtRow>,
        Partial<StudentDoubtRow>
      >;
      admission_enquiries: TableDefinition<
        AdmissionEnquiryRow,
        WithGeneratedDefaults<AdmissionEnquiryRow>,
        Partial<AdmissionEnquiryRow>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      save_learning_attempt_answers: {
        Args: { p_actor: string; p_attempt: string; p_answers: Json; p_revision?: number };
        Returns: Json;
      };
      finalize_learning_attempt: {
        Args: {
          p_actor: string;
          p_attempt: string;
          p_answers: Json;
          p_expected_saved_answers: Json;
          p_fresh_result: Json;
          p_saved_result: Json;
        };
        Returns: Json;
      };
      claim_reward_voucher: { Args: { p_type: string; p_earned: number }; Returns: Json };
      get_public_student_stats: { Args: Record<string, never>; Returns: Json };
      admin_grant_learning_access: {
        Args: {
          p_kind: string;
          p_key: string;
          p_user_id: string;
          p_method: string;
          p_amount: number;
          p_note: string;
          p_expires_at: string | null;
          p_coin_bonus?: number;
        };
        Returns: Json;
      };
      purchase_learning_item: {
        Args: { p_actor: string; p_kind: string; p_key: string; p_price: number };
        Returns: Json;
      };
      redeem_project_course_coupon: {
        Args: { p_actor: string; p_code: string; p_course_id: string; p_original_amount: number };
        Returns: Json;
      };

      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
      has_test_access: {
        Args: { p_test_id: string };
        Returns: boolean;
      };
      voucher_remaining_today: {
        Args: { p_type: string };
        Returns: number;
      };
      voucher_claim_day: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_user_blocked: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      get_my_block_status: {
        Args: Record<PropertyKey, never>;
        Returns: { is_blocked: boolean; reason: string; blocked_at: string | null }[];
      };
      get_23kaat_balance: {
        Args: { _user_id: string };
        Returns: number;
      };
      grant_23kaat_to_user: {
        Args: {
          _user_id: string;
          _amount: number;
          _reason?: string;
          _related_type?: string;
          _related_id?: string | null;
        };
        Returns: Json;
      };
      spend_23kaat_for_course: {
        Args: { _course_id: string };
        Returns: Json;
      };
      get_my_material_access_url: {
        Args: { _material_id: string };
        Returns: Json;
      };
      spend_23kaat_for_material: {
        Args: { _material_id: string };
        Returns: Json;
      };
      claim_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      redeem_coupon_for_course: {
        Args: { _code: string; _course_id: string };
        Returns: Json;
      };
      get_public_platform_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          students_joined: number;
          active_students: number;
          published_courses: number;
          published_lectures: number;
          published_materials: number;
          published_tests: number;
        }[];
      };
      can_access_my_course: {
        Args: { _course_id: string };
        Returns: boolean;
      };
      has_my_material_purchase: {
        Args: { _material_id: string };
        Returns: boolean;
      };
      list_public_materials: {
        Args: { _course_id: string | null };
        Returns: MaterialRow[];
      };
      get_kkcc_admin_system_health: {
        Args: Record<PropertyKey, never>;
        Returns: {
          area: string;
          label: string;
          value: string;
        }[];
      };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type TableRow<T extends keyof DB["public"]["Tables"]> = DB["public"]["Tables"][T]["Row"];
export type TableInsert<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Update"];

export type { Json };

import { projectContent } from "@/lib/project-content.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

const WEBSITE_CONTENT_KEY = "website_content_json";

export const CUSTOM_PAGE_KEYS = [
  "home",
  "courses",
  "classes",
  "study_material",
  "test_series",
  "results",
  "support",
  "faculty",
] as const;

export type CustomPageKey = (typeof CUSTOM_PAGE_KEYS)[number];

export const CUSTOM_PAGE_LABELS: Record<CustomPageKey, string> = {
  home: "Home page",
  courses: "Courses page",
  classes: "Classes page",
  study_material: "Study material page",
  test_series: "Test series page",
  results: "Results page",
  support: "Support page",
  faculty: "Faculty page",
};

const footerColumnSchema = z.object({
  title: z.string().trim().max(80),
  links: z
    .array(
      z.object({
        label: z.string().trim().max(80),
        to: z.string().trim().max(160),
      }),
    )
    .max(8),
});

const pageHeaderSchema = z.object({
  eyebrow: z.string().trim().max(120),
  title: z.string().trim().max(180),
  description: z.string().trim().max(700),
});

const pillarSchema = z.object({
  label: z.string().trim().max(60),
  sub: z.string().trim().max(120),
});

const contactSchema = z.object({
  label: z.string().trim().max(80),
  value: z.string().trim().max(180),
});

const customBlockSchema = z.object({
  id: z.string().trim().min(1).max(80),
  page: z.enum(CUSTOM_PAGE_KEYS),
  position: z.enum(["top", "bottom"]).default("bottom"),
  style: z.enum(["card", "banner", "notice"]).default("card"),
  enabled: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(999).default(0),
  eyebrow: z.string().trim().max(120).default(""),
  title: z.string().trim().max(180).default(""),
  description: z.string().trim().max(700).default(""),
  body: z.string().trim().max(1200).default(""),
  button_label: z.string().trim().max(80).default(""),
  button_to: z.string().trim().max(500).default(""),
  image_url: z.string().trim().max(500).default(""),
});

const websiteContentSchema = z.object({
  nav: z.object({
    home: z.string().trim().max(60),
    courses: z.string().trim().max(60),
    classes: z.string().trim().max(60),
    test_series: z.string().trim().max(60),
    study_material: z.string().trim().max(60),
    faculty: z.string().trim().max(60),
    results: z.string().trim().max(60),
    support: z.string().trim().max(60),
    login: z.string().trim().max(60),
    signup: z.string().trim().max(60),
    dashboard: z.string().trim().max(60),
    admin: z.string().trim().max(60),
  }),
  home: z.object({
    pillars: z.array(pillarSchema).length(4),
    course_eyebrow: z.string().trim().max(120),
    course_title: z.string().trim().max(180),
    course_description: z.string().trim().max(500),
    course_search_placeholder: z.string().trim().max(120),
    course_empty_title: z.string().trim().max(120),
    course_empty_description: z.string().trim().max(240),
    view_all_courses_label: z.string().trim().max(80),
    faculty_eyebrow: z.string().trim().max(120),
    faculty_title: z.string().trim().max(180),
    all_faculty_label: z.string().trim().max(80),
  }),
  page_headers: z.object({
    courses: pageHeaderSchema,
    classes: pageHeaderSchema,
    study_material: pageHeaderSchema,
    test_series: pageHeaderSchema,
    results: pageHeaderSchema,
    support: pageHeaderSchema,
    faculty: pageHeaderSchema.default({
      eyebrow: "Faculty",
      title: "The people behind every KKCC lecture",
      description:
        "Teaching details are curated by KKCC and updated as verified faculty information is published.",
    }),
  }),
  footer: z.object({
    columns: z.array(footerColumnSchema).length(3),
  }),
  support: z.object({
    form_title: z.string().trim().max(120),
    submit_label: z.string().trim().max(80),
    faq_title: z.string().trim().max(120),
    message_success_title: z.string().trim().max(120),
    message_success_description: z.string().trim().max(240),
    contacts: z.array(contactSchema).length(3),
  }),
  test_series: z.object({
    available_tests_title: z.string().trim().max(120),
    instructions_title: z.string().trim().max(120),
    empty_tests_text: z.string().trim().max(240),
    rules: z.array(z.string().trim().max(220)).min(1).max(8),
    note: z.string().trim().max(500),
    start_test_label: z.string().trim().max(80),
  }),
  results: z.object({
    quote: z.string().trim().max(500),
    quote_by: z.string().trim().max(120),
  }),
  custom_blocks: z.array(customBlockSchema).max(80).default([]),
});

export type WebsiteContentSettings = z.infer<typeof websiteContentSchema>;

export const DEFAULT_WEBSITE_CONTENT: WebsiteContentSettings = {
  nav: {
    home: "Home",
    courses: "Courses",
    classes: "Classes",
    test_series: "Test Series",
    study_material: "Study Material",
    faculty: "Faculty",
    results: "Results",
    support: "Support",
    login: "Login",
    signup: "Get Started",
    dashboard: "Dashboard",
    admin: "Admin Panel",
  },
  home: {
    pillars: [
      { label: "Watch", sub: "Concepts that click" },
      { label: "Practice", sub: "Recall through MCQs" },
      { label: "Revise", sub: "Fast notes refresh" },
      { label: "Grow", sub: "Progress you can see" },
    ],
    course_eyebrow: "Next win starts here",
    course_title: "Choose the Course That Clicks",
    course_description:
      "Pick a path, watch the next lecture, practice immediately, and keep your momentum visible.",
    course_search_placeholder: "Search the next topic to master",
    course_empty_title: "No courses in this stream yet",
    course_empty_description: "Try another stream or clear your search.",
    view_all_courses_label: "View all courses",
    faculty_eyebrow: "Faculty",
    faculty_title: "Guidance that makes concepts click",
    all_faculty_label: "All faculty",
  },
  page_headers: {
    courses: {
      eyebrow: "Next win starts here",
      title: "Choose the Course That Clicks",
      description:
        "Every KKCC course combines focused lectures, smart notes, tests, and visible progress so students always know the next step.",
    },
    classes: {
      eyebrow: "Classes & batches",
      title: "Classes, batches and learning tracks",
      description:
        "Explore verified KKCC batches, courses and schedules. Published learning details update automatically.",
    },
    study_material: {
      eyebrow: "Library",
      title: "Study material",
      description:
        "Notes, formula sheets, question banks and papers organised by subject and chapter.",
    },
    test_series: {
      eyebrow: "Assessment",
      title: "Test series",
      description:
        "Timed chapter tests, sectional practice and full-length mocks with instant analysis.",
    },
    results: {
      eyebrow: "Achievements",
      title: "Results",
      description: "Verified KKCC student results and achievement updates will appear here.",
    },
    support: {
      eyebrow: "Help",
      title: "Support & contact",
      description:
        "Questions about admissions, batches or the platform? Send a message and the KKCC team will respond.",
    },
    faculty: {
      eyebrow: "Faculty",
      title: "The people behind every KKCC lecture",
      description:
        "Teaching details are curated by KKCC and updated as verified faculty information is published.",
    },
  },
  footer: {
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Home", to: "/" },
          { label: "Courses", to: "/courses" },
          { label: "Classes", to: "/classes" },
          { label: "Faculty", to: "/faculty" },
          { label: "Results", to: "/results" },
        ],
      },
      {
        title: "Student",
        links: [
          { label: "Login", to: "/login" },
          { label: "My Courses", to: "/dashboard/courses" },
          { label: "Tests", to: "/test-series" },
          { label: "Study Material", to: "/study-material" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", to: "/support" },
          { label: "FAQs", to: "/support" },
          { label: "Contact", to: "/support" },
        ],
      },
    ],
  },
  support: {
    form_title: "Send a message",
    submit_label: "Send message",
    faq_title: "Frequently asked questions",
    message_success_title: "Message captured",
    message_success_description:
      "Your enquiry has been received. The KKCC support team will follow up with you.",
    contacts: [
      { label: "Phone / WhatsApp", value: "Use the enquiry form for confirmed details" },
      { label: "Email", value: "Available through the enquiry form" },
      { label: "Centre", value: "KKCC Centre, Ludhiana, Punjab" },
    ],
  },
  test_series: {
    available_tests_title: "Available tests",
    instructions_title: "Instructions",
    empty_tests_text: "No tests published yet.",
    rules: [
      "Each test is timed; the timer starts as soon as you begin.",
      "Use the question palette to move between questions and flag items for review.",
      "Marks are awarded per the scheme shown on each test card, with negative marking.",
      "Your attempt is scored instantly and shown with a subject-wise breakdown.",
    ],
    note: "Only verified KKCC tests appear here. If a scheduled test is not visible yet, please check again later or contact support.",
    start_test_label: "Start test",
  },
  results: {
    quote:
      "Results at KKCC come from consistency: concept-first teaching, regular testing and honest feedback to every student and parent.",
    quote_by: "Kusum Kartik Coaching Centre",
  },
  custom_blocks: [],
};

function publicClient() {
  return projectContent as unknown as SupabaseClient<Database>;
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function parseWebsiteContent(value: string | null | undefined): WebsiteContentSettings {
  if (!value) return DEFAULT_WEBSITE_CONTENT;
  try {
    const parsed = JSON.parse(value);
    return websiteContentSchema.parse(parsed);
  } catch (error) {
    console.warn("[website-content] invalid saved content; falling back to defaults", error);
    return DEFAULT_WEBSITE_CONTENT;
  }
}

async function readWebsiteContent(supabase: SupabaseClient<Database>) {
  const { data, error } = await projectContent
    .from("site_settings")
    .select("key, value")
    .eq("key", WEBSITE_CONTENT_KEY)
    .maybeSingle();
  if (error) {
    console.warn("[website-content] read failed; falling back to defaults", error.message);
    return DEFAULT_WEBSITE_CONTENT;
  }
  return parseWebsiteContent(data?.value);
}

export const getPublicWebsiteContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = publicClient();
    if (!supabase) return DEFAULT_WEBSITE_CONTENT;
    return await readWebsiteContent(supabase);
  } catch (error) {
    console.warn("[website-content] public read failed", error);
    return DEFAULT_WEBSITE_CONTENT;
  }
});

export const getAdminWebsiteContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return readWebsiteContent(context.supabase);
  });

export const saveAdminWebsiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => websiteContentSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("site_settings").upsert(
      {
        key: WEBSITE_CONTENT_KEY,
        value: JSON.stringify(data),
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "key" },
    );
    if (error) throw new Error(error.message);
    return data;
  });

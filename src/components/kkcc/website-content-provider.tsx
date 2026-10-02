import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_WEBSITE_CONTENT,
  getPublicWebsiteContent,
  type WebsiteContentSettings,
} from "@/lib/website-content.functions";

const WebsiteContentContext = createContext<WebsiteContentSettings>(DEFAULT_WEBSITE_CONTENT);
const WEBSITE_CONTENT_CACHE_KEY = "kkcc-public-website-content-v2-comeback";

function mergeWebsiteContent(value: Partial<WebsiteContentSettings>): WebsiteContentSettings {
  return {
    ...DEFAULT_WEBSITE_CONTENT,
    ...value,
    nav: { ...DEFAULT_WEBSITE_CONTENT.nav, ...value.nav },
    home: { ...DEFAULT_WEBSITE_CONTENT.home, ...value.home },
    page_headers: {
      ...DEFAULT_WEBSITE_CONTENT.page_headers,
      ...value.page_headers,
      courses: { ...DEFAULT_WEBSITE_CONTENT.page_headers.courses, ...value.page_headers?.courses },
      classes: { ...DEFAULT_WEBSITE_CONTENT.page_headers.classes, ...value.page_headers?.classes },
      study_material: {
        ...DEFAULT_WEBSITE_CONTENT.page_headers.study_material,
        ...value.page_headers?.study_material,
      },
      test_series: {
        ...DEFAULT_WEBSITE_CONTENT.page_headers.test_series,
        ...value.page_headers?.test_series,
      },
      results: { ...DEFAULT_WEBSITE_CONTENT.page_headers.results, ...value.page_headers?.results },
      support: { ...DEFAULT_WEBSITE_CONTENT.page_headers.support, ...value.page_headers?.support },
      faculty: { ...DEFAULT_WEBSITE_CONTENT.page_headers.faculty, ...value.page_headers?.faculty },
    },
    footer: { ...DEFAULT_WEBSITE_CONTENT.footer, ...value.footer },
    support: { ...DEFAULT_WEBSITE_CONTENT.support, ...value.support },
    test_series: { ...DEFAULT_WEBSITE_CONTENT.test_series, ...value.test_series },
    results: { ...DEFAULT_WEBSITE_CONTENT.results, ...value.results },
    custom_blocks: value.custom_blocks ?? DEFAULT_WEBSITE_CONTENT.custom_blocks,
  };
}

function normaliseComebackCopy(content: WebsiteContentSettings): WebsiteContentSettings {
  const home = { ...content.home };

  if (home.pillars[0]?.label === "Learn" && home.pillars[0]?.sub === "Video lectures") {
    home.pillars = [
      { label: "Watch", sub: "Concepts that click" },
      { label: "Practice", sub: "Recall through MCQs" },
      { label: "Revise", sub: "Fast notes refresh" },
      { label: "Grow", sub: "Progress you can see" },
    ];
  }

  if (home.course_eyebrow === "Course discovery") home.course_eyebrow = "Next win starts here";
  if (home.course_title === "Find the Right Learning Path") {
    home.course_title = "Choose the Course That Clicks";
  }
  if (
    home.course_description ===
    "Browse by stream, then refine by class, subject, faculty and course type."
  ) {
    home.course_description =
      "Pick a path, watch the next lecture, practice immediately, and keep your momentum visible.";
  }
  if (home.course_search_placeholder === "What do you want to learn?") {
    home.course_search_placeholder = "Search the next topic to master";
  }
  if (home.faculty_title === "Taught by people who teach for clarity") {
    home.faculty_title = "Guidance that makes concepts click";
  }

  const pageHeaders = {
    ...content.page_headers,
    courses: { ...content.page_headers.courses },
    classes: { ...content.page_headers.classes },
    results: { ...content.page_headers.results },
    faculty: { ...content.page_headers.faculty },
  };

  if (pageHeaders.courses.eyebrow === "Course discovery") {
    pageHeaders.courses.eyebrow = "Next win starts here";
  }
  if (pageHeaders.courses.title === "Find the Right Learning Path") {
    pageHeaders.courses.title = "Choose the Course That Clicks";
  }
  if (
    pageHeaders.classes.title === "Offline and online batches" ||
    pageHeaders.classes.title === "Admin-published classes and courses"
  ) {
    pageHeaders.classes.title = "Classes, batches and learning tracks";
  }
  if (
    pageHeaders.classes.description ===
      "Choose from focused batches for school, entrance and competitive exam preparation." ||
    pageHeaders.classes.description ===
      "Explore real KKCC batches/courses as they are published from the admin panel. Only admin-published details are shown."
  ) {
    pageHeaders.classes.description =
      "Explore verified KKCC batches, courses and schedules. Published learning details update automatically.";
  }
  if (
    pageHeaders.results.description ===
    "Verified student results will be published here after KKCC admin adds them."
  ) {
    pageHeaders.results.description =
      "Verified KKCC student results and achievement updates will appear here.";
  }
  if (
    pageHeaders.faculty.description ===
    "Faculty details shown here are KKCC-managed and can be updated from the admin panel as verified information is published."
  ) {
    pageHeaders.faculty.description =
      "Teaching details are curated by KKCC and updated as verified faculty information is published.";
  }

  const testSeries = { ...content.test_series };
  if (
    testSeries.note ===
    "Only tests published by KKCC admin appear here. If no test is visible, please check again later or contact support."
  ) {
    testSeries.note =
      "Only verified KKCC tests appear here. If a scheduled test is not visible yet, please check again later or contact support.";
  }

  const support = { ...content.support };
  if (
    support.message_success_description ===
      "Connect an email or database backend to receive enquiries." ||
    support.message_success_description === "Your enquiry has been saved for KKCC admin follow-up."
  ) {
    support.message_success_description =
      "Your enquiry has been received. The KKCC support team will follow up with you.";
  }
  support.contacts = support.contacts.map((contact) => {
    if (
      contact.value === "Contact number to be added" ||
      contact.value === "Use the enquiry form for now"
    ) {
      return {
        ...contact,
        label: "Phone / WhatsApp",
        value: "Use the enquiry form for confirmed details",
      };
    }
    if (
      contact.value === "Email address to be added" ||
      contact.value === "KKCC admin can add the public email here"
    ) {
      return { ...contact, value: "Available through the enquiry form" };
    }
    if (
      contact.value === "Centre address to be added" ||
      contact.value === "KKCC admin can add the centre address here"
    ) {
      return { ...contact, value: "KKCC Centre, Ludhiana, Punjab" };
    }
    return contact;
  }) as typeof support.contacts;

  return { ...content, home, page_headers: pageHeaders, test_series: testSeries, support };
}

function readCachedContent(): WebsiteContentSettings | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(WEBSITE_CONTENT_CACHE_KEY);
    return raw
      ? normaliseComebackCopy(
          mergeWebsiteContent(JSON.parse(raw) as Partial<WebsiteContentSettings>),
        )
      : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedContent(content: WebsiteContentSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WEBSITE_CONTENT_CACHE_KEY, JSON.stringify(content));
  } catch {
    // Ignore localStorage failures; defaults keep the app usable.
  }
}

export function WebsiteContentProvider({ children }: { children: ReactNode }) {
  const [cachedContent] = useState(readCachedContent);
  const loadContent = useServerFn(getPublicWebsiteContent);
  const { data } = useQuery({
    queryKey: ["public-website-content"],
    queryFn: () => loadContent(),
    placeholderData: cachedContent ?? DEFAULT_WEBSITE_CONTENT,
    staleTime: 10 * 60 * 1000,
  });

  const content = normaliseComebackCopy(data ?? cachedContent ?? DEFAULT_WEBSITE_CONTENT);

  useEffect(() => {
    writeCachedContent(content);
  }, [content]);

  return (
    <WebsiteContentContext.Provider value={content}>{children}</WebsiteContentContext.Provider>
  );
}

export function useWebsiteContent() {
  return useContext(WebsiteContentContext);
}

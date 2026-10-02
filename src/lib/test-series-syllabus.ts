/** Editable test-series syllabi, with every generated test tied to a verified bank tag. */
import { ALL_TEMPLATES, countMatching } from "@/lib/exam-bank";

export type SyllabusTopic = { name: string; bank_topic: string };
export type SyllabusChapter = { name: string; topics: SyllabusTopic[] };
export type SyllabusSubject = {
  name: string;
  bank_subject: string;
  chapters: SyllabusChapter[];
};
export type TestSeriesSyllabus = { subjects: SyllabusSubject[] };
export type TestSeriesSyllabusStatus = "draft" | "published";

export type TestSeriesSyllabusRow = {
  series_id: string;
  exam_track: string;
  syllabus: TestSeriesSyllabus;
  status: TestSeriesSyllabusStatus;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ParsedSyllabus = { syllabus: TestSeriesSyllabus; errors: string[] };

const cleanLine = (line: string) =>
  line
    .trim()
    .replace(/^[-*•]+\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/^[a-zA-Z][.)]\s*/, "")
    .trim();

/**
 * Paste format: one subject per top-level line, chapters indented two spaces,
 * and topics indented four spaces. Explicit Subject:/Chapter:/Topic: labels
 * are also accepted and make the indentation optional.
 */
export function parseSyllabusOutline(text: string): ParsedSyllabus {
  const subjects: SyllabusSubject[] = [];
  const errors: string[] = [];
  let currentSubject: SyllabusSubject | null = null;
  let currentChapter: SyllabusChapter | null = null;

  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index] ?? "";
    if (!raw.trim() || /^\s*#/.test(raw)) continue;

    const indent = (raw.match(/^[\t ]*/) ?? [""])[0]!.replace(/\t/g, "  ").length;
    const explicit = raw.trim().match(/^(subject|chapter|topic)\s*:\s*(.*)$/i);
    const label = explicit?.[1]?.toLowerCase();
    const name = cleanLine(explicit?.[2] ?? raw.trim());
    if (!name) {
      errors.push(`Line ${index + 1}: add a name after the heading.`);
      continue;
    }

    const level = label ?? (indent >= 4 ? "topic" : indent >= 2 ? "chapter" : "subject");
    if (level === "subject") {
      currentSubject = { name, bank_subject: "", chapters: [] };
      subjects.push(currentSubject);
      currentChapter = null;
      continue;
    }
    if (level === "chapter") {
      if (!currentSubject) {
        errors.push(`Line ${index + 1}: a chapter must follow a subject.`);
        continue;
      }
      currentChapter = { name, topics: [] };
      currentSubject.chapters.push(currentChapter);
      continue;
    }
    if (!currentSubject || !currentChapter) {
      errors.push(`Line ${index + 1}: a topic must be nested under a chapter.`);
      continue;
    }
    currentChapter.topics.push({ name, bank_topic: "" });
  }

  if (!subjects.length) errors.push("Add at least one subject.");
  for (const subject of subjects) {
    if (!subject.chapters.length) errors.push(`${subject.name}: add at least one chapter.`);
    for (const chapter of subject.chapters) {
      if (!chapter.topics.length)
        errors.push(`${subject.name} / ${chapter.name}: add at least one topic.`);
    }
  }
  return { syllabus: { subjects }, errors };
}

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

export function bankSubjectsForExam(exam: string): string[] {
  return [
    ...new Set(
      ALL_TEMPLATES.filter((template) => exam === "All Exams" || template.exams.includes(exam)).map(
        (template) => template.subject,
      ),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

export function bankTopicsForExam(exam: string, subject: string): string[] {
  if (!subject) return [];
  return [
    ...new Set(
      ALL_TEMPLATES.filter(
        (template) =>
          template.subject === subject && (exam === "All Exams" || template.exams.includes(exam)),
      ).map((template) => template.topic),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

/** Match only explicit bank labels; a fuzzy guess could create an out-of-scope paper. */
export function mapSyllabusToBank(syllabus: TestSeriesSyllabus, exam: string): TestSeriesSyllabus {
  const subjects = bankSubjectsForExam(exam);
  return {
    subjects: syllabus.subjects.map((subject) => {
      const bank_subject =
        subjects.find((candidate) => normalize(candidate) === normalize(subject.name)) ??
        (subjects.includes(subject.bank_subject) ? subject.bank_subject : "");
      const topics = bankTopicsForExam(exam, bank_subject);
      return {
        ...subject,
        bank_subject,
        chapters: subject.chapters.map((chapter) => ({
          ...chapter,
          topics: chapter.topics.map((topic) => ({
            ...topic,
            bank_topic:
              topics.find((candidate) => normalize(candidate) === normalize(topic.name)) ??
              (topics.includes(topic.bank_topic) ? topic.bank_topic : ""),
          })),
        })),
      };
    }),
  };
}

export function createBankSyllabus(exam: string, subjects: string[]): TestSeriesSyllabus {
  return {
    subjects: subjects.map((name) => ({
      name,
      bank_subject: name,
      chapters: bankTopicsForExam(exam, name).map((topic) => ({
        name: topic,
        topics: [{ name: topic, bank_topic: topic }],
      })),
    })),
  };
}

export function countSyllabusMatches(syllabus: TestSeriesSyllabus, exam: string) {
  let totalTopics = 0;
  let mappedTopics = 0;
  let questionPositions = 0;
  const missingSubjects: string[] = [];
  const missingTopics: string[] = [];

  for (const subject of syllabus.subjects) {
    if (!subject.bank_subject || !bankSubjectsForExam(exam).includes(subject.bank_subject)) {
      missingSubjects.push(subject.name);
      continue;
    }
    for (const chapter of subject.chapters) {
      for (const topic of chapter.topics) {
        totalTopics += 1;
        if (
          !topic.bank_topic ||
          !bankTopicsForExam(exam, subject.bank_subject).includes(topic.bank_topic)
        ) {
          missingTopics.push(`${subject.name} / ${chapter.name} / ${topic.name}`);
          continue;
        }
        mappedTopics += 1;
        questionPositions += countMatching({
          exam,
          subject: subject.bank_subject,
          topic: topic.bank_topic,
        });
      }
    }
  }
  return { totalTopics, mappedTopics, questionPositions, missingSubjects, missingTopics };
}

/** Keep the saved JSON within the shape expected by readers and SQL. */
export function isTestSeriesSyllabus(value: unknown): value is TestSeriesSyllabus {
  if (!value || typeof value !== "object") return false;
  const subjects = (value as { subjects?: unknown }).subjects;
  return (
    Array.isArray(subjects) &&
    subjects.every(
      (subject) =>
        subject &&
        typeof subject === "object" &&
        typeof (subject as SyllabusSubject).name === "string" &&
        typeof (subject as SyllabusSubject).bank_subject === "string" &&
        Array.isArray((subject as SyllabusSubject).chapters) &&
        (subject as SyllabusSubject).chapters.every(
          (chapter) =>
            chapter &&
            typeof chapter.name === "string" &&
            Array.isArray(chapter.topics) &&
            chapter.topics.every(
              (topic) =>
                topic && typeof topic.name === "string" && typeof topic.bank_topic === "string",
            ),
        ),
    )
  );
}

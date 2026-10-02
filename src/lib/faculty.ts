import type { Course } from "@/lib/cms";
import { slugify } from "@/lib/cms";

export type PublicFacultyProfile = {
  id: string;
  slug: string;
  name: string;
  subjectLabel: string;
  courseCount: number;
  lectureCount: number;
  testCount: number;
  materialCount: number;
  courseIds: string[];
};

function addUnique(values: Set<string>, value: string) {
  const clean = value.trim();
  if (clean) values.add(clean);
}

export function buildFacultyProfiles(courses: Course[]): PublicFacultyProfile[] {
  const bySlug = new Map<
    string,
    PublicFacultyProfile & { subjects: Set<string>; names: Set<string> }
  >();

  courses.forEach((course) => {
    const name = course.faculty.trim();
    if (!name) return;

    const baseSlug = slugify(name) || `faculty-${bySlug.size + 1}`;
    const existing = bySlug.get(baseSlug);
    if (existing) {
      existing.courseCount += 1;
      existing.lectureCount += Number(course.lectures_count || 0);
      existing.testCount += Number(course.tests_count || 0);
      existing.materialCount += Number(course.materials_count || 0);
      existing.courseIds.push(course.id);
      addUnique(existing.subjects, course.subject);
      addUnique(existing.names, name);
      existing.name = [...existing.names][0] ?? name;
      existing.subjectLabel = [...existing.subjects].join(" · ") || "KKCC Faculty";
      return;
    }

    const subjects = new Set<string>();
    const names = new Set<string>();
    addUnique(subjects, course.subject);
    addUnique(names, name);

    bySlug.set(baseSlug, {
      id: baseSlug,
      slug: baseSlug,
      name,
      subjectLabel: [...subjects].join(" · ") || "KKCC Faculty",
      courseCount: 1,
      lectureCount: Number(course.lectures_count || 0),
      testCount: Number(course.tests_count || 0),
      materialCount: Number(course.materials_count || 0),
      courseIds: [course.id],
      subjects,
      names,
    });
  });

  return [...bySlug.values()]
    .map(({ subjects: _subjects, names: _names, ...profile }) => profile)
    .sort((a, b) => a.name.localeCompare(b.name));
}

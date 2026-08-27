import { Course, Grade, GradeMap } from '@/types';
import { GRADE_OPTIONS } from '@/data/courseData';

const GRADE_POINTS: Record<Grade, number | null> = GRADE_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.points }),
  {} as Record<Grade, number | null>,
);

export const getGradeValue = (grade: Grade): number => GRADE_POINTS[grade] ?? 0;

export const gradeOf = (grades: GradeMap, id: string): Grade =>
  grades[id] ?? 'Not finished';

/** A course counts toward the GPA only if it is graded and actually finished. */
export const countsTowardGpa = (course: Course, grades: GradeMap): boolean =>
  !course.isPassFail && gradeOf(grades, course.id) !== 'Not finished';

export interface GpaStats {
  gpa: number;
  /** Credits behind the GPA — graded and finished. */
  gradedCredits: number;
  /** Credits completed, including pass/fail. */
  completedCredits: number;
  /** Credits on the plan, whether finished or not. */
  plannedCredits: number;
  /** Number of graded courses that still have no grade. */
  pendingCourses: number;
}

export const calculateStats = (courses: Course[], grades: GradeMap): GpaStats => {
  let points = 0;
  let gradedCredits = 0;
  let completedCredits = 0;
  let plannedCredits = 0;
  let pendingCourses = 0;

  courses.forEach((course) => {
    if (!course) return;
    plannedCredits += course.credits;

    if (course.isPassFail) {
      completedCredits += course.credits;
      return;
    }

    const grade = gradeOf(grades, course.id);
    if (grade === 'Not finished') {
      pendingCourses += 1;
      return;
    }

    points += course.credits * getGradeValue(grade);
    gradedCredits += course.credits;
    completedCredits += course.credits;
  });

  return {
    gpa: gradedCredits === 0 ? 0 : points / gradedCredits,
    gradedCredits,
    completedCredits,
    plannedCredits,
    pendingCourses,
  };
};

export const calculateGPA = (courses: Course[], grades: GradeMap): number =>
  calculateStats(courses, grades).gpa;

export const sumCredits = (courses: Course[]): number =>
  courses.reduce((sum, course) => (course ? sum + course.credits : sum), 0);

/**
 * Highest GPA still reachable if every unfinished graded course scored
 * Excellent, and the lowest if they all scored Pass.
 */
export const gpaRange = (courses: Course[], grades: GradeMap) => {
  let points = 0;
  let credits = 0;
  let finishedPoints = 0;
  let finishedCredits = 0;
  let best = 0;
  let worst = 0;

  courses.forEach((course) => {
    if (!course || course.isPassFail) return;
    const grade = gradeOf(grades, course.id);
    credits += course.credits;

    if (grade === 'Not finished') {
      best += course.credits * getGradeValue('Excellent');
      worst += course.credits * getGradeValue('Pass');
      return;
    }

    const earned = course.credits * getGradeValue(grade);
    points += earned;
    finishedPoints += earned;
    finishedCredits += course.credits;
    best += earned;
    worst += earned;
  });

  if (credits === 0) return { best: 0, worst: 0, current: 0 };
  return {
    best: best / credits,
    worst: worst / credits,
    // Divided by finished credits only, so it matches the headline GPA rather
    // than being diluted by courses that have not been graded yet.
    current: finishedCredits === 0 ? 0 : finishedPoints / finishedCredits,
  };
};

export const formatGpa = (gpa: number): string => gpa.toFixed(2);

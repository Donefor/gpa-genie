import {
  CourseRecord,
  STAT_GRADES,
  STAT_GRADE_POINTS,
  StatGrade,
} from '@/data/gradeStats';

export type Distribution = Record<StatGrade, number>;

export const emptyDistribution = (): Distribution =>
  STAT_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: 0 }), {} as Distribution);

/**
 * Grade points weighted by band share. Robust to shares that do not sum to
 * exactly 100, which happens with rounding in the published figures.
 */
export const averageGradePoint = (dist: Distribution | null): number | null => {
  if (!dist) return null;
  let points = 0;
  let weight = 0;
  STAT_GRADES.forEach((grade) => {
    points += STAT_GRADE_POINTS[grade] * dist[grade];
    weight += dist[grade];
  });
  return weight === 0 ? null : points / weight;
};

/** Students who passed, used to weight one term against another. */
export const passingStudents = (record: CourseRecord): number => {
  const rate = record.passedAtPresent ?? record.passedMainExam;
  if (rate === null || rate === undefined) return record.registered;
  return (record.registered * rate) / 100;
};

/**
 * Combines the published percentage distributions of several terms, weighting
 * each by how many students it actually represents.
 */
export const aggregate = (records: CourseRecord[]): Distribution | null => {
  const graded = records.filter((record) => record.distribution !== null);
  if (graded.length === 0) return null;

  const totals = emptyDistribution();
  let weight = 0;

  graded.forEach((record) => {
    const students = passingStudents(record);
    weight += students;
    STAT_GRADES.forEach((grade) => {
      totals[grade] += (record.distribution as Distribution)[grade] * students;
    });
  });

  if (weight === 0) return null;
  return STAT_GRADES.reduce(
    (acc, grade) => ({ ...acc, [grade]: totals[grade] / weight }),
    {} as Distribution,
  );
};

export const weightedPassRate = (records: CourseRecord[]): number | null => {
  let passed = 0;
  let registered = 0;
  records.forEach((record) => {
    const rate = record.passedAtPresent ?? record.passedMainExam;
    if (rate === null || rate === undefined) return;
    passed += (record.registered * rate) / 100;
    registered += record.registered;
  });
  return registered === 0 ? null : (passed / registered) * 100;
};

export const termLabel = (record: { year: number; period: number }): string =>
  `P${record.period} ${record.year}`;

export const termOrder = (record: { year: number; period: number }): number =>
  record.year * 10 + record.period;

export interface TermSlice {
  term: string;
  label: string;
  year: number;
  period: number;
  registered: number;
  passRate: number | null;
  distribution: Distribution | null;
  average: number | null;
}

export const byTerm = (records: CourseRecord[]): TermSlice[] => {
  const groups = new Map<string, CourseRecord[]>();
  records.forEach((record) => {
    const list = groups.get(record.term) ?? [];
    list.push(record);
    groups.set(record.term, list);
  });

  return [...groups.entries()]
    .map(([term, group]) => {
      const distribution = aggregate(group);
      return {
        term,
        label: termLabel(group[0]),
        year: group[0].year,
        period: group[0].period,
        registered: group.reduce((sum, record) => sum + record.registered, 0),
        passRate: weightedPassRate(group),
        distribution,
        average: averageGradePoint(distribution),
      };
    })
    .sort((a, b) => termOrder(a) - termOrder(b));
};

export interface CourseSummary {
  course: string;
  courseNo: string;
  terms: number;
  registered: number;
  passRate: number | null;
  average: number | null;
  isPassFail: boolean;
}

export const summarise = (records: CourseRecord[]): CourseSummary[] => {
  const groups = new Map<string, CourseRecord[]>();
  records.forEach((record) => {
    const list = groups.get(record.course) ?? [];
    list.push(record);
    groups.set(record.course, list);
  });

  return [...groups.entries()]
    .map(([course, group]) => {
      const distribution = aggregate(group);
      return {
        course,
        courseNo: group[0].courseNo,
        terms: new Set(group.map((record) => record.term)).size,
        registered: group.reduce((sum, record) => sum + record.registered, 0),
        passRate: weightedPassRate(group),
        average: averageGradePoint(distribution),
        isPassFail: distribution === null,
      };
    })
    .sort((a, b) => a.course.localeCompare(b.course));
};

export const formatPercent = (value: number | null): string =>
  value === null ? '—' : `${value.toFixed(1)}%`;

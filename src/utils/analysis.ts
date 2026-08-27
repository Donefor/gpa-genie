import { CourseRecord, StatGrade } from '@/data/gradeStats';
import { aggregate, averageGradePoint, passingStudents, weightedPassRate } from './statsMath';

/**
 * SSE course codes are grouped by department. The prefix is the department;
 * anything unrecognised falls into "Other".
 */
const DEPARTMENT_BY_PREFIX: { prefix: string; name: string }[] = [
  { prefix: '33', name: 'Accounting & Financial Management' },
  { prefix: '43', name: 'Finance' },
  { prefix: '53', name: 'Economics' },
  { prefix: '13', name: 'Marketing & Strategy' },
  { prefix: '23', name: 'Management & Organisation' },
  { prefix: '61', name: 'International Business & CEMS' },
  { prefix: '94', name: 'International Business & CEMS' },
  { prefix: '73', name: 'Data Science & Economic History' },
  { prefix: '80', name: 'Entrepreneurship' },
  { prefix: '81', name: 'Entrepreneurship' },
  { prefix: '10', name: 'Languages' },
];

export const departmentOf = (record: CourseRecord): string => {
  const no = record.courseNo;
  if (no.length >= 4) {
    const match = DEPARTMENT_BY_PREFIX.find((entry) => no.startsWith(entry.prefix));
    if (match) return match.name;
  }
  if (no.length === 3 && no.startsWith('6')) return 'Bachelor specialisation & degree projects';
  if (no.length <= 3 && no.startsWith('1')) return 'Languages';
  return 'Other';
};

export const isDegreeProject = (course: string): boolean =>
  /degree project|thesis|research project/i.test(course);

const mean = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;

/** Population standard deviation. */
const stdDev = (values: number[]) => {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
};

export interface CourseAnalysis {
  course: string;
  courseNo: string;
  department: string;
  rounds: number;
  years: number;
  registered: number;
  /** Weighted share of passing students graded Excellent. */
  excellentShare: number;
  meanAverage: number;
  /** Spread of the per-round average grade point. */
  volatility: number;
  /** Spread of the per-round Excellent share. */
  excellentVolatility: number;
  passRate: number | null;
}

export const analyseCourses = (records: CourseRecord[]): CourseAnalysis[] => {
  const groups = new Map<string, CourseRecord[]>();
  records.forEach((record) => {
    if (record.distribution === null) return;
    const list = groups.get(record.course) ?? [];
    list.push(record);
    groups.set(record.course, list);
  });

  return [...groups.entries()].map(([course, group]) => {
    const combined = aggregate(group);
    const perRoundAverage = group
      .map((record) => averageGradePoint(record.distribution))
      .filter((value): value is number => value !== null);
    const perRoundExcellent = group.map(
      (record) => (record.distribution as Record<StatGrade, number>).Excellent,
    );

    return {
      course,
      courseNo: group[0].courseNo,
      department: departmentOf(group[0]),
      rounds: group.length,
      years: new Set(group.map((record) => record.year)).size,
      registered: group.reduce((sum, record) => sum + record.registered, 0),
      excellentShare: combined?.Excellent ?? 0,
      meanAverage: averageGradePoint(combined) ?? 0,
      volatility: stdDev(perRoundAverage),
      excellentVolatility: stdDev(perRoundExcellent),
      passRate: weightedPassRate(group),
    };
  });
};

export interface GroupAnalysis {
  key: string;
  rounds: number;
  registered: number;
  excellentShare: number;
  average: number | null;
  passRate: number | null;
}

const summariseGroup = (key: string, group: CourseRecord[]): GroupAnalysis => {
  const combined = aggregate(group);
  return {
    key,
    rounds: group.length,
    registered: group.reduce((sum, record) => sum + record.registered, 0),
    excellentShare: combined?.Excellent ?? 0,
    average: averageGradePoint(combined),
    passRate: weightedPassRate(group),
  };
};

export const groupBy = (
  records: CourseRecord[],
  keyOf: (record: CourseRecord) => string,
): GroupAnalysis[] => {
  const groups = new Map<string, CourseRecord[]>();
  records.forEach((record) => {
    const key = keyOf(record);
    const list = groups.get(key) ?? [];
    list.push(record);
    groups.set(key, list);
  });
  return [...groups.entries()].map(([key, group]) => summariseGroup(key, group));
};

/** Periods 1-2 run in the autumn, 3-4 in the spring. */
export const semesterOf = (record: CourseRecord): 'Autumn' | 'Spring' =>
  record.period <= 2 ? 'Autumn' : 'Spring';

export const bySemester = (records: CourseRecord[]) =>
  groupBy(records, semesterOf).sort((a, b) => a.key.localeCompare(b.key));

export const byDepartment = (records: CourseRecord[]) =>
  groupBy(records, departmentOf).sort((a, b) => b.registered - a.registered);

export const byPeriod = (records: CourseRecord[]) =>
  groupBy(records, (record) => `P${record.period}`).sort((a, b) => a.key.localeCompare(b.key));

export const degreeProjects = (records: CourseRecord[]) =>
  records.filter((record) => isDegreeProject(record.course));

/** Weighting one course round against another by how many students passed it. */
export const totalPassing = (records: CourseRecord[]): number =>
  records.reduce((sum, record) => sum + passingStudents(record), 0);

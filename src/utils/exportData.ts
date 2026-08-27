import { ALL_RECORDS, CourseRecord, STAT_GRADES } from '@/data/gradeStats';
import { averageGradePoint } from './statsMath';

export const termOf = (record: CourseRecord) => record.year * 10 + record.period;

export const ALL_TERMS = [...new Set(ALL_RECORDS.map((r) => r.term))]
  .map((term) => ({
    term,
    year: 2000 + Number(term.slice(0, 2)),
    period: Number(term.slice(2)),
  }))
  .sort((a, b) => termOf(a as CourseRecord) - termOf(b as CourseRecord));

export const termLabelOf = (t: { year: number; period: number }) => `P${t.period} ${t.year}`;

const escape = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const HEADERS = [
  'course_no',
  'course_name',
  'term',
  'year',
  'study_period',
  'semester',
  'registered',
  'passed_main_exam_pct',
  'passed_at_present_pct',
  'excellent_pct',
  'very_good_pct',
  'good_pct',
  'pass_pct',
  'average_grade_point',
  'graded',
];

/**
 * Cleaned, deduplicated rounds as CSV — one row per course round, ready to
 * hand to a spreadsheet or a language model.
 */
export const buildCsv = (records: CourseRecord[]): string => {
  const rows = records.map((record) => {
    const dist = record.distribution;
    const average = averageGradePoint(dist);
    return [
      record.courseNo,
      escape(record.course),
      record.term,
      String(record.year),
      String(record.period),
      record.period <= 2 ? 'Autumn' : 'Spring',
      String(record.registered),
      record.passedMainExam === null ? '' : String(record.passedMainExam),
      record.passedAtPresent === null ? '' : String(record.passedAtPresent),
      ...STAT_GRADES.slice()
        .reverse()
        .map((grade) => (dist ? String(dist[grade]) : '')),
      average === null ? '' : average.toFixed(3),
      dist ? 'yes' : 'no',
    ].join(',');
  });

  return [HEADERS.join(','), ...rows].join('\n');
};

export const filterByTermRange = (
  records: CourseRecord[],
  from: string,
  to: string,
): CourseRecord[] => {
  const lo = Number(from.slice(0, 2)) * 10 + Number(from.slice(2));
  const hi = Number(to.slice(0, 2)) * 10 + Number(to.slice(2));
  const [min, max] = lo <= hi ? [lo, hi] : [hi, lo];
  return records.filter((record) => {
    const value = Number(record.term.slice(0, 2)) * 10 + Number(record.term.slice(2));
    return value >= min && value <= max;
  });
};

export const downloadCsv = (filename: string, csv: string) => {
  // A BOM keeps Excel from mangling the non-ASCII course names.
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** A starter prompt to paste alongside the export. */
export const ANALYSIS_PROMPT = `Attached is grade statistics for courses at the Stockholm School of Economics, one row per course round.

Columns: course_no, course_name, term (YYPP: calendar year + study period), year, study_period (1-4), semester (periods 1-2 are Autumn, 3-4 are Spring), registered, passed_main_exam_pct, passed_at_present_pct, excellent_pct, very_good_pct, good_pct, pass_pct, average_grade_point, graded.

The four grade percentages are shares of the students who PASSED, so they sum to about 100. Rows with graded=no were examined Pass/Fail and publish no distribution — exclude them from grade analysis. average_grade_point uses Excellent=5.0, Very Good=4.0, Good=3.5, Pass=3.0.

Help me work out which courses are graded most generously, which are most consistent from round to round, and whether autumn and spring differ. Weight each round by the number of students behind it rather than treating every round equally.`;

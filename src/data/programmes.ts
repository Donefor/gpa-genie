import scraped from './scrapedProgrammes.json';

/** A course a student is actually graded on. */
export interface ProgrammeCourse {
  /** Stable and programme-scoped, so grades never collide between programmes. */
  id: string;
  name: string;
  courseNo: string | null;
  credits: number;
  kind: 'core' | 'thesis' | 'choice';
  /** Set on every member of a "choose N out of M" group. */
  choose?: { pick: number; outOf: number };
}

export interface ProgrammeTerm {
  key: string;
  year: string;
  label: string;
  /** What a full term is worth: 30 for a semester, 15 for a BSc period. */
  credits: number;
  courses: ProgrammeCourse[];
  /** Free 7.5 ECTS slots the student fills with their own electives. */
  electiveSlots: number;
}

/** Courses the programme page itself names as electives. */
export interface SuggestedElective {
  courseNo: string | null;
  name: string;
}

export interface Programme {
  key: string;
  name: string;
  shortName: string;
  level: 'Bachelor' | 'Master';
  degreeCredits: number;
  /** Business and Economics keeps its own bespoke page. */
  custom?: boolean;
  source?: string;
  note?: string;
  terms: ProgrammeTerm[];
  suggested: SuggestedElective[];
  /**
   * Course-number prefixes belonging to this programme's own department,
   * taken from the numbers its core courses carry. Finance courses run 43xx,
   * Economics 53xx, and so on.
   */
  departmentPrefixes: string[];
}

const SLOT = 7.5;

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type RawCourse = {
  year: string | null;
  semester: string | null;
  course: string;
  courseNo: string | null;
  ects: number | null;
  kind: string;
  choose?: { pick: number; outOf: number };
};
type RawProgramme = {
  name: string;
  level: string;
  source: string;
  thesisNote?: string;
  courses: RawCourse[];
};

/** "Semester 3 and 4" is two terms merged on the page, so it is worth 60. */
const termCredits = (label: string) => (/and \d/.test(label) ? 60 : 30);

const SHORT: Record<string, string> = {
  'bsc-retail-management': 'Retail Management',
  'msc-avfm': 'Accounting, Valuation & Fin. Mgmt',
  'msc-business-innovation': 'Business Innovation',
  'msc-economics': 'Economics',
  'msc-finance': 'Finance',
  'msc-international-business': 'International Business',
};

const build = (key: string, raw: RawProgramme): Programme => {
  const terms = new Map<string, ProgrammeTerm>();

  raw.courses.forEach((row) => {
    const year = row.year ?? 'Year 1';
    const label = row.semester ?? 'Semester 1';
    if (label === 'Summer') return;                       // not credit-bearing here

    const termKey = `${slug(year)}-${slug(label)}`;
    if (!terms.has(termKey)) {
      terms.set(termKey, {
        key: termKey, year, label,
        credits: termCredits(label),
        courses: [], electiveSlots: 0,
      });
    }
    const term = terms.get(termKey)!;

    if (row.kind === 'core' || row.kind === 'thesis' || row.kind === 'choice') {
      if (!row.ects) return;
      term.courses.push({
        id: `${key}:${row.courseNo ?? slug(row.course)}`,
        name: row.course,
        courseNo: row.courseNo,
        credits: row.ects,
        kind: row.kind as ProgrammeCourse['kind'],
        choose: row.choose,
      });
    }
  });

  // Whatever a term does not fill with fixed courses is the student's to choose.
  terms.forEach((term) => {
    const choiceGroup = term.courses.filter((c) => c.kind === 'choice');
    const chosen = choiceGroup.length
      ? (choiceGroup[0].choose!.pick / choiceGroup.length) *
        choiceGroup.reduce((sum, c) => sum + c.credits, 0)
      : 0;
    const fixed = term.courses
      .filter((c) => c.kind !== 'choice')
      .reduce((sum, c) => sum + c.credits, 0);
    term.electiveSlots = Math.max(0, Math.round((term.credits - fixed - chosen) / SLOT));
  });

  const level = raw.level === 'Bachelor' ? 'Bachelor' : 'Master';
  return {
    key,
    name: raw.name,
    shortName: SHORT[key] ?? raw.name,
    level,
    degreeCredits: level === 'Bachelor' ? 180 : 120,
    source: raw.source,
    note: raw.thesisNote,
    terms: [...terms.values()],
    suggested: raw.courses
      .filter((row) => row.kind === 'electiveOption')
      .map((row) => ({ courseNo: row.courseNo, name: row.course })),
    departmentPrefixes: departmentPrefixesOf(raw),
  };
};

/** Prefixes that appear on at least two of the programme's own core courses. */
const departmentPrefixesOf = (raw: RawProgramme): string[] => {
  const counts = new Map<string, number>();
  raw.courses.forEach((row) => {
    if (row.kind !== 'core' && row.kind !== 'choice') return;
    const no = row.courseNo;
    if (!no) return;
    const prefix = no.startsWith('NDH') ? 'NDH' : /^\d{4}$/.test(no) ? no.slice(0, 2) : null;
    if (!prefix) return;
    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
  });
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([prefix]) => prefix);
};

/** Business and Economics is modelled by hand in courseData.ts. */
export const BUSINESS_ECONOMICS: Programme = {
  key: 'bsc-business-economics',
  name: 'BSc Business and Economics',
  shortName: 'Business and Economics',
  level: 'Bachelor',
  degreeCredits: 180,
  custom: true,
  terms: [],
  suggested: [],
  departmentPrefixes: [],
};

export const PROGRAMMES: Programme[] = [
  BUSINESS_ECONOMICS,
  ...Object.entries(scraped as unknown as Record<string, RawProgramme>)
    .map(([key, raw]) => build(key, raw))
    .sort((a, b) => (a.level === b.level ? a.name.localeCompare(b.name) : a.level === 'Bachelor' ? -1 : 1)),
];

export const programmeByKey = (key: string): Programme =>
  PROGRAMMES.find((p) => p.key === key) ?? BUSINESS_ECONOMICS;

export const DEFAULT_PROGRAMME = BUSINESS_ECONOMICS.key;

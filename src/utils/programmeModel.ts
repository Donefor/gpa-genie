import { Course, ProgramConfig } from '@/types';
import { Programme, ProgrammeTerm } from '@/data/programmes';
import { catalogueCourse } from '@/data/courseCatalogue';

const SLOT = 7.5;

/**
 * Which periods a term covers. A named period is itself; a semester is the two
 * periods of its half-year; a merged "semester 3 and 4" is all four.
 */
export const periodsOfTerm = (label: string): number[] => {
  const period = /Period\s+(\d)/.exec(label);
  if (period) return [Number(period[1])];
  if (/and \d/.test(label)) return [1, 2, 3, 4];
  const semester = /Semester\s+(\d)/.exec(label);
  if (semester) return Number(semester[1]) % 2 === 1 ? [1, 2] : [3, 4];
  return [];
};

/** A master's year 2 is four periods of 15 ECTS, two slots each. */
export const PERIODS_PER_YEAR = 4;
export const SLOTS_PER_PERIOD = 2;
export const PERIOD_CREDITS = 15;

export interface BuiltTerm {
  key: string;
  year: string;
  label: string;
  credits: number;
  /** Which of the four periods this term covers. */
  periods: number[];
  courses: Course[];
  /** Config keys for the free elective slots in this term. */
  electiveKeys: string[];
  /** Members of a choose-N-of-M group, with whether the student took each. */
  choices: { course: Course; key: string; taken: boolean }[];
  choose?: { pick: number; outOf: number };
}

const toCourse = (
  id: string,
  name: string,
  credits: number,
  kind: Course['kind'],
  isPassFail = false,
  courseNo: string | null = null,
): Course => ({ id, name, credits, kind, isPassFail, courseNo });

/**
 * Turns a programme plus the student's choices into the course list to render.
 * Same contract as the Business and Economics builders: courses are derived,
 * grades live elsewhere keyed by id.
 */
export const buildProgrammeTerms = (
  programme: Programme,
  config: ProgramConfig,
): BuiltTerm[] => {
  // A master's second year is driven by the thesis and exchange choices, so it
  // is built by period rather than taken from the programme page.
  const fixed = programme.terms.filter(
    (term) => !(programme.level === 'Master' && term.year === 'Year 2'),
  );
  const built = fixed.map((term: ProgrammeTerm) => {
    const courses: Course[] = [];
    const choices: BuiltTerm['choices'] = [];
    let choose: BuiltTerm['choose'];

    term.courses.forEach((entry) => {
      const kind: Course['kind'] = entry.kind === 'thesis' ? 'thesis' : 'core';
      const course = toCourse(entry.id, entry.name, entry.credits, kind, false, entry.courseNo);

      if (entry.kind === 'choice') {
        choose = entry.choose;
        const key = `${term.key}:choice:${entry.id}`;
        const taken = config.programmeChoices[key] ?? false;
        choices.push({ course, key, taken });
        if (taken) courses.push(course);
        return;
      }
      courses.push(course);
    });

    const electiveKeys: string[] = [];
    for (let slot = 0; slot < term.electiveSlots; slot += 1) {
      // Scoped to the programme: an unscoped key showed a course chosen in one
      // programme in the same slot of another.
      const key = `${programme.key}:${term.key}:${slot}`;
      electiveKeys.push(key);
      const type = config.programmeElectives[key];
      const pickedNo = config.programmeElectiveCourses[key] ?? null;
      const picked = pickedNo ? catalogueCourse(pickedNo) : undefined;
      if (type || picked) {
        courses.push(
          toCourse(
            // Keyed by the chosen course, so a grade follows the course rather
            // than the slot it happened to be put in.
            picked ? `${key}:${picked.courseNo}` : key,
            picked ? picked.name : 'Elective course',
            picked ? picked.credits : SLOT,
            'elective',
            type === 'Pass/Fail',
            picked ? picked.courseNo : null,
          ),
        );
      }
    }

    return {
      key: term.key,
      year: term.year,
      label: term.label,
      credits: term.credits,
      periods: periodsOfTerm(term.label),
      courses,
      electiveKeys,
      choices,
      choose,
    };
  });

  return programme.level === 'Master'
    ? [...built, ...buildMasterYearTwo(programme, config)]
    : built;
};

/** Terms grouped under their year heading, in page order. */
export const groupByYear = (terms: BuiltTerm[]) => {
  const years = new Map<string, BuiltTerm[]>();
  terms.forEach((term) => {
    const list = years.get(term.year) ?? [];
    list.push(term);
    years.set(term.year, list);
  });
  return [...years.entries()].map(([year, list]) => ({ year, terms: list }));
};

export const flattenTerms = (terms: BuiltTerm[]): Course[] =>
  terms.flatMap((term) => term.courses);

/** Courses grouped by year, for the per-year figures in the summary. */
export const groupProgrammeYears = (
  programme: Programme,
  config: ProgramConfig,
): Course[][] => {
  const terms = buildProgrammeTerms(programme, config);
  return groupByYear(terms).map((group) => flattenTerms(group.terms));
};


/**
 * Year 2 of a master's, laid out by period rather than semester.
 *
 * The thesis is required and takes a whole half-year; an exchange, if taken,
 * takes the other. Whatever periods are left are elective slots. This mirrors
 * how the bachelor's third year is built, for the same reason: a period can
 * then never hold more than its 15 ECTS.
 */
export const buildMasterYearTwo = (
  programme: Programme,
  config: ProgramConfig,
): BuiltTerm[] => {
  const thesisPeriods = config.mscThesis === 'fall' ? [1, 2] : [3, 4];
  const exchangePeriods =
    config.mscExchange === 'fall' ? [1, 2] : config.mscExchange === 'spring' ? [3, 4] : [];

  return [1, 2, 3, 4].map((period) => {
    const slots: (Course | null)[] = new Array(SLOTS_PER_PERIOD).fill(null);
    const label = `Period ${period}`;

    if (thesisPeriods.includes(period)) {
      // 30 ECTS across two periods, one shared id so both halves hold one grade.
      slots[0] = toCourse(`${programme.key}:thesis`, "Master's thesis", PERIOD_CREDITS, 'thesis');
      slots[1] = slots[0];
    } else if (exchangePeriods.includes(period)) {
      for (let i = 0; i < SLOTS_PER_PERIOD; i += 1) {
        slots[i] = toCourse(
          `${programme.key}:y2-p${period}-exchange-${i}`,
          'Exchange',
          SLOT,
          'exchange',
          true,
        );
      }
    }

    const electiveKeys: string[] = [];
    slots.forEach((occupant, index) => {
      if (occupant) return;
      const key = `${programme.key}:y2-p${period}-${index}`;
      electiveKeys.push(key);
      const type = config.programmeElectives[key];
      const pickedNo = config.programmeElectiveCourses[key] ?? null;
      const picked = pickedNo ? catalogueCourse(pickedNo) : undefined;
      if (type || picked) {
        slots[index] = toCourse(
          picked ? `${key}:${picked.courseNo}` : key,
          picked ? picked.name : 'Elective course',
          picked ? picked.credits : SLOT,
          'elective',
          type === 'Pass/Fail',
          picked ? picked.courseNo : null,
        );
      }
    });

    // The thesis fills both slots of its periods but is a single course.
    const courses: Course[] = [];
    slots.forEach((slot, index) => {
      if (!slot) return;
      if (index > 0 && slots[index - 1] === slot) return;
      courses.push(slot);
    });

    return {
      key: `y2-p${period}`,
      year: 'Year 2',
      label,
      credits: PERIOD_CREDITS,
      periods: [period],
      courses,
      electiveKeys,
      choices: [],
    };
  });
};

/** How many of the chosen electives come from the programme's own department. */
export const departmentElectiveCount = (
  programme: Programme,
  config: ProgramConfig,
): number =>
  Object.values(config.programmeElectiveCourses).filter(
    (courseNo): courseNo is string =>
      !!courseNo && programme.departmentPrefixes.some((prefix) => courseNo.startsWith(prefix)),
  ).length;

/** Electives from your own department that a master's requires. */
export const REQUIRED_DEPARTMENT_ELECTIVES = 4;

import { Course, ProgramConfig } from '@/types';
import { Programme, ProgrammeTerm } from '@/data/programmes';
import { catalogueCourse } from '@/data/courseCatalogue';

const SLOT = 7.5;

export interface BuiltTerm {
  key: string;
  year: string;
  label: string;
  credits: number;
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
): Course => ({ id, name, credits, kind, isPassFail });

/**
 * Turns a programme plus the student's choices into the course list to render.
 * Same contract as the Business and Economics builders: courses are derived,
 * grades live elsewhere keyed by id.
 */
export const buildProgrammeTerms = (
  programme: Programme,
  config: ProgramConfig,
): BuiltTerm[] =>
  programme.terms.map((term: ProgrammeTerm) => {
    const courses: Course[] = [];
    const choices: BuiltTerm['choices'] = [];
    let choose: BuiltTerm['choose'];

    term.courses.forEach((entry) => {
      const kind: Course['kind'] = entry.kind === 'thesis' ? 'thesis' : 'core';
      const course = toCourse(entry.id, entry.name, entry.credits, kind);

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
      const key = `${term.key}:${slot}`;
      electiveKeys.push(key);
      const type = config.programmeElectives[key];
      const pickedNo = config.programmeElectiveCourses[key] ?? null;
      const picked = pickedNo ? catalogueCourse(pickedNo) : undefined;
      if (type || picked) {
        courses.push(
          toCourse(
            // Keyed by the chosen course, so a grade follows the course rather
            // than the slot it happened to be put in.
            picked ? `${programme.key}:${key}:${picked.courseNo}` : `${programme.key}:${key}`,
            picked ? picked.name : 'Elective course',
            picked ? picked.credits : SLOT,
            'elective',
            type === 'Pass/Fail',
          ),
        );
      }
    }

    return {
      key: term.key,
      year: term.year,
      label: term.label,
      credits: term.credits,
      courses,
      electiveKeys,
      choices,
      choose,
    };
  });

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

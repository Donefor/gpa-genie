import {
  Course,
  ElectiveType,
  Period,
  ProgramConfig,
  Specialization,
} from '@/types';
import {
  SLOTS_PER_PERIOD,
  SLOT_CREDITS,
  SPECIALIZATION_COURSES,
  YEAR_1_COURSES,
  YEAR_2_COURSES,
} from '@/data/courseData';

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** A period is a fixed number of 7.5 ECTS slots; `null` means the slot is free. */
type SlotGrid = (Course | null)[];

const emptyGrid = (): SlotGrid => new Array(SLOTS_PER_PERIOD).fill(null);

const firstFreeSlot = (grid: SlotGrid) => grid.findIndex((slot) => slot === null);

const fixedCourses = (
  source: Record<number, { name: string; credits: number }[]>,
  year: number,
  period: number,
): Course[] =>
  (source[period] ?? []).map((course) => ({
    id: `y${year}-p${period}-${slug(course.name)}`,
    name: course.name,
    credits: course.credits,
    kind: 'core',
    isPassFail: false,
  }));

const electiveCourse = (id: string, type: ElectiveType): Course => ({
  id,
  name: 'Elective Course',
  credits: SLOT_CREDITS,
  kind: 'elective',
  isPassFail: type === 'Pass/Fail',
});

const specializationCourse = (spec: Specialization, period: number): Course => {
  const data = SPECIALIZATION_COURSES[spec][period];
  return {
    id: `spec-${slug(spec)}-p${period}`,
    name: data.name,
    credits: data.credits,
    kind: 'specialization',
    isPassFail: false,
  };
};

/** Year 1 is entirely fixed. */
export const buildYear1 = (): Period[] =>
  [1, 2, 3, 4].map((period) => ({
    index: period,
    courses: fixedCourses(YEAR_1_COURSES, 1, period),
  }));

/**
 * Year 2: periods 1-2 are fixed; periods 3-4 hold the primary specialisation
 * course plus either a second specialisation course or an elective.
 */
export const buildYear2 = (config: ProgramConfig): Period[] =>
  [1, 2, 3, 4].map((period) => {
    if (period <= 2) {
      return { index: period, courses: fixedCourses(YEAR_2_COURSES, 2, period) };
    }

    const courses: Course[] = [];
    if (config.specialization) {
      courses.push(specializationCourse(config.specialization, period));

      if (config.secondSpecialization) {
        courses.push(specializationCourse(config.secondSpecialization, period));
      } else {
        const type = config.year2Electives[`p${period}`];
        if (type) courses.push(electiveCourse(`y2-p${period}-e1`, type));
      }
    }

    return { index: period, courses };
  });

export type Year3Layout = {
  periods: Period[];
  /** Free elective slots per period, as config keys: "p1-0", "p1-1", ... */
  electiveSlots: Record<number, string[]>;
};

/**
 * Year 3 fills 7.5 ECTS slots in a fixed priority order — exchange, then
 * internship, then thesis, then electives — so a period can never exceed
 * 15 ECTS and two commitments can never claim the same slot.
 */
export const buildYear3 = (config: ProgramConfig): Year3Layout => {
  const grids: Record<number, SlotGrid> = {
    1: emptyGrid(),
    2: emptyGrid(),
    3: emptyGrid(),
    4: emptyGrid(),
  };

  const exchangePeriods =
    config.exchange === 'fall' ? [1, 2] : config.exchange === 'spring' ? [3, 4] : [];

  // Exchange takes a whole period: both slots, always pass/fail.
  exchangePeriods.forEach((period) => {
    for (let slot = 0; slot < SLOTS_PER_PERIOD; slot += 1) {
      grids[period][slot] = {
        id: `y3-p${period}-x${slot}`,
        name: 'Exchange',
        credits: SLOT_CREDITS,
        kind: 'exchange',
        isPassFail: true,
      };
    }
  });

  // The internship runs across the autumn, so it cannot coexist with a fall exchange.
  if (config.internship && config.exchange !== 'fall') {
    [1, 2].forEach((period) => {
      const slot = firstFreeSlot(grids[period]);
      if (slot === -1) return;
      grids[period][slot] = {
        id: `y3-p${period}-internship`,
        name: 'Internship',
        credits: SLOT_CREDITS,
        kind: 'internship',
        isPassFail: true,
      };
    });
  }

  // One 15 ECTS thesis spanning two periods, sharing a single id — both halves
  // therefore always carry the same grade, with no cross-period syncing.
  const thesisPeriods =
    config.thesis === 'fall' ? [1, 2] : config.thesis === 'spring' ? [3, 4] : [];
  thesisPeriods.forEach((period) => {
    const slot = firstFreeSlot(grids[period]);
    if (slot === -1) return;
    grids[period][slot] = {
      id: 'y3-thesis',
      name: 'Thesis',
      credits: SLOT_CREDITS,
      kind: 'thesis',
      isPassFail: false,
    };
  });

  // Whatever is left over can be filled with electives.
  const electiveSlots: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [] };
  [1, 2, 3, 4].forEach((period) => {
    grids[period].forEach((occupant, slot) => {
      if (occupant !== null) return;
      const key = `p${period}-${slot}`;
      electiveSlots[period].push(key);
      const type = config.year3Electives[key];
      if (type) grids[period][slot] = electiveCourse(`y3-${key}`, type);
    });
  });

  return {
    periods: [1, 2, 3, 4].map((period) => ({
      index: period,
      courses: grids[period].filter((slot): slot is Course => slot !== null),
    })),
    electiveSlots,
  };
};

/** Which Year 3 options the current exchange choice rules out. */
export const year3Conflicts = (config: ProgramConfig) => ({
  internshipBlocked: config.exchange === 'fall',
  thesisFallBlocked: config.exchange === 'fall',
  thesisSpringBlocked: config.exchange === 'spring',
});

export const flattenPeriods = (periods: Period[]): Course[] =>
  periods.flatMap((period) => period.courses);

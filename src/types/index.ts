export type Grade =
  | 'Not finished'
  | 'Pass'
  | 'Good'
  | 'Very good'
  | 'Excellent';

/** How a course contributes to the GPA. */
export type CourseKind =
  | 'core'
  | 'specialization'
  | 'elective'
  | 'thesis'
  | 'exchange'
  | 'internship';

/**
 * A course as rendered in a period. `id` is stable across reconfiguration:
 * grades live in a separate id-keyed store, so rebuilding the course list
 * never destroys entered grades.
 */
export type Course = {
  id: string;
  name: string;
  credits: number;
  kind: CourseKind;
  /** SSE course number, where the course has one. */
  courseNo?: string | null;
  /** Pass/Fail courses carry credits but are excluded from the GPA. */
  isPassFail: boolean;
};

export type Period = {
  /** 1-4, within its year. */
  index: number;
  courses: Course[];
};

export type Year = {
  number: 1 | 2 | 3;
  periods: Period[];
};

export type Specialization =
  | 'Economics'
  | 'Finance'
  | 'Accounting & Financial Management'
  | 'Marketing'
  | 'Management';

export type ElectiveType = 'Graded' | 'Pass/Fail';

export type ExchangeOption = 'none' | 'fall' | 'spring';
export type ThesisOption = 'none' | 'fall' | 'spring';

export interface CourseData {
  name: string;
  credits: number;
}

/** Grades keyed by stable course id. A missing id means 'Not finished'. */
export type GradeMap = Record<string, Grade>;

/** Everything the user has chosen. Course lists are derived from this. */
export interface ProgramConfig {
  /** Which programme is being tracked. */
  programme: string;
  /** Elective type per slot, keyed "<termKey>:<slot>". */
  programmeElectives: Record<string, ElectiveType | null>;
  /** The real course chosen for a slot, if the student named one. */
  programmeElectiveCourses: Record<string, string | null>;
  /** Which members of a "choose N of M" group the student actually took. */
  programmeChoices: Record<string, boolean>;
  specialization: Specialization | null;
  secondSpecialization: Specialization | null;
  /** Year 2 electives, keyed "p3" | "p4" -> slot index. */
  year2Electives: Record<string, ElectiveType | null>;
  exchange: ExchangeOption;
  internship: boolean;
  thesis: ThesisOption;
  /** Year 3 electives, keyed "p1".."p4" -> slot index. */
  year3Electives: Record<string, ElectiveType | null>;
}

export interface ProgramState {
  config: ProgramConfig;
  grades: GradeMap;
}

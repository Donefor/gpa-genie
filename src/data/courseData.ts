import { CourseData, Grade, Specialization } from '@/types';

/** Every period in the programme is worth 15 ECTS. */
export const PERIOD_CREDITS = 15;
/** Year 2/3 slots are 7.5 ECTS each, two per period. */
export const SLOT_CREDITS = 7.5;
export const SLOTS_PER_PERIOD = 2;

export const YEAR_1_COURSES: Record<number, CourseData[]> = {
  1: [
    { name: 'Data Analytics I', credits: 3 },
    { name: 'Global Challenges I', credits: 6 },
    { name: 'Economics I: Microeconomics', credits: 6 },
  ],
  2: [
    { name: 'Management I: Organizing', credits: 6 },
    { name: 'Accounting I: Understanding Financial Reports', credits: 6 },
    { name: 'Business Law I', credits: 3 },
  ],
  3: [
    { name: 'Marketing', credits: 6 },
    { name: 'Business Law II', credits: 3 },
    { name: 'Data Analytics II', credits: 6 },
  ],
  4: [
    { name: 'Innovation', credits: 6 },
    { name: 'Finance I', credits: 3 },
    { name: 'Economics II: Macroeconomics', credits: 6 },
  ],
};

export const YEAR_2_COURSES: Record<number, CourseData[]> = {
  1: [
    { name: 'Accounting II: Analysing Performance', credits: 6 },
    { name: 'Finance II', credits: 6 },
    { name: 'Management II: Leadership', credits: 3 },
  ],
  2: [
    { name: 'Data Analytics III', credits: 3 },
    { name: 'Strategy', credits: 6 },
    { name: 'Global Challenges II: Shifting', credits: 6 },
  ],
  // Periods 3 and 4 are derived from the chosen specialisations / electives.
};

export const SPECIALIZATIONS: Specialization[] = [
  'Economics',
  'Finance',
  'Accounting & Financial Management',
  'Marketing',
  'Management',
];

export const SPECIALIZATION_COURSES: Record<
  Specialization,
  Record<number, CourseData>
> = {
  Economics: {
    3: { name: 'Using Data to Solve Economic and Social Problems', credits: 7.5 },
    4: { name: 'The Economic Approach to Policy Design', credits: 7.5 },
  },
  Finance: {
    3: { name: 'Investment Management', credits: 7.5 },
    4: { name: 'Corporate Finance and Value Creation', credits: 7.5 },
  },
  'Accounting & Financial Management': {
    3: { name: 'Financial Reporting and Financial Markets', credits: 7.5 },
    4: { name: 'Performance Measurement and Business Control', credits: 7.5 },
  },
  Marketing: {
    3: { name: 'Applied Marketing Theory', credits: 7.5 },
    4: { name: 'Marketing in Practice', credits: 7.5 },
  },
  Management: {
    3: { name: 'Operations, Consulting and Change', credits: 7.5 },
    4: { name: 'Management: Operations', credits: 7.5 },
  },
};

/** Short labels used on the specialisation chips. */
export const SPECIALIZATION_SHORT: Record<Specialization, string> = {
  Economics: 'Economics',
  Finance: 'Finance',
  'Accounting & Financial Management': 'Accounting & Fin. Mgmt',
  Marketing: 'Marketing',
  Management: 'Management',
};

export const GRADE_OPTIONS: { value: Grade; label: string; points: number | null }[] = [
  { value: 'Not finished', label: 'Not finished', points: null },
  { value: 'Pass', label: 'Pass', points: 3.0 },
  { value: 'Good', label: 'Good', points: 3.5 },
  { value: 'Very good', label: 'Very good', points: 4.0 },
  { value: 'Excellent', label: 'Excellent', points: 5.0 },
];

export const PERIOD_LABELS = ['First Period', 'Second Period', 'Third Period', 'Fourth Period'];
export const YEAR_LABELS: Record<number, string> = {
  1: 'First Year',
  2: 'Second Year',
  3: 'Third Year',
};

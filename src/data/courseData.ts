
import { CourseData } from '@/types';

export const YEAR_1_COURSES: { [key: number]: CourseData[] } = {
  1: [
    { name: 'Data Analytics I', credits: 3 },
    { name: 'Global Challenges I', credits: 6 },
    { name: 'Economics I: Microeconomics', credits: 6 }
  ],
  2: [
    { name: 'Management I: Organizing', credits: 6 },
    { name: 'Accounting I: Understanding Financial Reports', credits: 6 },
    { name: 'Business Law I', credits: 3 }
  ],
  3: [
    { name: 'Marketing', credits: 6 },
    { name: 'Business Law II', credits: 3 },
    { name: 'Data Analytics II', credits: 6 }
  ],
  4: [
    { name: 'Innovation', credits: 6 },
    { name: 'Finance 1', credits: 3 },
    { name: 'Economics II: Macroeconomics', credits: 6 }
  ]
};

export const YEAR_2_COURSES: { [key: number]: CourseData[] } = {
  1: [
    { name: 'Accounting II: Analysing Performance', credits: 6 },
    { name: 'Finance II', credits: 6 },
    { name: 'Management II: Leadership', credits: 3 }
  ],
  2: [
    { name: 'Data Analytics III', credits: 3 },
    { name: 'Strategy', credits: 6 },
    { name: 'Global Challenges II: Shifting', credits: 6 }
  ],
  3: [], // Will be populated based on specialization/elective choice
  4: []  // Will be populated based on specialization/elective choice
};

export const SPECIALIZATION_COURSES: { [key: string]: { [key: number]: CourseData[] } } = {
  'Economics': {
    3: [{ name: 'Using Data to Solve Economic and Social Problems', credits: 7.5 }],
    4: [{ name: 'The Economic Approach to Policy Design', credits: 7.5 }]
  },
  'Finance': {
    3: [{ name: 'Investment Management', credits: 7.5 }],
    4: [{ name: 'Corporate Finance and Value Creation', credits: 7.5 }]
  },
  'Accounting & Financial Management': {
    3: [{ name: 'Financial reporting and financial markets', credits: 7.5 }],
    4: [{ name: 'Performance measurement and business control', credits: 7.5 }]
  },
  'Marketing': {
    3: [{ name: 'Applied Marketing Theory', credits: 7.5 }],
    4: [{ name: 'Marketing in Practice', credits: 7.5 }]
  },
  'Management': {
    3: [{ name: 'Operations, Consulting and Change', credits: 7.5 }],
    4: [{ name: 'Management: Operations', credits: 7.5 }]
  }
};

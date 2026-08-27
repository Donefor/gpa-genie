import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  ElectiveType,
  ExchangeOption,
  Grade,
  ProgramConfig,
  ProgramState,
  Specialization,
  ThesisOption,
} from '@/types';

const STORAGE_KEY = 'sse-gpa-calculator:v2';

export const emptyConfig: ProgramConfig = {
  programme: 'bsc-business-economics',
  programmeElectives: {},
  programmeElectiveCourses: {},
  programmeChoices: {},
  specialization: null,
  secondSpecialization: null,
  year2Electives: {},
  exchange: 'none',
  internship: false,
  thesis: 'none',
  year3Electives: {},
};

const initialState: ProgramState = { config: emptyConfig, grades: {} };

type Action =
  | { type: 'setGrade'; id: string; grade: Grade }
  | { type: 'setSpecialization'; spec: Specialization | null }
  | { type: 'setSecondSpecialization'; spec: Specialization | null }
  | { type: 'setYear2Elective'; key: string; elective: ElectiveType | null }
  | { type: 'setYear3Elective'; key: string; elective: ElectiveType | null }
  | { type: 'setExchange'; exchange: ExchangeOption }
  | { type: 'setInternship'; internship: boolean }
  | { type: 'setThesis'; thesis: ThesisOption }
  | { type: 'setProgramme'; programme: string }
  | { type: 'setProgrammeElective'; key: string; elective: ElectiveType | null }
  | { type: 'setProgrammeElectiveCourse'; key: string; courseNo: string | null }
  | { type: 'toggleProgrammeChoice'; key: string; taken: boolean }
  | { type: 'reset' }
  | { type: 'hydrate'; state: ProgramState };

const reducer = (state: ProgramState, action: Action): ProgramState => {
  const { config } = state;

  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'reset':
      return initialState;

    // Grades are stored by course id and never rewritten by a config change,
    // so switching options around can no longer wipe entered grades.
    case 'setGrade':
      return { ...state, grades: { ...state.grades, [action.id]: action.grade } };

    // Grades are keyed per programme, so switching keeps each programme's work.
    case 'setProgramme':
      return { ...state, config: { ...config, programme: action.programme } };

    case 'setProgrammeElective':
      return {
        ...state,
        config: {
          ...config,
          programmeElectives: { ...config.programmeElectives, [action.key]: action.elective },
        },
      };

    // Naming a course implies you are taking it, so default it to graded.
    case 'setProgrammeElectiveCourse':
      return {
        ...state,
        config: {
          ...config,
          programmeElectiveCourses: {
            ...config.programmeElectiveCourses,
            [action.key]: action.courseNo,
          },
          programmeElectives: {
            ...config.programmeElectives,
            [action.key]: action.courseNo
              ? config.programmeElectives[action.key] ?? 'Graded'
              : config.programmeElectives[action.key] ?? null,
          },
        },
      };

    case 'toggleProgrammeChoice':
      return {
        ...state,
        config: {
          ...config,
          programmeChoices: { ...config.programmeChoices, [action.key]: action.taken },
        },
      };

    case 'setSpecialization':
      return {
        ...state,
        config: {
          ...config,
          specialization: action.spec,
          secondSpecialization:
            config.secondSpecialization === action.spec ? null : config.secondSpecialization,
        },
      };

    case 'setSecondSpecialization':
      return {
        ...state,
        config: {
          ...config,
          secondSpecialization: action.spec === config.specialization ? null : action.spec,
        },
      };

    case 'setYear2Elective':
      return {
        ...state,
        config: {
          ...config,
          year2Electives: { ...config.year2Electives, [action.key]: action.elective },
        },
      };

    case 'setYear3Elective':
      return {
        ...state,
        config: {
          ...config,
          year3Electives: { ...config.year3Electives, [action.key]: action.elective },
        },
      };

    // Exchange consumes a full semester, so it evicts whatever else claimed it
    // and pushes the thesis to the free half rather than silently dropping it.
    case 'setExchange': {
      const next: ProgramConfig = { ...config, exchange: action.exchange };
      if (action.exchange === 'fall') {
        next.internship = false;
        if (config.thesis === 'fall') next.thesis = 'spring';
      } else if (action.exchange === 'spring') {
        if (config.thesis === 'spring') next.thesis = 'fall';
      }
      return { ...state, config: next };
    }

    case 'setInternship': {
      const next: ProgramConfig = { ...config, internship: action.internship };
      if (action.internship && config.exchange === 'fall') next.exchange = 'none';
      return { ...state, config: next };
    }

    case 'setThesis': {
      const next: ProgramConfig = { ...config, thesis: action.thesis };
      if (action.thesis === 'fall' && config.exchange === 'fall') next.exchange = 'none';
      if (action.thesis === 'spring' && config.exchange === 'spring') next.exchange = 'none';
      return { ...state, config: next };
    }

    default:
      return state;
  }
};

const loadState = (): ProgramState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<ProgramState>;
    return {
      config: { ...emptyConfig, ...(parsed.config ?? {}) },
      grades: parsed.grades ?? {},
    };
  } catch {
    return initialState;
  }
};

export const useProgramState = () => {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // A full or unavailable localStorage should never break the calculator.
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      setGrade: (id: string, grade: Grade) => dispatch({ type: 'setGrade', id, grade }),
      setProgramme: (programme: string) => dispatch({ type: 'setProgramme', programme }),
      setProgrammeElective: (key: string, elective: ElectiveType | null) =>
        dispatch({ type: 'setProgrammeElective', key, elective }),
      setProgrammeElectiveCourse: (key: string, courseNo: string | null) =>
        dispatch({ type: 'setProgrammeElectiveCourse', key, courseNo }),
      toggleProgrammeChoice: (key: string, taken: boolean) =>
        dispatch({ type: 'toggleProgrammeChoice', key, taken }),
      setSpecialization: (spec: Specialization | null) =>
        dispatch({ type: 'setSpecialization', spec }),
      setSecondSpecialization: (spec: Specialization | null) =>
        dispatch({ type: 'setSecondSpecialization', spec }),
      setYear2Elective: (key: string, elective: ElectiveType | null) =>
        dispatch({ type: 'setYear2Elective', key, elective }),
      setYear3Elective: (key: string, elective: ElectiveType | null) =>
        dispatch({ type: 'setYear3Elective', key, elective }),
      setExchange: (exchange: ExchangeOption) => dispatch({ type: 'setExchange', exchange }),
      setInternship: (internship: boolean) => dispatch({ type: 'setInternship', internship }),
      setThesis: (thesis: ThesisOption) => dispatch({ type: 'setThesis', thesis }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  const hasProgress = useMemo(
    () =>
      Object.values(state.grades).some((grade) => grade && grade !== 'Not finished') ||
      JSON.stringify(state.config) !== JSON.stringify(emptyConfig),
    [state],
  );

  return { ...state, ...actions, hasProgress };
};

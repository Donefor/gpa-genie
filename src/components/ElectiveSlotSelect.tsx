import { useMemo } from 'react';
import { CATALOGUE } from '@/data/courseCatalogue';
import { Programme } from '@/data/programmes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const EMPTY = '__empty__';
export const OTHER_GRADED = '__other__';
export const OTHER_PASS_FAIL = '__other_pf__';

export interface ElectiveSlotValue {
  courseNo: string | null;
  type: 'Graded' | 'Pass/Fail' | null;
}

const toToken = (value: ElectiveSlotValue) => {
  if (value.courseNo) return value.courseNo;
  if (value.type === 'Pass/Fail') return OTHER_PASS_FAIL;
  if (value.type === 'Graded') return OTHER_GRADED;
  return EMPTY;
};

const fromToken = (token: string): ElectiveSlotValue => {
  if (token === EMPTY) return { courseNo: null, type: null };
  if (token === OTHER_GRADED) return { courseNo: null, type: 'Graded' };
  if (token === OTHER_PASS_FAIL) return { courseNo: null, type: 'Pass/Fail' };
  return { courseNo: token, type: 'Graded' };
};

interface ElectiveSlotSelectProps {
  programme: Programme;
  value: ElectiveSlotValue;
  onChange: (value: ElectiveSlotValue) => void;
  label: string;
}

/**
 * One control per elective slot. The programme's own department comes first,
 * because that is where most electives are taken from; anything else is an
 * unnamed elective, which is all the average needs.
 */
export const ElectiveSlotSelect = ({
  programme,
  value,
  onChange,
  label,
}: ElectiveSlotSelectProps) => {
  const department = useMemo(
    () =>
      CATALOGUE.filter((course) =>
        programme.departmentPrefixes.some((prefix) => course.courseNo.startsWith(prefix)),
      ),
    [programme],
  );

  const suggestedNos = useMemo(
    () => new Set(programme.suggested.map((s) => s.courseNo).filter(Boolean) as string[]),
    [programme],
  );

  // Courses the programme page names but that sit outside its own department.
  const alsoNamed = useMemo(
    () =>
      CATALOGUE.filter(
        (course) =>
          suggestedNos.has(course.courseNo) &&
          !programme.departmentPrefixes.some((prefix) => course.courseNo.startsWith(prefix)),
      ),
    [suggestedNos, programme],
  );

  return (
    <Select value={toToken(value)} onValueChange={(token) => onChange(fromToken(token))}>
      <SelectTrigger aria-label={label} className="h-9 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        <SelectItem value={EMPTY}>Empty slot</SelectItem>

        {department.length > 0 && (
          <SelectGroup>
            <SelectLabel>Courses in your department</SelectLabel>
            {department.map((course) => (
              <SelectItem key={course.courseNo} value={course.courseNo}>
                {course.name} · {course.credits}
                {!course.creditsKnown && '*'} ECTS
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {alsoNamed.length > 0 && (
          <SelectGroup>
            <SelectLabel>Also suggested for this programme</SelectLabel>
            {alsoNamed.map((course) => (
              <SelectItem key={course.courseNo} value={course.courseNo}>
                {course.name} · {course.credits}
                {!course.creditsKnown && '*'} ECTS
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        <SelectGroup>
          <SelectLabel>Somewhere else</SelectLabel>
          <SelectItem value={OTHER_GRADED}>Elective · graded · 7.5 ECTS</SelectItem>
          <SelectItem value={OTHER_PASS_FAIL}>Elective · Pass/Fail · 7.5 ECTS</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

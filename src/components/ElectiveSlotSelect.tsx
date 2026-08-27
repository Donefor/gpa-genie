import { useMemo } from 'react';
import { CatalogueCourse, coursesInPeriods } from '@/data/courseCatalogue';
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
  /** Only courses that run in these periods are offered. */
  periods: number[];
  /** Course number -> where it is already spent. */
  taken: Map<string, string>;
  /** This slot's own key, so its own choice stays selectable. */
  slotKey: string;
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
  periods,
  taken,
  slotKey,
}: ElectiveSlotSelectProps) => {
  // A course only runs when it runs: offering it in a period it is not given
  // in would let someone build a plan they cannot actually take.
  const available = useMemo(() => coursesInPeriods(periods), [periods]);

  const department = useMemo(
    () =>
      available.filter((course) =>
        programme.departmentPrefixes.some((prefix) => course.courseNo.startsWith(prefix)),
      ),
    [available, programme],
  );

  const suggestedNos = useMemo(
    () => new Set(programme.suggested.map((s) => s.courseNo).filter(Boolean) as string[]),
    [programme],
  );

  // Courses the programme page names but that sit outside its own department.
  const alsoNamed = useMemo(
    () =>
      available.filter(
        (course) =>
          suggestedNos.has(course.courseNo) &&
          !programme.departmentPrefixes.some((prefix) => course.courseNo.startsWith(prefix)),
      ),
    [available, suggestedNos, programme],
  );

  const renderCourse = (course: CatalogueCourse) => {
    const where = taken.get(course.courseNo);
    // Its own choice must stay selectable, or the slot could not show it.
    const spent = !!where && where !== slotKey;
    return (
      <SelectItem key={course.courseNo} value={course.courseNo} disabled={spent}>
        {course.name} · {course.credits}
        {!course.creditsKnown && '*'} ECTS
        {spent && (where === 'mandatory' ? ' · already required' : ' · already chosen')}
      </SelectItem>
    );
  };

  return (
    <Select value={toToken(value)} onValueChange={(token) => onChange(fromToken(token))}>
      <SelectTrigger aria-label={label} className="h-9 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        <SelectItem value={EMPTY}>Empty slot</SelectItem>

        {/* First, because it is the answer most of the time: the course does
            not need naming for the average to be right. */}
        <SelectGroup>
          <SelectLabel>Generic elective</SelectLabel>
          <SelectItem value={OTHER_GRADED}>Graded · 7.5 ECTS</SelectItem>
          <SelectItem value={OTHER_PASS_FAIL}>Pass/Fail · 7.5 ECTS</SelectItem>
        </SelectGroup>

        {department.length > 0 && (
          <SelectGroup>
            <SelectLabel>Courses in your department</SelectLabel>
            {department.map(renderCourse)}
          </SelectGroup>
        )}

        {alsoNamed.length > 0 && (
          <SelectGroup>
            <SelectLabel>Also suggested for this programme</SelectLabel>
            {alsoNamed.map(renderCourse)}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

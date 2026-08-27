import { ElectiveType, Grade, GradeMap, ProgramConfig } from '@/types';
import { Programme } from '@/data/programmes';
import {
  BuiltTerm,
  departmentElectiveCount,
  REQUIRED_DEPARTMENT_ELECTIVES,
} from '@/utils/programmeModel';
import { gradeOf } from '@/utils/calculations';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GradeSelect } from './GradeSelect';
import { ElectiveSlotSelect, ElectiveSlotValue } from './ElectiveSlotSelect';

const UNCHOSEN = '__unchosen__';

interface MasterYearTwoProps {
  programme: Programme;
  config: ProgramConfig;
  terms: BuiltTerm[];
  grades: GradeMap;
  taken: Map<string, string>;
  onGradeChange: (id: string, grade: Grade) => void;
  onElectiveChange: (key: string, type: ElectiveType | null) => void;
  onElectiveCourseChange: (key: string, courseNo: string | null) => void;
  onThesisChange: (half: 'fall' | 'spring' | null) => void;
  onExchangeChange: (half: 'none' | 'fall' | 'spring') => void;
}

/**
 * The second year of a master's is a thesis, possibly an exchange, and some
 * electives. Presented as one list rather than four period cards — the periods
 * still decide which courses a slot may offer, but they are not a structure the
 * student has to navigate.
 */
export const MasterYearTwo = ({
  programme,
  config,
  terms,
  grades,
  taken,
  onGradeChange,
  onElectiveChange,
  onElectiveCourseChange,
  onThesisChange,
  onExchangeChange,
}: MasterYearTwoProps) => {
  const thesisChosen = config.mscThesis !== null;
  const fromDepartment = departmentElectiveCount(programme, config);

  const slots = terms.flatMap((term) =>
    term.electiveKeys.map((key) => ({ key, period: term.periods[0] })),
  );

  const thesis = terms.flatMap((t) => t.courses).find((c) => c.kind === 'thesis');
  const exchangeCredits = terms
    .flatMap((t) => t.courses)
    .filter((c) => c.kind === 'exchange')
    .reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-md bg-muted/50 p-3 sm:grid-cols-2 sm:p-4">
        <div>
          <span className="field-label">Thesis</span>
          <Select
            value={config.mscThesis ?? UNCHOSEN}
            onValueChange={(v) => onThesisChange(v === UNCHOSEN ? null : (v as 'fall' | 'spring'))}
          >
            <SelectTrigger
              aria-label="Thesis"
              className={cn('h-9 w-full', !thesisChosen && 'border-warning')}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNCHOSEN}>Choose a semester</SelectItem>
              <SelectItem value="fall">Autumn</SelectItem>
              <SelectItem value="spring">Spring</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-[0.8125rem] text-foreground/70">Required · 30 ECTS</p>
        </div>

        <div>
          <span className="field-label">Exchange</span>
          <Select
            value={config.mscExchange}
            onValueChange={(v) => onExchangeChange(v as 'none' | 'fall' | 'spring')}
          >
            <SelectTrigger aria-label="Exchange" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No exchange</SelectItem>
              <SelectItem value="fall" disabled={config.mscThesis === 'fall'}>
                Autumn
              </SelectItem>
              <SelectItem value="spring" disabled={config.mscThesis === 'spring'}>
                Spring
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-[0.8125rem] text-foreground/70">Optional · Pass/Fail</p>
        </div>
      </div>

      {slots.length > 0 && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h4 className="text-base font-semibold tracking-tight">
              Electives
              <span className="ml-2 numeric text-sm font-normal text-foreground/60">
                {slots.length} to choose
              </span>
            </h4>
            <p className="numeric text-[0.8125rem] text-foreground/70">
              <span className={cn(fromDepartment >= REQUIRED_DEPARTMENT_ELECTIVES && 'font-semibold text-[var(--olive)]')}>
                {fromDepartment} of {REQUIRED_DEPARTMENT_ELECTIVES}
              </span>{' '}
              from your department
            </p>
          </div>
          <ul className="mt-2 flex flex-col gap-2">
            {slots.map(({ key, period }) => (
              <li key={key} className="flex flex-wrap items-center gap-2">
                <span className="numeric w-16 shrink-0 text-sm text-foreground/60">
                  Period {period}
                </span>
                <div className="min-w-0 flex-1">
                  <ElectiveSlotSelect
                    programme={programme}
                    label={`Elective in period ${period}`}
                    periods={[period]}
                    taken={taken}
                    slotKey={key}
                    value={{
                      courseNo: config.programmeElectiveCourses[key] ?? null,
                      type: config.programmeElectives[key] ?? null,
                    }}
                    onChange={(next: ElectiveSlotValue) => {
                      onElectiveCourseChange(key, next.courseNo);
                      onElectiveChange(key, next.type);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(thesis || exchangeCredits > 0) && (
        <ul className="flex flex-col">
          {thesis && (
            <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border px-1 py-2 first:border-t-0">
              <div className="min-w-0 flex-1 basis-full sm:basis-0">
                <p className="text-sm font-medium">Master's thesis</p>
                <p className="numeric mt-0.5 text-xs text-foreground/60">
                  Thesis · 30 ECTS · {config.mscThesis === 'fall' ? 'autumn' : 'spring'}
                </p>
              </div>
              <div className="w-full sm:w-[176px]">
                <GradeSelect
                  value={gradeOf(grades, thesis.id)}
                  onChange={(next) => onGradeChange(thesis.id, next)}
                  label="Grade for the thesis"
                />
              </div>
            </li>
          )}
          {exchangeCredits > 0 && (
            <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border px-1 py-2 first:border-t-0">
              <div className="min-w-0 flex-1 basis-full sm:basis-0">
                <p className="text-sm font-medium">Exchange</p>
                <p className="numeric mt-0.5 text-xs text-foreground/60">
                  Exchange · {exchangeCredits} ECTS ·{' '}
                  {config.mscExchange === 'fall' ? 'autumn' : 'spring'}
                </p>
              </div>
              <div className="w-full sm:w-[176px]">
                <div className="flex h-9 items-center justify-center rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground">
                  Pass/Fail
                </div>
              </div>
            </li>
          )}
        </ul>
      )}

      {!thesisChosen && (
        <p className="text-sm text-foreground/70">
          Choose a thesis semester to see what is left for electives.
        </p>
      )}
    </div>
  );
};

import { ElectiveType, Grade, GradeMap } from '@/types';
import { BuiltTerm } from '@/utils/programmeModel';
import { gradeOf, sumCredits } from '@/utils/calculations';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Programme } from '@/data/programmes';
import { catalogueCourse } from '@/data/courseCatalogue';
import { GradeSelect } from './GradeSelect';
import { ElectiveSlotSelect, ElectiveSlotValue } from './ElectiveSlotSelect';

const KIND_LABEL: Record<string, string> = {
  core: 'Course',
  thesis: 'Thesis',
  elective: 'Elective',
};

interface TermCardProps {
  term: BuiltTerm;
  grades: GradeMap;
  onGradeChange: (id: string, grade: Grade) => void;
  onElectiveChange: (key: string, type: ElectiveType | null) => void;
  onChoiceToggle: (key: string, taken: boolean) => void;
  onElectiveCourseChange: (key: string, courseNo: string | null) => void;
  electives: Record<string, ElectiveType | null>;
  electiveCourses: Record<string, string | null>;
  programme: Programme;
  /** Course number -> where it is already spent in this programme. */
  taken: Map<string, string>;
}

export const TermCard = ({
  term,
  grades,
  onGradeChange,
  onElectiveChange,
  onChoiceToggle,
  onElectiveCourseChange,
  electives,
  electiveCourses,
  programme,
  taken,
}: TermCardProps) => {
  const credits = sumCredits(term.courses);
  const isFull = Math.abs(credits - term.credits) < 0.01;
  const over = credits > term.credits;

  return (
    <section className="rounded-md border border-border p-3 sm:p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-base font-semibold tracking-tight">{term.label}</h4>
        <span
          className={cn(
            'numeric text-xs',
            over ? 'font-medium text-destructive' : 'text-muted-foreground',
          )}
        >
          {credits} / {term.credits} ECTS
        </span>
      </header>

      {term.choose && term.choices.length > 0 && (
        <div className="mb-3 rounded-md bg-muted/50 p-3">
          <p className="mb-2 text-sm text-foreground/80">
            Choose {term.choose.pick} of these {term.choose.outOf}. Tick the ones you took.
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {term.choices.map(({ course, key, taken }) => (
              <li key={key} className="flex items-start gap-2">
                <Checkbox
                  id={key}
                  checked={taken}
                  onCheckedChange={(v) => onChoiceToggle(key, v === true)}
                  className="mt-0.5"
                />
                <label htmlFor={key} className="cursor-pointer text-sm leading-snug">
                  {course.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {term.electiveKeys.length > 0 && (
        <div className="mb-3 rounded-md bg-muted/50 p-3">
          <p className="mb-2 text-sm text-foreground/80">
            {term.electiveKeys.length} elective{term.electiveKeys.length > 1 ? 's' : ''} to fill.
            A generic elective is enough for the average; name the course to use
            its real credits.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {term.electiveKeys.map((key, index) => (
              <ElectiveSlotSelect
                key={key}
                programme={programme}
                label={`Elective ${index + 1} in ${term.label}`}
                periods={term.periods}
                taken={taken}
                slotKey={key}
                value={{
                  courseNo: electiveCourses[key] ?? null,
                  type: electives[key] ?? null,
                }}
                onChange={(next: ElectiveSlotValue) => {
                  onElectiveCourseChange(key, next.courseNo);
                  onElectiveChange(key, next.type);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {term.courses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          Nothing selected for this term yet.
        </p>
      ) : (
        <ul className="flex flex-col">
          {term.courses.map((course, index) => {
            const runs = course.courseNo ? catalogueCourse(course.courseNo)?.periods : undefined;
            return (
            <li
              key={`${course.id}-${index}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border px-1 py-2 first:border-t-0"
            >
              <div className="min-w-0 flex-1 basis-full sm:basis-0">
                <p className="text-sm font-medium leading-snug">{course.name}</p>
                <p className="numeric mt-0.5 text-xs text-foreground/60">
                  {KIND_LABEL[course.kind] ?? 'Course'} · {course.credits} ECTS
                  {runs?.length ? ` · period ${runs.join('/')}` : ''}
                </p>
              </div>
              <div className="w-full sm:w-[176px]">
                {course.isPassFail ? (
                  <div className="flex h-9 items-center justify-center rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground">
                    Pass/Fail
                  </div>
                ) : (
                  <GradeSelect
                    value={gradeOf(grades, course.id)}
                    onChange={(next) => onGradeChange(course.id, next)}
                    label={`Grade for ${course.name}`}
                  />
                )}
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

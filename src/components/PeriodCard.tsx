import { ReactNode } from 'react';
import { Course, CourseKind, Grade, GradeMap } from '@/types';
import { PERIOD_CREDITS } from '@/data/courseData';
import { gradeOf, sumCredits } from '@/utils/calculations';
import { cn } from '@/lib/utils';
import { GradeSelect } from './GradeSelect';

const KIND_LABEL: Record<CourseKind, string> = {
  core: 'Core course',
  specialization: 'Specialisation',
  elective: 'Elective',
  thesis: 'Thesis',
  exchange: 'Exchange',
  internship: 'Internship',
};

interface PeriodCardProps {
  title: string;
  courses: Course[];
  grades: GradeMap;
  onGradeChange: (id: string, grade: Grade) => void;
  /** Option controls rendered above the course list. */
  controls?: ReactNode;
  emptyMessage?: string;
}

export const PeriodCard = ({
  title,
  courses,
  grades,
  onGradeChange,
  controls,
  emptyMessage = 'Nothing scheduled for this period yet.',
}: PeriodCardProps) => {
  const credits = sumCredits(courses);
  const isComplete = credits === PERIOD_CREDITS;
  const isOverloaded = credits > PERIOD_CREDITS;

  return (
    <section className="rounded-md border border-border p-3 sm:p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-base font-semibold tracking-tight">{title}</h4>
        <span
          className={cn(
            'numeric text-xs',
            isOverloaded ? 'font-medium text-destructive' : 'text-muted-foreground',
          )}
          title={
            isComplete
              ? 'This period is fully scheduled'
              : `A full period is ${PERIOD_CREDITS} ECTS`
          }
        >
          {credits} / {PERIOD_CREDITS} ECTS
        </span>
      </header>

      {controls}

      {courses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col">
          {courses.map((course, index) => {
            const grade = gradeOf(grades, course.id);
            return (
              <li
                key={`${course.id}-${index}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border px-1 py-2 first:border-t-0"
              >
                <div className="min-w-0 flex-1 basis-full sm:basis-0">
                  <p className="text-sm font-medium leading-snug">{course.name}</p>
                  <p className="numeric mt-0.5 text-xs text-foreground/60">
                    {KIND_LABEL[course.kind]} · {course.credits} ECTS
                    {course.kind === 'thesis' && ' · spans both periods'}
                  </p>
                </div>

                <div className="w-full sm:w-[176px]">
                  {course.isPassFail ? (
                    <div className="flex h-9 items-center justify-center rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground">
                      Pass/Fail
                    </div>
                  ) : (
                    <GradeSelect
                      value={grade}
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

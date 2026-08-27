import { ReactNode } from 'react';
import { Grade, GradeMap, Period } from '@/types';
import { PERIOD_LABELS, YEAR_LABELS } from '@/data/courseData';
import { calculateStats, formatGpa } from '@/utils/calculations';
import { flattenPeriods } from '@/utils/program';
import { cn } from '@/lib/utils';
import { PeriodCard } from './PeriodCard';

interface YearCardProps {
  year: 1 | 2 | 3;
  periods: Period[];
  grades: GradeMap;
  onGradeChange: (id: string, grade: Grade) => void;
  /** Option controls rendered inside a given period (1-indexed). */
  periodControls?: Record<number, ReactNode>;
  /** Controls rendered directly under the year header. */
  headerControls?: ReactNode;
  emptyMessages?: Record<number, string>;
}

export const YearCard = ({
  year,
  periods,
  grades,
  onGradeChange,
  periodControls = {},
  headerControls,
  emptyMessages = {},
}: YearCardProps) => {
  const stats = calculateStats(flattenPeriods(periods), grades);
  const hasGrades = stats.gradedCredits > 0;

  return (
    <section className="surface-card overflow-hidden" id={`year-${year}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{YEAR_LABELS[year]}</h2>
          <p className="numeric mt-0.5 text-xs text-muted-foreground">
            {stats.completedCredits} of {stats.plannedCredits} ECTS completed
            {stats.pendingCourses > 0 && ` · ${stats.pendingCourses} awaiting a grade`}
          </p>
        </div>
        <div className="text-right" data-hj-suppress>
          <p className="text-xs text-muted-foreground">Year GPA</p>
          <p
            className={cn(
              'numeric text-lg font-semibold',
              !hasGrades && 'text-muted-foreground/70',
            )}
          >
            {hasGrades ? formatGpa(stats.gpa) : '—'}
          </p>
        </div>
      </header>

      <div className="space-y-4 p-3 sm:p-5">
        {headerControls}
        {periods.map((period) => (
          <PeriodCard
            key={period.index}
            title={PERIOD_LABELS[period.index - 1]}
            courses={period.courses}
            grades={grades}
            onGradeChange={onGradeChange}
            controls={periodControls[period.index]}
            emptyMessage={emptyMessages[period.index]}
          />
        ))}
      </div>
    </section>
  );
};

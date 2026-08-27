import { Course, GradeMap } from '@/types';
import { calculateStats, formatGpa } from '@/utils/calculations';
import { cn } from '@/lib/utils';

interface GpaSummaryProps {
  courses: Course[];
  grades: GradeMap;
  perYear: { year: number; gpa: number; graded: boolean }[];
}

export const GpaSummary = ({ courses, grades, perYear }: GpaSummaryProps) => {
  const stats = calculateStats(courses, grades);
  const hasGrades = stats.gradedCredits > 0;

  return (
    <section className="surface-card flex flex-wrap items-end justify-between gap-6 p-5 sm:p-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Cumulative GPA</p>
        <p
          className={cn(
            'numeric mt-1 text-4xl font-semibold leading-none sm:text-5xl',
            !hasGrades && 'text-muted-foreground/70',
          )}
        >
          {hasGrades ? formatGpa(stats.gpa) : '0.00'}
        </p>
        <p className="numeric mt-2 text-xs text-muted-foreground">
          {hasGrades
            ? `${stats.gradedCredits} graded ECTS · ${stats.completedCredits} completed`
            : 'Enter a grade to get started'}
        </p>
      </div>

      <dl className="flex gap-6">
        {perYear.map((year) => (
          <div key={year.year} className="text-right">
            <dt className="text-xs text-muted-foreground">Year {year.year}</dt>
            <dd
              className={cn(
                'numeric mt-0.5 text-lg font-medium',
                !year.graded && 'text-muted-foreground/70',
              )}
            >
              {year.graded ? formatGpa(year.gpa) : '—'}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

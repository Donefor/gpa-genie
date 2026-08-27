import { useMemo } from 'react';
import { ElectiveType, Grade, GradeMap, ProgramConfig } from '@/types';
import { Programme } from '@/data/programmes';
import { buildProgrammeTerms, flattenTerms, groupByYear } from '@/utils/programmeModel';
import { calculateStats, formatGpa } from '@/utils/calculations';
import { cn } from '@/lib/utils';
import { TermCard } from './TermCard';

interface ProgrammeViewProps {
  programme: Programme;
  config: ProgramConfig;
  grades: GradeMap;
  onGradeChange: (id: string, grade: Grade) => void;
  onElectiveChange: (key: string, type: ElectiveType | null) => void;
  onChoiceToggle: (key: string, taken: boolean) => void;
  onElectiveCourseChange: (key: string, courseNo: string | null) => void;
}

export const ProgrammeView = ({
  programme,
  config,
  grades,
  onGradeChange,
  onElectiveChange,
  onChoiceToggle,
  onElectiveCourseChange,
}: ProgrammeViewProps) => {
  const terms = useMemo(
    () => buildProgrammeTerms(programme, config),
    [programme, config],
  );
  const years = useMemo(() => groupByYear(terms), [terms]);

  return (
    <div className="space-y-8">
      {programme.note && (
        <p className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {programme.note}
        </p>
      )}

      {years.map(({ year, terms: yearTerms }) => {
        const courses = flattenTerms(yearTerms);
        const stats = calculateStats(courses, grades);
        const hasGrades = stats.gradedCredits > 0;
        // Against what the year is worth, not what has been filled in so far:
        // empty elective slots would otherwise make a 60 ECTS year read as 30.
        const capacity = yearTerms.reduce((sum, term) => sum + term.credits, 0);

        return (
          <section key={year} className="surface-card overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-base font-semibold tracking-tight">{year}</h2>
                <p className="numeric mt-0.5 text-xs text-muted-foreground">
                  {stats.completedCredits} of {capacity} ECTS completed
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
              {yearTerms.map((term) => (
                <TermCard
                  key={term.key}
                  term={term}
                  grades={grades}
                  electives={config.programmeElectives}
                  electiveCourses={config.programmeElectiveCourses}
                  programme={programme}
                  onElectiveCourseChange={onElectiveCourseChange}
                  onGradeChange={onGradeChange}
                  onElectiveChange={onElectiveChange}
                  onChoiceToggle={onChoiceToggle}
                />
              ))}
            </div>
          </section>
        );
      })}

      {programme.source && (
        <p className="text-center text-xs text-muted-foreground">
          Structure from{' '}
          <a
            href={programme.source}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            the programme page at hhs.se
          </a>
          . Year 2 electives are yours to fill in.
        </p>
      )}
    </div>
  );
};

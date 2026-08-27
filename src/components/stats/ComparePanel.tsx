import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { COURSE_RECORDS, StatGrade } from '@/data/gradeStats';
import {
  aggregate,
  averageGradePoint,
  byTerm,
  formatPercent,
  summarise,
  weightedPassRate,
} from '@/utils/statsMath';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BAND_COLOR, BAND_ORDER } from './bands';
import { BandLegend } from './BandLegend';

const MAX_COMPARE = 4;

/**
 * Best value in a column, compared at the precision actually shown — otherwise
 * two rows can display 4.14 and only one gets marked.
 */
const bestOf = (values: (number | null)[], decimals: number) => {
  const present = values
    .filter((v): v is number => v !== null)
    .map((v) => Number(v.toFixed(decimals)));
  return present.length === 0 ? null : Math.max(...present);
};

const isBest = (value: number | null, best: number | null, decimals: number) =>
  value !== null && best !== null && Number(value.toFixed(decimals)) === best;

/**
 * Marks the leading value in a column. The "best" label carries the meaning,
 * so the highlight never has to be read as colour alone.
 */
const BestValue = ({ text, best }: { text: string; best: boolean }) => {
  if (!best) return <span className="text-muted-foreground">{text}</span>;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--sage)]/35 px-2 py-0.5 font-semibold text-foreground ring-1 ring-inset ring-[var(--sage)]">
      {text}
      <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--olive)]">
        best
      </span>
    </span>
  );
};

export const ComparePanel = () => {
  const [query, setQuery] = useState('');
  // Kept in the URL so a comparison can be shared as a link.
  const [params, setParams] = useSearchParams();
  const picked = useMemo(() => {
    const raw = params.get('compare');
    return raw ? raw.split('~').filter(Boolean).slice(0, MAX_COMPARE) : [];
  }, [params]);

  const setPicked = useCallback(
    (next: string[]) => {
      const updated = new URLSearchParams(params);
      if (next.length) updated.set('compare', next.join('~'));
      else updated.delete('compare');
      setParams(updated, { replace: true });
    },
    [params, setParams],
  );

  const summaries = useMemo(() => summarise(COURSE_RECORDS), []);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return summaries.slice(0, 12);
    return summaries
      .filter((item) => item.course.toLowerCase().includes(q))
      .slice(0, 12);
  }, [summaries, query]);

  const toggle = (course: string) =>
    setPicked(
      picked.includes(course)
        ? picked.filter((name) => name !== course)
        : picked.length >= MAX_COMPARE
          ? picked
          : [...picked, course],
    );

  const columns = useMemo(
    () =>
      picked.map((course) => {
        const records = COURSE_RECORDS.filter((record) => record.course === course);
        const distribution = aggregate(records);
        return {
          course,
          records,
          distribution,
          average: averageGradePoint(distribution),
          passRate: weightedPassRate(records),
          registered: records.reduce((sum, record) => sum + record.registered, 0),
          rounds: byTerm(records).length,
        };
      }),
    [picked],
  );

  const bestAverage = bestOf(columns.map((c) => c.average), 2);
  const bestPass = bestOf(columns.map((c) => c.passRate), 1);
  const bestExcellent = bestOf(columns.map((c) => c.distribution?.Excellent ?? null), 1);

  return (
    <div className="space-y-6">
      <section className="surface-card p-4 sm:p-5">
        <h2 className="text-lg tracking-tight">On the fence between courses?</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick up to {MAX_COMPARE} courses to see how they have actually been graded, side
          by side. Pass/Fail courses publish no distribution and will show a dash.
        </p>

        <div className="mt-4 max-w-md">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses to add"
              aria-label="Search courses to compare"
              className="h-9 pl-9"
            />
          </label>
        </div>

        {picked.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {picked.map((course) => (
              <li key={course}>
                <button
                  type="button"
                  onClick={() => toggle(course)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs transition-colors hover:text-foreground"
                >
                  {course}
                  <X className="h-3 w-3" aria-hidden />
                  <span className="sr-only">Remove {course}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-3 flex flex-wrap gap-2">
          {matches.map((item) => {
            const active = picked.includes(item.course);
            const full = picked.length >= MAX_COMPARE && !active;
            return (
              <li key={item.course}>
                <button
                  type="button"
                  onClick={() => toggle(item.course)}
                  disabled={full}
                  className={cn(
                    'rounded border px-2.5 py-1 text-xs transition-colors',
                    active
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                    full && 'cursor-not-allowed opacity-40',
                  )}
                >
                  {item.course}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {columns.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-12 text-center text-sm text-muted-foreground">
          Add a course above to start comparing.
        </p>
      ) : (
        <>
          <section className="surface-card p-4 sm:p-5">
            <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-tight">
                Grade distribution, all rounds pooled
              </h3>
              <BandLegend />
            </header>

            <div className="flex flex-col gap-3">
              {columns.map((column) => {
                const dist = column.distribution;
                const total = dist
                  ? BAND_ORDER.reduce((sum, band) => sum + dist[band], 0)
                  : 0;
                return (
                  <div key={column.course} className="flex flex-wrap items-center gap-3">
                    <span className="w-full truncate text-xs sm:w-52" title={column.course}>
                      {column.course}
                    </span>
                    {dist && total > 0 ? (
                      <div className="flex h-6 min-w-0 flex-1 gap-[2px] overflow-hidden rounded">
                        {BAND_ORDER.map((band: StatGrade) => {
                          const value = dist[band];
                          if (value <= 0) return null;
                          return (
                            <div
                              key={band}
                              className="h-full first:rounded-l last:rounded-r"
                              style={{
                                width: `${(value / total) * 100}%`,
                                background: BAND_COLOR[band],
                              }}
                              title={`${band}: ${value.toFixed(1)}%`}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex h-6 flex-1 items-center rounded border border-dashed border-border px-2 text-xs text-muted-foreground">
                        Pass/Fail — no distribution published
                      </div>
                    )}
                    <span className="numeric w-28 shrink-0 whitespace-nowrap text-right text-xs">
                      <BestValue
                        text={column.average === null ? '—' : `avg ${column.average.toFixed(2)}`}
                        best={columns.length > 1 && isBest(column.average, bestAverage, 2)}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-card p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-semibold tracking-tight">Side by side</h3>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-right">Rounds</TableHead>
                    <TableHead className="text-right">Registered</TableHead>
                    <TableHead className="text-right">Pass rate</TableHead>
                    <TableHead className="text-right">Excellent</TableHead>
                    <TableHead className="text-right">Avg. grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columns.map((column) => {
                    const excellent = column.distribution?.Excellent ?? null;
                    const many = columns.length > 1;
                    return (
                      <TableRow key={column.course}>
                        <TableCell className="font-medium">{column.course}</TableCell>
                        <TableCell className="numeric text-right">{column.rounds}</TableCell>
                        <TableCell className="numeric text-right">
                          {column.registered.toLocaleString()}
                        </TableCell>
                        <TableCell className="numeric text-right">
                          <BestValue
                            text={formatPercent(column.passRate)}
                            best={many && isBest(column.passRate, bestPass, 1)}
                          />
                        </TableCell>
                        <TableCell className="numeric text-right">
                          <BestValue
                            text={excellent === null ? '—' : `${excellent.toFixed(1)}%`}
                            best={many && isBest(excellent, bestExcellent, 1)}
                          />
                        </TableCell>
                        <TableCell className="numeric text-right">
                          <BestValue
                            text={column.average === null ? '—' : column.average.toFixed(2)}
                            best={many && isBest(column.average, bestAverage, 2)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

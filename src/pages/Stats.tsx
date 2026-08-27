import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { COURSE_RECORDS, STATS_GENERATED, StatGrade } from '@/data/gradeStats';
import {
  aggregate,
  averageGradePoint,
  byTerm,
  formatPercent,
  summarise,
  weightedPassRate,
} from '@/utils/statsMath';
import { AppHeader } from '@/components/AppHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AverageTrend } from '@/components/stats/AverageTrend';
import { BandLegend } from '@/components/stats/BandLegend';
import { DistributionBars } from '@/components/stats/DistributionBars';
import { BAND_COLOR, BAND_ORDER } from '@/components/stats/bands';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisPanel } from '@/components/stats/AnalysisPanel';
import { ComparePanel } from '@/components/stats/ComparePanel';
import { ExportPanel } from '@/components/stats/ExportPanel';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PERIOD_FILTERS = [
  { value: 'all', label: 'All' },
  { value: '1', label: 'P1' },
  { value: '2', label: 'P2' },
  { value: '3', label: 'P3' },
  { value: '4', label: 'P4' },
];

const Stats = () => {
  const [query, setQuery] = useState('');
  // Kept in the URL so a course's statistics can be linked to directly.
  const [params, setParams] = useSearchParams();
  const selected = params.get('course');

  const select = useCallback(
    (course: string | null) => {
      const next = new URLSearchParams(params);
      if (course) next.set('course', course);
      else next.delete('course');
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const view = params.get('view');
  const tab = view === 'analysis' || view === 'compare' ? view : 'courses';
  const setTab = useCallback(
    (value: string) => {
      const next = new URLSearchParams(params);
      if (value === 'courses') next.delete('view');
      else next.set('view', value);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const period = params.get('period') ?? 'all';
  const setPeriod = useCallback(
    (value: string) => {
      const next = new URLSearchParams(params);
      if (value === 'all') next.delete('period');
      else next.set('period', value);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  // The period filter narrows which rounds count toward the browse list.
  const scoped = useMemo(
    () =>
      period === 'all'
        ? COURSE_RECORDS
        : COURSE_RECORDS.filter((record) => String(record.period) === period),
    [period],
  );

  const summaries = useMemo(() => summarise(scoped), [scoped]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return summaries;
    return summaries.filter(
      (item) =>
        item.course.toLowerCase().includes(q) || item.courseNo.toLowerCase().includes(q),
    );
  }, [summaries, query]);

  const courseRecords = useMemo(
    () => (selected ? scoped.filter((record) => record.course === selected) : []),
    [selected, scoped],
  );
  const slices = useMemo(() => byTerm(courseRecords), [courseRecords]);
  const courseDist = useMemo(() => aggregate(courseRecords), [courseRecords]);

  const totals = useMemo(
    () => ({
      courses: summaries.length,
      records: scoped.length,
      registered: scoped.reduce((sum, record) => sum + record.registered, 0),
      passRate: weightedPassRate(scoped),
    }),
    [summaries, scoped],
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Grade Statistics
          </h1>
          <p className="numeric mt-2 text-sm text-muted-foreground">
            {totals.courses} courses · {totals.records} course rounds ·{' '}
            {totals.registered.toLocaleString()} registrations · overall pass rate{' '}
            {formatPercent(totals.passRate)} · published {STATS_GENERATED}
          </p>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-0">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <aside>
                <label className="relative block">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search courses"
                    aria-label="Search courses"
                    className="h-9 pl-9"
                  />
                </label>

                <div className="mt-3">
                  <span className="field-label">Study period</span>
                  <div className="flex flex-wrap gap-1">
                    {PERIOD_FILTERS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPeriod(option.value)}
                        aria-pressed={period === option.value}
                        className={cn(
                          'rounded border px-2.5 py-1 text-xs transition-colors',
                          period === option.value
                            ? 'border-transparent bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="numeric mt-3 text-xs text-muted-foreground">
                  {matches.length} of {summaries.length} courses
                </p>

                <ul className="mt-2 max-h-[560px] divide-y divide-border overflow-y-auto rounded-md border border-border">
                  {matches.map((item) => (
                    <li key={item.course}>
                      <button
                        type="button"
                        onClick={() => select(selected === item.course ? null : item.course)}
                        className={cn(
                          'flex w-full flex-col gap-0.5 px-3 py-2 text-left transition-colors hover:bg-muted',
                          selected === item.course && 'bg-muted',
                        )}
                        aria-pressed={selected === item.course}
                      >
                        <span className="text-sm leading-snug">{item.course}</span>
                        <span className="numeric text-xs text-muted-foreground">
                          {item.terms} {item.terms === 1 ? 'round' : 'rounds'} ·{' '}
                          {item.registered.toLocaleString()} reg. ·{' '}
                          {item.isPassFail ? 'Pass/Fail' : `avg ${item.average!.toFixed(2)}`}
                        </span>
                      </button>
                    </li>
                  ))}
                  {matches.length === 0 && (
                    <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No courses match this filter.
                    </li>
                  )}
                </ul>
              </aside>

              <div className="min-w-0">
                {selected ? (
                  <CourseDetail
                    course={selected}
                    slices={slices}
                    distribution={courseDist}
                    registered={courseRecords.reduce((sum, r) => sum + r.registered, 0)}
                    passRate={weightedPassRate(courseRecords)}
                  />
                ) : (
                  <OverviewTable summaries={matches.slice(0, 40)} total={matches.length} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <AnalysisPanel
              onSelect={(course) => {
                const next = new URLSearchParams(params);
                next.set('course', course);
                next.delete('view');
                setParams(next, { replace: true });
              }}
            />
          </TabsContent>

          <TabsContent value="compare" className="mt-0">
            <ComparePanel />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <ExportPanel />
        </div>

      </main>

      <SiteFooter />
    </div>
  );
};

const CourseDetail = ({
  course,
  slices,
  distribution,
  registered,
  passRate,
}: {
  course: string;
  slices: ReturnType<typeof byTerm>;
  distribution: Record<StatGrade, number> | null;
  registered: number;
  passRate: number | null;
}) => {
  const average = averageGradePoint(distribution);

  return (
    <div className="space-y-6">
      <section className="surface-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold tracking-tight">{course}</h2>
        <dl className="numeric mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Rounds" value={String(slices.length)} />
          <Stat label="Registered" value={registered.toLocaleString()} />
          <Stat label="Pass rate" value={formatPercent(passRate)} />
          <Stat label="Avg. grade" value={average === null ? '—' : average.toFixed(2)} />
        </dl>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight">Grade distribution by round</h3>
          <BandLegend />
        </header>
        <DistributionBars slices={slices} />
      </section>

      {distribution && (
        <section className="surface-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold tracking-tight">
            Average grade point over time
          </h3>
          <AverageTrend slices={slices} />
        </section>
      )}

      <section className="surface-card p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold tracking-tight">All figures</h3>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Round</TableHead>
                <TableHead className="text-right">Reg.</TableHead>
                <TableHead className="text-right">Passed</TableHead>
                {BAND_ORDER.map((band) => (
                  <TableHead key={band} className="text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-sm"
                        style={{ background: BAND_COLOR[band] }}
                      />
                      {band}
                    </span>
                  </TableHead>
                ))}
                <TableHead className="text-right">Avg.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slices.map((slice) => (
                <TableRow key={slice.term}>
                  <TableCell className="numeric font-medium">{slice.label}</TableCell>
                  <TableCell className="numeric text-right">
                    {slice.registered.toLocaleString()}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {formatPercent(slice.passRate)}
                  </TableCell>
                  {BAND_ORDER.map((band) => (
                    <TableCell key={band} className="numeric text-right">
                      {slice.distribution ? `${slice.distribution[band].toFixed(1)}%` : '—'}
                    </TableCell>
                  ))}
                  <TableCell className="numeric text-right font-medium">
                    {slice.average === null ? '—' : slice.average.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

const OverviewTable = ({
  summaries,
  total,
}: {
  summaries: ReturnType<typeof summarise>;
  total: number;
}) => (
  <section className="surface-card p-4 sm:p-5">
    <header className="mb-3">
      <h2 className="text-sm font-semibold tracking-tight">All courses</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Select a course to see its distribution by round.
        {total > summaries.length && ` Showing the first ${summaries.length} of ${total}.`}
      </p>
    </header>
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead className="text-right">Rounds</TableHead>
            <TableHead className="text-right">Reg.</TableHead>
            <TableHead className="text-right">Pass rate</TableHead>
            <TableHead className="text-right">Avg.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.map((item) => (
            <TableRow key={item.course}>
              <TableCell className="max-w-[280px] truncate font-medium" title={item.course}>
                {item.course}
              </TableCell>
              <TableCell className="numeric text-right">{item.terms}</TableCell>
              <TableCell className="numeric text-right">
                {item.registered.toLocaleString()}
              </TableCell>
              <TableCell className="numeric text-right">
                {formatPercent(item.passRate)}
              </TableCell>
              <TableCell className="numeric text-right">
                {item.isPassFail ? '—' : item.average!.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </section>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-0.5 text-xl font-semibold">{value}</dd>
  </div>
);

export default Stats;

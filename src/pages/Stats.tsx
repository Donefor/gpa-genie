import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { ALL_RECORDS, StatGrade } from '@/data/gradeStats';
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
import { SortableHead } from '@/components/stats/SortableHead';
import { useSortedItems } from '@/components/stats/useTableSort';
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
        ? ALL_RECORDS
        : ALL_RECORDS.filter((record) => String(record.period) === period),
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


  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Grade Statistics
          </h1>

        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-0">
            {selected ? (
              <div>
                <button
                  type="button"
                  onClick={() => select(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  All courses
                </button>
                <CourseDetail
                  course={selected}
                  slices={slices}
                  distribution={courseDist}
                  registered={courseRecords.reduce((sum, r) => sum + r.registered, 0)}
                  passRate={weightedPassRate(courseRecords)}
                />
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block flex-1">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={`Search ${summaries.length} courses by name or code`}
                      aria-label="Search courses"
                      className="h-10 pl-9"
                    />
                  </label>

                  <div
                    className="flex items-center gap-1"
                    role="group"
                    aria-label="Filter by study period"
                  >
                    {PERIOD_FILTERS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPeriod(option.value)}
                        aria-pressed={period === option.value}
                        className={cn(
                          'h-10 rounded-md border px-3 text-sm transition-colors',
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
                  {matches.length === summaries.length
                    ? `${summaries.length} courses`
                    : `${matches.length} of ${summaries.length} courses`}
                  {period !== 'all' && ` · study period ${period} only`}
                </p>

                <div className="mt-3">
                  <CourseTable summaries={matches} onSelect={select} />
                </div>
              </div>
            )}
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

type CourseSortKey = 'course' | 'code' | 'rounds' | 'registered' | 'passRate' | 'average';

const COURSE_ACCESSORS: Record<
  CourseSortKey,
  (item: ReturnType<typeof summarise>[number]) => string | number | null
> = {
  course: (item) => item.course,
  code: (item) => Number(item.courseNo),
  rounds: (item) => item.terms,
  registered: (item) => item.registered,
  passRate: (item) => item.passRate,
  average: (item) => (item.isPassFail ? null : item.average),
};

const CourseTable = ({
  summaries,
  onSelect,
}: {
  summaries: ReturnType<typeof summarise>;
  onSelect: (course: string) => void;
}) => {
  const { key, direction, toggle, sorted } = useSortedItems(
    summaries,
    COURSE_ACCESSORS,
    'course',
  );

  if (summaries.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-16 text-center text-sm text-muted-foreground">
        No courses match this search.
      </p>
    );
  }

  const head = (column: CourseSortKey, label: string, align: 'left' | 'right' = 'right') => (
    <SortableHead
      column={column}
      active={key}
      direction={direction}
      onSort={toggle}
      align={align}
    >
      {label}
    </SortableHead>
  );

  return (
    <div className="surface-card w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {head('course', 'Course', 'left')}
            {head('code', 'Code')}
            {head('rounds', 'Rounds')}
            {head('registered', 'Registered')}
            {head('passRate', 'Pass rate')}
            {head('average', 'Avg. grade')}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item) => (
            <TableRow
              key={item.course}
              onClick={() => onSelect(item.course)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">
                <button type="button" className="text-left hover:underline">
                  {item.course}
                </button>
              </TableCell>
              <TableCell className="numeric text-right text-muted-foreground">
                {item.courseNo}
              </TableCell>
              <TableCell className="numeric text-right">{item.terms}</TableCell>
              <TableCell className="numeric text-right">
                {item.registered.toLocaleString()}
              </TableCell>
              <TableCell className="numeric text-right">{formatPercent(item.passRate)}</TableCell>
              <TableCell className="numeric text-right font-medium">
                {item.isPassFail ? '—' : item.average!.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-0.5 text-xl font-semibold">{value}</dd>
  </div>
);

export default Stats;

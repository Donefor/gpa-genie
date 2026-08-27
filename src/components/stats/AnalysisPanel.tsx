import { useMemo } from 'react';
import { COURSE_RECORDS } from '@/data/gradeStats';
import {
  analyseCourses,
  byDepartment,
  byProgramme,
  bySemester,
  degreeProjects,
} from '@/utils/analysis';
import { averageGradePoint, aggregate, formatPercent, weightedPassRate } from '@/utils/statsMath';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RankList } from './RankList';
import { SortableHead } from './SortableHead';
import { useSortedItems } from './useTableSort';

/** A course needs this many graded rounds before it can be ranked. */
const MIN_ROUNDS = 3;

export const AnalysisPanel = ({ onSelect }: { onSelect: (course: string) => void }) => {
  const analysis = useMemo(() => analyseCourses(COURSE_RECORDS), []);
  const rankable = useMemo(
    () => analysis.filter((item) => item.rounds >= MIN_ROUNDS),
    [analysis],
  );

  const topExcellent = useMemo(
    () => [...rankable].sort((a, b) => b.excellentShare - a.excellentShare).slice(0, 10),
    [rankable],
  );
  const mostVolatile = useMemo(
    () => [...rankable].sort((a, b) => b.volatility - a.volatility).slice(0, 10),
    [rankable],
  );
  const mostStable = useMemo(
    () => [...rankable].sort((a, b) => a.volatility - b.volatility).slice(0, 10),
    [rankable],
  );

  const semesters = useMemo(() => bySemester(COURSE_RECORDS), []);
  const departments = useMemo(() => byDepartment(COURSE_RECORDS), []);
  const programmes = useMemo(() => byProgramme(COURSE_RECORDS), []);
  const projects = useMemo(() => {
    const records = degreeProjects(COURSE_RECORDS);
    const grouped = new Map<string, typeof records>();
    records.forEach((record) => {
      const list = grouped.get(record.course) ?? [];
      list.push(record);
      grouped.set(record.course, list);
    });
    return [...grouped.entries()]
      .map(([course, group]) => {
        const combined = aggregate(group);
        return {
          course,
          rounds: group.length,
          registered: group.reduce((sum, r) => sum + r.registered, 0),
          excellent: combined?.Excellent ?? null,
          average: averageGradePoint(combined),
          passRate: weightedPassRate(group),
        };
      })
      .sort((a, b) => (b.average ?? 0) - (a.average ?? 0));
  }, []);

  const dept = useSortedItems(
    departments,
    {
      key: (row) => row.key,
      rounds: (row) => row.rounds,
      registered: (row) => row.registered,
      passRate: (row) => row.passRate,
      excellent: (row) => row.excellentShare,
      average: (row) => row.average,
    },
    'registered',
    'desc',
  );

  const proj = useSortedItems(
    projects,
    {
      course: (row) => row.course,
      rounds: (row) => row.rounds,
      registered: (row) => row.registered,
      passRate: (row) => row.passRate,
      excellent: (row) => row.excellent,
      average: (row) => row.average,
    },
    'average',
    'desc',
  );

  return (
    <div className="space-y-6">
      <section className="surface-card p-4 sm:p-5">
        <span aria-hidden className="block h-1 w-10 rounded-full bg-[var(--sage)]" />
        <h2 className="mt-3 text-2xl tracking-tight">What the numbers say</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Rankings cover the {rankable.length} courses with at least {MIN_ROUNDS} graded
          rounds, out of {analysis.length} graded courses in the export. Courses graded
          Pass/Fail publish no distribution and are excluded throughout.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <RankList
          title="Most Excellent grades"
          description={`Share of passing students graded Excellent, pooled across rounds. Courses with ${MIN_ROUNDS}+ rounds.`}
          items={topExcellent}
          valueOf={(item) => item.excellentShare}
          format={(value) => `${value.toFixed(1)}%`}
          onSelect={onSelect}
        />

        <RankList
          title="Most volatile grading"
          description="Standard deviation of the average grade point between rounds. Small cohorts swing more by nature, so read it alongside the registration counts."
          items={mostVolatile}
          valueOf={(item) => item.volatility}
          format={(value) => `±${value.toFixed(2)}`}
          onSelect={onSelect}
        />
      </div>

      <RankList
        title="Most consistent grading"
        description="The same measure, lowest first: courses whose grade distribution barely moves between rounds. Shown to three decimals, since the spreads here are tiny."
        items={mostStable}
        valueOf={(item) => item.volatility}
        format={(value) => `±${value.toFixed(3)}`}
        onSelect={onSelect}
      />

      <section className="surface-card p-4 sm:p-5">
        <span aria-hidden className="block h-1 w-10 rounded-full bg-[var(--sage)]" />
        <h3 className="mt-3 text-xl tracking-tight">Autumn versus spring</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Periods 1 and 2 run in the autumn, periods 3 and 4 in the spring. All graded
          rounds pooled.
        </p>
        <div className="mt-4 w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead className="text-right">Rounds</TableHead>
                <TableHead className="text-right">Registered</TableHead>
                <TableHead className="text-right">Pass rate</TableHead>
                <TableHead className="text-right">Excellent</TableHead>
                <TableHead className="text-right">Avg. grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semesters.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.key}</TableCell>
                  <TableCell className="numeric text-right">{row.rounds}</TableCell>
                  <TableCell className="numeric text-right">
                    {row.registered.toLocaleString()}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {formatPercent(row.passRate)}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {row.excellentShare.toFixed(1)}%
                  </TableCell>
                  <TableCell className="numeric text-right font-medium">
                    {row.average === null ? '—' : row.average.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <span aria-hidden className="block h-1 w-10 rounded-full bg-[var(--sage)]" />
        <h3 className="mt-3 text-xl tracking-tight">By programme</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          BE course codes are the Bachelor in Business and Economics, NDH is Retail
          Management, and plain numeric codes are the Master and elective catalogue.
        </p>
        <div className="mt-4 w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Programme</TableHead>
                <TableHead className="text-right">Rounds</TableHead>
                <TableHead className="text-right">Registered</TableHead>
                <TableHead className="text-right">Pass rate</TableHead>
                <TableHead className="text-right">Excellent</TableHead>
                <TableHead className="text-right">Avg. grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programmes.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.key}</TableCell>
                  <TableCell className="numeric text-right">{row.rounds}</TableCell>
                  <TableCell className="numeric text-right">
                    {row.registered.toLocaleString()}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {formatPercent(row.passRate)}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {row.excellentShare.toFixed(1)}%
                  </TableCell>
                  <TableCell className="numeric text-right font-medium">
                    {row.average === null ? '—' : row.average.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <span aria-hidden className="block h-1 w-10 rounded-full bg-[var(--sage)]" />
        <h3 className="mt-3 text-xl tracking-tight">By department</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Grouped by the department prefix of the course code.
        </p>
        <div className="mt-4 w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead column="key" active={dept.key} direction={dept.direction} onSort={dept.toggle} align="left">Department</SortableHead>
                <SortableHead column="rounds" active={dept.key} direction={dept.direction} onSort={dept.toggle} align="right">Rounds</SortableHead>
                <SortableHead column="registered" active={dept.key} direction={dept.direction} onSort={dept.toggle} align="right">Registered</SortableHead>
                <SortableHead column="passRate" active={dept.key} direction={dept.direction} onSort={dept.toggle} align="right">Pass rate</SortableHead>
                <SortableHead column="excellent" active={dept.key} direction={dept.direction} onSort={dept.toggle} align="right">Excellent</SortableHead>
                <SortableHead column="average" active={dept.key} direction={dept.direction} onSort={dept.toggle} align="right">Avg. grade</SortableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dept.sorted.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.key}</TableCell>
                  <TableCell className="numeric text-right">{row.rounds}</TableCell>
                  <TableCell className="numeric text-right">
                    {row.registered.toLocaleString()}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {formatPercent(row.passRate)}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {row.excellentShare.toFixed(1)}%
                  </TableCell>
                  <TableCell className="numeric text-right font-medium">
                    {row.average === null ? '—' : row.average.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <span aria-hidden className="block h-1 w-10 rounded-full bg-[var(--sage)]" />
        <h3 className="mt-3 text-xl tracking-tight">Degree projects and theses</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Every course whose title names a degree project, thesis or research project.
        </p>
        <div className="mt-4 w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead column="course" active={proj.key} direction={proj.direction} onSort={proj.toggle} align="left">Course</SortableHead>
                <SortableHead column="rounds" active={proj.key} direction={proj.direction} onSort={proj.toggle} align="right">Rounds</SortableHead>
                <SortableHead column="registered" active={proj.key} direction={proj.direction} onSort={proj.toggle} align="right">Registered</SortableHead>
                <SortableHead column="passRate" active={proj.key} direction={proj.direction} onSort={proj.toggle} align="right">Pass rate</SortableHead>
                <SortableHead column="excellent" active={proj.key} direction={proj.direction} onSort={proj.toggle} align="right">Excellent</SortableHead>
                <SortableHead column="average" active={proj.key} direction={proj.direction} onSort={proj.toggle} align="right">Avg. grade</SortableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proj.sorted.map((row) => (
                <TableRow key={row.course}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onSelect(row.course)}
                      className="text-left font-medium hover:underline"
                    >
                      {row.course}
                    </button>
                  </TableCell>
                  <TableCell className="numeric text-right">{row.rounds}</TableCell>
                  <TableCell className="numeric text-right">
                    {row.registered.toLocaleString()}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {formatPercent(row.passRate)}
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {row.excellent === null ? 'Pass/Fail' : `${row.excellent.toFixed(1)}%`}
                  </TableCell>
                  <TableCell className="numeric text-right font-medium">
                    {row.average === null ? '—' : row.average.toFixed(2)}
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

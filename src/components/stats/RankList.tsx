import { CourseAnalysis } from '@/utils/analysis';
import { MetricBar } from './MetricBar';

interface RankListProps {
  title: string;
  description: string;
  items: CourseAnalysis[];
  /** The measure being ranked. */
  valueOf: (item: CourseAnalysis) => number;
  format: (value: number) => string;
  onSelect: (course: string) => void;
}

export const RankList = ({
  title,
  description,
  items,
  valueOf,
  format,
  onSelect,
}: RankListProps) => {
  const max = Math.max(...items.map(valueOf), 0);

  return (
    <section className="surface-card p-4 sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>

      <ol className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.course}>
            <button
              type="button"
              onClick={() => onSelect(item.course)}
              className="group flex w-full flex-col gap-1.5 text-left"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="numeric w-4 shrink-0 text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm group-hover:underline">{item.course}</span>
                </span>
                <span className="numeric shrink-0 text-sm font-medium">
                  {format(valueOf(item))}
                </span>
              </span>
              <span className="flex items-center gap-2 pl-6">
                <MetricBar value={valueOf(item)} max={max} />
              </span>
              <span className="numeric pl-6 text-xs text-muted-foreground">
                {item.rounds} rounds · {item.registered.toLocaleString()} reg. · avg{' '}
                {item.meanAverage.toFixed(2)}
              </span>
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            Not enough data.
          </li>
        )}
      </ol>
    </section>
  );
};

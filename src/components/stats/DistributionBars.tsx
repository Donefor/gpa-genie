import { useState } from 'react';
import { StatGrade } from '@/data/gradeStats';
import { TermSlice } from '@/utils/statsMath';
import { BAND_COLOR, BAND_ORDER } from './bands';

interface Hover {
  band: StatGrade;
  share: number;
  label: string;
  x: number;
  y: number;
}

/**
 * One 100% stacked bar per term. Segments carry a 2px surface gap so the
 * composition reads as a single bar rather than four touching blocks.
 */
export const DistributionBars = ({ slices }: { slices: TermSlice[] }) => {
  const [hover, setHover] = useState<Hover | null>(null);
  const graded = slices.filter((slice) => slice.distribution !== null);

  if (graded.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
        This course is graded Pass/Fail, so no grade distribution is published.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-2.5">
        {graded.map((slice) => {
          const total = BAND_ORDER.reduce(
            (sum, band) => sum + (slice.distribution as Record<StatGrade, number>)[band],
            0,
          );
          return (
            <div key={slice.term} className="flex items-center gap-3">
              <span className="numeric w-16 shrink-0 text-xs text-muted-foreground">
                {slice.label}
              </span>

              <div className="flex h-6 flex-1 gap-[2px] overflow-hidden rounded">
                {BAND_ORDER.map((band) => {
                  const value = (slice.distribution as Record<StatGrade, number>)[band];
                  if (value <= 0) return null;
                  const share = value / total;
                  return (
                    <div
                      key={band}
                      className="h-full cursor-default transition-opacity first:rounded-l last:rounded-r hover:opacity-80"
                      style={{ width: `${share * 100}%`, background: BAND_COLOR[band] }}
                      onMouseEnter={(event) =>
                        setHover({
                          band,
                          share: value,
                          label: slice.label,
                          x: event.clientX,
                          y: event.clientY,
                        })
                      }
                      onMouseMove={(event) =>
                        setHover((current) =>
                          current ? { ...current, x: event.clientX, y: event.clientY } : current,
                        )
                      }
                      onMouseLeave={() => setHover(null)}
                    />
                  );
                })}
              </div>

              {/* Selective direct label: the cohort size, in text ink. */}
              <span className="numeric w-24 shrink-0 text-right text-xs text-muted-foreground">
                {slice.registered.toLocaleString()} reg.
              </span>
            </div>
          );
        })}
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border border-border bg-popover px-2.5 py-1.5 text-popover-foreground shadow-md"
          style={{ left: hover.x, top: hover.y }}
          role="tooltip"
        >
          <p className="numeric text-xs font-medium">{hover.label}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="h-2 w-2 rounded-sm"
              style={{ background: BAND_COLOR[hover.band] }}
            />
            <span>{hover.band}</span>
            <span className="numeric font-medium text-foreground">
              {hover.share.toFixed(1)}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

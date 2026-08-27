import { useState } from 'react';
import { TermSlice } from '@/utils/statsMath';

const WIDTH = 640;
const HEIGHT = 170;
const PAD = { top: 18, right: 28, bottom: 26, left: 34 };
/** Averages are over passing grades only, so the domain is the pass range. */
const DOMAIN = { min: 3.0, max: 5.0 };
const TICKS = [3.0, 3.5, 4.0, 4.5, 5.0];

export const AverageTrend = ({ slices }: { slices: TermSlice[] }) => {
  const [active, setActive] = useState<number | null>(null);
  const points = slices.filter((slice) => slice.average !== null);

  if (points.length < 2) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
        At least two graded terms are needed to show a trend.
      </p>
    );
  }

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (index: number) => PAD.left + (index / (points.length - 1)) * plotW;
  const y = (value: number) =>
    PAD.top + plotH - ((value - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * plotH;

  const path = points
    .map((slice, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(slice.average!)}`)
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full min-w-[440px]"
        role="img"
        aria-label="Average grade point by term"
        onMouseLeave={() => setActive(null)}
      >
        {TICKS.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 7}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="numeric"
              fontSize={10}
              fill="hsl(var(--muted-foreground))"
            >
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        <path
          d={path}
          fill="none"
          stroke="var(--band-excellent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((slice, index) => (
          <g key={slice.term}>
            {/* Only label every other tick when the series gets long. */}
            {(points.length <= 8 || index % 2 === 0) && (
              <text
                x={x(index)}
                y={HEIGHT - 8}
                textAnchor={
                  index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'
                }
                className="numeric"
                fontSize={10}
                fill="hsl(var(--muted-foreground))"
              >
                {slice.label}
              </text>
            )}
            {/* Surface ring keeps the marker legible where the line runs under it. */}
            <circle
              cx={x(index)}
              cy={y(slice.average!)}
              r={4}
              fill="var(--band-excellent)"
              stroke="hsl(var(--card))"
              strokeWidth={2}
            />
            <rect
              x={x(index) - plotW / (points.length * 2) - 2}
              y={PAD.top}
              width={plotW / points.length + 4}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setActive(index)}
            />
          </g>
        ))}

        {/* Direct labels on the endpoints, plus whatever is hovered. */}
        {[...new Set([0, points.length - 1, active].filter((i): i is number => i !== null))].map(
          (index) => (
            <text
              key={index}
              x={x(index)}
              y={y(points[index].average!) - 10}
              textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
              className="numeric"
              fontSize={11}
              fontWeight={600}
              fill="hsl(var(--foreground))"
            >
              {points[index].average!.toFixed(2)}
            </text>
          ),
        )}
      </svg>
    </div>
  );
};

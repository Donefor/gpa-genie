/** A single-series bar; the section title names the measure, so no legend. */
export const MetricBar = ({ value, max }: { value: number; max: number }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
    <div
      className="h-full rounded-full bg-[var(--band-verygood)]"
      style={{ width: `${max === 0 ? 0 : Math.max(2, (value / max) * 100)}%` }}
    />
  </div>
);

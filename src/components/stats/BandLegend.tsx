import { BAND_COLOR, BAND_ORDER } from './bands';

export const BandLegend = () => (
  <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
    {BAND_ORDER.map((band) => (
      <li key={band} className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="h-2 w-2 rounded-sm"
          style={{ background: BAND_COLOR[band] }}
        />
        <span className="text-xs text-muted-foreground">{band}</span>
      </li>
    ))}
  </ul>
);

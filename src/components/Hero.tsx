import { useState } from 'react';
import { pickFrom, poolFor, scopeFor } from '@/data/messages';
import { PapersMark } from './PapersMark';

export const Hero = () => {
  // Drawn once per mount, so it is a new line on every page load but does not
  // flicker as the calculator re-renders underneath it.
  const [message] = useState(() => pickFrom(poolFor(scopeFor())));

  return (
    <section className="relative bg-[var(--sage)]">
      <div className="mx-auto max-w-5xl px-4">
        {/* Padding lives on the row, so both columns share one box and
            items-center actually lines the title up with the mark. */}
        <div className="grid items-center gap-6 pb-24 pt-14 sm:grid-cols-[1.15fr_1fr] sm:pb-28 sm:pt-20">
          <div>
            <h1 className="font-display text-3xl leading-[1.15] text-[var(--bronze)] sm:text-[2.6rem]">
              {message}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--bronze)]/85">
              Plan and track your grade point average for the Bachelor in Business and
              Economics at the Stockholm School of Economics.
            </p>
          </div>

          <div className="hidden justify-center text-[var(--bronze)] sm:flex">
            <PapersMark className="h-60 w-60" />
          </div>
        </div>
      </div>

      {/* Softens the edge where the sage field meets the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
};

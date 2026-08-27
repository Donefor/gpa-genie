import { useEffect, useState } from 'react';
import { PapersMark } from './PapersMark';

/** Rotating encouragement in place of a fixed headline. */
const MESSAGES = [
  'You are further along than you think',
  'Every period counts',
  'Steady work, real results',
  'One grade at a time',
  'Your best round is still ahead',
  'Look how far you have come',
  'Small steps, strong finish',
  'Keep going, it adds up',
];

const ROTATE_MS = 5000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Hero = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MESSAGES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const rotate = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, ROTATE_MS);

    return () => window.clearInterval(rotate);
  }, []);

  return (
    <section className="relative bg-[var(--sage)]">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid items-center gap-6 sm:grid-cols-[1.15fr_1fr]">
          <div className="pb-28 pt-14 sm:pb-36 sm:pt-24">
            <h1
              className={`font-display text-3xl leading-[1.15] text-[var(--bronze)] transition-opacity duration-400 sm:text-[2.6rem] ${
                visible ? 'opacity-100' : 'opacity-0'
              }`}
              aria-live="polite"
            >
              {MESSAGES[index]}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--bronze)]/85">
              Plan and track your grade point average for the Bachelor in Business and
              Economics at the Stockholm School of Economics. Your grades are anonymous, but
              they are saved in your browser.
            </p>
          </div>

          <div className="hidden justify-center pb-28 pt-4 text-[var(--bronze)] sm:flex">
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

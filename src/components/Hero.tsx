import { useState } from 'react';
import { contextualMessage, randomMessage } from '@/data/messages';
import { PapersMark } from './PapersMark';

const SESSION_KEY = 'sse-gpa-calculator:message';

/**
 * The headline is drawn once per session and cached, so it holds steady while
 * you move between the calculator and the statistics.
 */
const messageForSession = (): string => {
  // Time-sensitive messages always win, so they are never read from the cache.
  const contextual = contextualMessage();
  if (contextual) return contextual;

  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const fresh = randomMessage();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // Session storage can be unavailable; a fresh message each load is fine.
    return randomMessage();
  }
};

export const Hero = () => {
  const [message] = useState(messageForSession);

  return (
    <section className="relative bg-[var(--sage)]">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid items-center gap-6 sm:grid-cols-[1.15fr_1fr]">
          <div className="pb-28 pt-14 sm:pb-36 sm:pt-24">
            <h1 className="font-display text-3xl leading-[1.15] text-[var(--bronze)] sm:text-[2.6rem]">
              {message}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--bronze)]/85">
              Plan and track your grade point average for the Bachelor in Business and
              Economics at the Stockholm School of Economics.
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

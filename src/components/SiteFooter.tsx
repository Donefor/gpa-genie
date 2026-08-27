import { Link } from 'react-router-dom';
import { openConsentSettings } from '@/lib/consent';

const linkClass =
  'text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline';

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">{children}</h2>
);

export const SiteFooter = () => (
  <footer className="mt-16 border-t border-border bg-secondary/40">
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-base">SSE GPA Calculator</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            An independent project, not affiliated with or endorsed by the Stockholm School of
            Economics. Feedback, bugs and contributions are all welcome.
          </p>
        </div>

        <div>
          <Heading>Get in touch</Heading>
          <ul className="mt-3 space-y-1.5">
            <li>
              <a
                href="https://www.linkedin.com/in/jonas-hoffmann-petersen-405914127/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Jonas Hoffmann Petersen
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/erik-m-%C3%A5str%C3%B6m-7b02a715b/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Erik M. Åström
              </a>
            </li>
          </ul>
        </div>

        <div>
          <Heading>Legal</Heading>
          <ul className="mt-3 space-y-1.5">
            <li>
              <Link to="/privacy" className={linkClass}>
                Privacy notice
              </Link>
            </li>
            <li>
              <button type="button" onClick={openConsentSettings} className={linkClass}>
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        Grades you enter are self-reported and unverified. Check anything that matters against
        the official record — no liability is accepted for errors or for outcomes arising from
        use of this tool.
      </p>
    </div>
  </footer>
);

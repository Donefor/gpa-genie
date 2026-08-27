import { Link } from 'react-router-dom';

export const SiteFooter = () => (
  <footer className="mt-16 border-t border-border bg-secondary/40">
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-base font-medium">
          Feedback, bug reports and contributions are all very welcome.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href="https://www.linkedin.com/in/jonas-hoffmann-petersen-405914127/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Jonas Hoffmann Petersen
          </a>
          <a
            href="https://www.linkedin.com/in/erik-m-%C3%A5str%C3%B6m-7b02a715b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Erik M. Åström
          </a>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <Link
          to="/privacy"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Privacy
        </Link>
      </div>

      <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        This tool is an independent project developed and maintained by a third party. It is
        not officially affiliated with, endorsed by, or supported by the Stockholm School of
        Economics in any capacity. SSE assumes no responsibility for the accuracy,
        functionality, or use of this tool. The developers likewise disclaim any liability for
        errors, inaccuracies, or outcomes resulting from its use — please verify all
        calculations independently in cases of uncertainty. See the{' '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
          privacy page
        </Link>{' '}
        for what is recorded.
      </p>
    </div>
  </footer>
);

import { AppHeader } from '@/components/AppHeader';
import { SiteFooter } from '@/components/SiteFooter';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-8">
    <span aria-hidden className="block h-1 w-10 rounded-full bg-[var(--sage)]" />
    <h2 className="mt-3 text-xl tracking-tight">{title}</h2>
    <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <AppHeader />

    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Privacy</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        This is a small, independent tool. There are no accounts, no sign-up and no database
        of users. What follows is everything it does with data.
      </p>

      <Section title="Your grades stay on your device">
        <p>
          The grades and programme choices you enter are saved in your own browser using
          local storage, under the key{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">sse-gpa-calculator:v2</code>.
          They are never transmitted to us or to anyone else, and we cannot read them.
        </p>
        <p>
          Clearing your browser data, or using the reset control in the header, erases them
          permanently. Because they live in one browser on one device, they will not follow
          you to another.
        </p>
      </Section>

      <Section title="Session recording with Hotjar">
        <p>
          We use <strong className="font-medium text-foreground">Hotjar</strong> to understand
          how the tool is actually used. Hotjar records anonymised sessions and interactions —
          pages visited, clicks, scrolling, mouse movement and the approximate size of your
          screen — and aggregates them into heatmaps and session replays.
        </p>
        <p>
          These recordings are anonymous. We use them only to find where the interface is
          confusing and to fix it. Hotjar is a third-party processor with its own privacy
          policy and its own data retention. If you prefer not to be recorded, Hotjar honours
          the browser <em>Do Not Track</em> setting, and you can opt out permanently through
          Hotjar directly.
        </p>
      </Section>

      <Section title="Traffic measurement with Google Analytics">
        <p>
          Google Analytics counts visits and tells us which pages get used. It sets cookies
          and processes an IP address to approximate your country. We do not use it for
          advertising and we do not combine it with anything else.
        </p>
      </Section>

      <Section title="The grade statistics">
        <p>
          The statistics pages are built from the school's own published course statistics,
          which are aggregate figures per course round. They contain no individual results and
          nothing that identifies any student. They are bundled with the site, so browsing or
          exporting them sends no request anywhere.
        </p>
      </Section>

      <Section title="What we never collect">
        <p>
          No names, no email addresses, no student numbers, no real grades tied to a person.
          Nothing you type into the calculator leaves your browser.
        </p>
      </Section>

      <Section title="Getting in touch">
        <p>
          Questions, or want a session recording removed? Reach out through the links in the
          footer and we will sort it out.
        </p>
      </Section>

      <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
        This tool is an independent project and is not affiliated with, endorsed by, or
        supported by the Stockholm School of Economics.
      </p>
    </main>

    <SiteFooter />
  </div>
);

export default Privacy;

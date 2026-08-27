import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { SiteFooter } from '@/components/SiteFooter';

const LAST_UPDATED = '27 August 2026';

const Section = ({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-8">
    <h2 className="text-lg tracking-tight">
      <span className="numeric mr-2 text-muted-foreground">{number}.</span>
      {title}
    </h2>
    <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <AppHeader />

    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Privacy Notice</h1>
      <p className="numeric mt-2 text-xs text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        This Privacy Notice explains how the SSE GPA Calculator (the “Service”) collects, uses
        and safeguards information when you use it. The Service is an independent project and
        is not affiliated with, endorsed by or operated by the Stockholm School of Economics.
        By using the Service you agree to the practices described below.
      </p>

      <div className="mt-6 rounded-md border border-border bg-muted/50 p-4">
        <h2 className="text-base tracking-tight">In plain terms</h2>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="font-medium text-foreground">We cannot tell who you are.</strong>{' '}
            There is no sign-up, and we never see your name, email address or student number.
          </li>
          <li>
            <strong className="font-medium text-foreground">We can see how the site is
            used</strong> — roughly where a visit came from, what device and browser, and a
            replay of how you moved around the page. The grades you enter are masked before
            they reach our providers.
          </li>
          <li>
            <strong className="font-medium text-foreground">This still counts as personal
            data.</strong> An IP address and the identifiers our providers set are treated as
            personal data under the GDPR even without a name attached, so the data is
            pseudonymous rather than anonymous.
          </li>
        </ul>
      </div>

      <Section number={1} title="What we collect">
        <p>
          <strong className="font-medium text-foreground">Information you enter.</strong> The
          Service lets you record grades, specialisations and other programme choices. This
          information is stored locally in your browser and is not submitted to a server or
          held in any account or database operated by us. The grade selectors and the
          calculated averages are masked from session recording, as described in section 2, so
          they are not transmitted to our providers either.
        </p>
        <p>
          <strong className="font-medium text-foreground">Information collected
          automatically.</strong> When you use the Service we and our providers may
          automatically collect technical and usage information, including your IP address
          (which may be truncated or anonymised), approximate geographic location, browser
          type and version, operating system, device and screen characteristics, referring
          page, the pages you view, and the dates and times of your visits.
        </p>
        <p>
          <strong className="font-medium text-foreground">Information we do not
          collect.</strong> We do not ask for or collect your name, email address, postal
          address, telephone number, student identification number or official academic
          records. The Service has no sign-up, no login and no user accounts.
        </p>
      </Section>

      <Section number={2} title="Session recording (Hotjar)">
        <p>
          We use <strong className="font-medium text-foreground">Hotjar Ltd.</strong> (Level 2,
          St Julian’s Business Centre, 3, Elia Zammit Street, St Julian’s STJ 1000, Malta) to
          understand how visitors use the Service. Hotjar records sessions and aggregates
          interactions into heatmaps and session replays. Hotjar acts as a processor on our
          behalf under a data processing agreement.
        </p>

        <p className="text-foreground">
          <strong className="font-medium">What Hotjar collects</strong>
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Your IP address, which Hotjar anonymises, and the country derived from it</li>
          <li>Device type, operating system, browser and version, screen size and language</li>
          <li>Referring page, the pages you visit, and the dates and times of your visit</li>
          <li>Mouse movement, clicks and taps, scrolling and other interactions</li>
          <li>
            A replay of what was rendered on your screen, excluding the masked areas described
            below
          </li>
          <li>
            Cookies that identify your browser between visits, including{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">_hjSessionUser_*</code> and{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">_hjSession_*</code>
          </li>
        </ul>

        <p>
          <strong className="font-medium text-foreground">Grades are masked.</strong> The grade
          selectors, the grade point average and the per-year figures are marked for
          suppression, so Hotjar replaces them with placeholder characters at the moment of
          capture. The grades you enter are therefore not transmitted to Hotjar and do not
          appear in any recording. Hotjar additionally suppresses the contents of text input
          fields by default.
        </p>

        <p>
          <strong className="font-medium text-foreground">Why.</strong> To see where the
          interface causes difficulty and to fix it, and to diagnose faults.
        </p>
        <p>
          <strong className="font-medium text-foreground">Legal basis.</strong> Your consent
          for the storage of and access to information on your device, and our legitimate
          interest in improving and securing the Service for the subsequent analysis. You may
          withdraw consent at any time, as described in section 10.
        </p>
        <p>
          <strong className="font-medium text-foreground">Where it is processed.</strong>{' '}
          Hotjar is established in the European Union and hosts data on servers within the
          European Economic Area.
        </p>
        <p>
          <strong className="font-medium text-foreground">How long it is kept.</strong>{' '}
          Recordings and the associated data are retained by Hotjar in line with the retention
          period configured for our account, after which they are deleted.
        </p>
        <p>
          <strong className="font-medium text-foreground">Identifiability.</strong> This data
          is pseudonymous: it is not linked to your name, email address or student number, and
          we make no attempt to identify you.
        </p>
        <p>
          <strong className="font-medium text-foreground">Opting out.</strong> Hotjar honours
          the browser <em>Do Not Track</em> setting, and offers an opt-out that applies across
          every site using Hotjar. See Hotjar’s privacy policy and opt-out page at hotjar.com.
        </p>
      </Section>

      <Section number={3} title="Analytics">
        <p>
          We use <strong className="font-medium text-foreground">Google Analytics</strong>,
          provided by Google, to measure traffic and understand which parts of the Service are
          used. Google Analytics sets cookies and processes IP addresses to derive approximate
          location and aggregate usage statistics.
        </p>
        <p>
          We do not use Google Analytics for advertising, remarketing or profiling, and we do
          not combine analytics data with any other information. You can prevent Google
          Analytics from collecting data by installing the Google Analytics Opt-out Browser
          Add-on.
        </p>
      </Section>

      <Section number={4} title="Cookies and local storage">
        <p>
          The Service uses browser local storage to remember the grades and choices you enter,
          and session storage to keep the page heading stable while you browse. These are not
          cookies, are readable only by this site, and are never transmitted to us.
        </p>
        <p>
          <strong className="font-medium text-foreground">Your tracking choice</strong> is
          saved the same way, in local storage under the key{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            sse-gpa-calculator:consent
          </code>
          , with the date you chose. It stays on your device — we keep no central record of
          who agreed, which is also why the question is never asked again on the same browser
          until you clear it.
        </p>
        <p>
          Our providers described in sections 2 and 3 set their own cookies and similar
          identifiers for the purposes stated there. You can clear or block cookies and site
          data through your browser settings. Clearing site data for this Service will also
          erase the grades you have entered.
        </p>
      </Section>

      <Section number={5} title="What we use it for">
        <p>
          To keep the tool working, to fix faults, and to see which parts of it people find
          hard. We do not sell anything, and we do not use it to make decisions about anyone.
        </p>
      </Section>

      <Section number={6} title="Why we are allowed to">
        <p>
          Nothing that sets a cookie runs until you agree to it. Once you have, we rely on
          that consent, together with our interest in keeping the tool working and improving
          it. You can withdraw consent at any time through “Cookie settings” in the footer.
          Withdrawing does not undo anything already collected.
        </p>
      </Section>

      <Section number={7} title="Who else sees it">
        <p>
          The only companies that see anything are the two named above, and only for the
          purposes described. Hotjar keeps its data in the EU. Google may process data outside
          the EU, under the safeguards it has in place for that.
        </p>
      </Section>

      <Section number={8} title="How long it is kept">
        <p>
          Information you enter remains in your browser until you clear it, either through the
          reset control in the Service or through your browser’s settings. Session recordings
          and analytics data are retained by our providers in accordance with their standard
          retention periods and are deleted or anonymised thereafter.
        </p>
      </Section>

      <Section number={9} title="What you can actually do">
        <p>
          <strong className="font-medium text-foreground">Turn it off.</strong> “Cookie
          settings” in the footer switches tracking on or off whenever you like. Turn it off
          and Hotjar and Google Analytics stop loading.
        </p>
        <p>
          <strong className="font-medium text-foreground">Wipe what is on your device.</strong>{' '}
          Clearing this site’s data in your browser erases the grades you entered and your
          tracking choice, and there is a reset control in the header for the grades alone.
        </p>
        <p>
          <strong className="font-medium text-foreground">Opt out everywhere.</strong> Hotjar
          and Google both run opt-outs that cover every site using them, and Hotjar honours the
          browser <em>Do Not Track</em> setting.
        </p>
        <p>
          The GDPR also gives you the right to ask us for a copy of your personal data, or to
          have it corrected or deleted.{' '}
          <strong className="font-medium text-foreground">
            We should be straight about what that is worth here: we hold nothing that
            identifies you, so we have no way to tell which visit or which recording was
            yours.
          </strong>{' '}
          We cannot hand over your data or delete it on request, because we cannot find it.
          The three controls above are the ones that genuinely work, and they are all in your
          hands rather than ours.
        </p>
        <p>
          If you think something here has been handled wrongly, you can complain to the Swedish
          Authority for Privacy Protection (Integritetsskyddsmyndigheten, IMY).
        </p>
      </Section>

      <Section number={10} title="Children">
        <p>
          The Service is intended for university students and is not directed at children
          under 13. We do not knowingly collect information from children under 13.
        </p>
      </Section>

      <Section number={11} title="Changes, and getting hold of us">
        <p>
          We may update this notice from time to time. Material changes will be reflected in
          the “Last updated” date at the top of this page, and continued use of the Service
          after a change constitutes acceptance of the revised notice.
        </p>
        <p>
          Questions are welcome through the links in the site footer. We cannot promise to
          find or remove a particular recording, for the reason given in section 9, but if
          something here looks wrong we would rather hear about it.
        </p>
      </Section>

      <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        This notice is provided for information only and does not constitute legal advice. The
        Service is an independent project and is not affiliated with, endorsed by, or
        supported by the Stockholm School of Economics.
      </p>
    </main>

    <SiteFooter />
  </div>
);

export default Privacy;

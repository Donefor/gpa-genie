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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Privacy Policy</h1>
      <p className="numeric mt-2 text-xs text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        This Privacy Policy explains how the SSE GPA Calculator (the “Service”) collects, uses
        and safeguards information when you use it. The Service is an independent project and
        is not affiliated with, endorsed by or operated by the Stockholm School of Economics.
        By using the Service you agree to the practices described below.
      </p>

      <Section number={1} title="Information we collect">
        <p>
          <strong className="font-medium text-foreground">Information you enter.</strong> The
          Service lets you record grades, specialisations and other programme choices. This
          information is stored locally in your browser and is not submitted to a server or
          held in any account or database operated by us. Please note, however, that
          information displayed on screen may be captured by our session recording provider as
          described in section 2.
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

      <Section number={2} title="Session recording">
        <p>
          We use <strong className="font-medium text-foreground">Hotjar Ltd.</strong> to
          understand how visitors interact with the Service. Hotjar records sessions and
          aggregates interactions into heatmaps and session replays.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            These recordings capture what is displayed on your screen while you use the
            Service, which includes the grades and programme choices you enter and the grade
            point average calculated from them.
          </strong>{' '}
          Recordings also capture mouse movement, clicks, scrolling, and the pages and
          elements you interact with.
        </p>
        <p>
          Recordings are pseudonymous: they are not linked to your name, email address or any
          other identifier that would allow us to identify you personally, and we make no
          attempt to do so. Because the information you enter is self-reported and not
          verified, it does not constitute an official academic record.
        </p>
        <p>
          Hotjar acts as a data processor on our behalf and processes the data in accordance
          with its own privacy policy and retention schedule. For further information, and to
          opt out of Hotjar across all sites that use it, see Hotjar’s privacy policy and
          opt-out page at hotjar.com.
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
          Our providers described in sections 2 and 3 set their own cookies and similar
          identifiers for the purposes stated there. You can clear or block cookies and site
          data through your browser settings. Clearing site data for this Service will also
          erase the grades you have entered.
        </p>
      </Section>

      <Section number={5} title="How we use information">
        <p>
          We use the information described above to operate, maintain and improve the Service;
          to diagnose faults and investigate technical problems; to understand which features
          are used and where the interface causes difficulty; and to compile aggregate
          statistics about usage. We do not sell information, and we do not use it to make
          decisions about any individual.
        </p>
      </Section>

      <Section number={6} title="Legal basis for processing">
        <p>
          Where the General Data Protection Regulation (EU) 2016/679 applies, we process
          information on the basis of our legitimate interests in operating, securing and
          improving the Service, and, where required by applicable law, on the basis of your
          consent. Where we rely on consent, you may withdraw it at any time; withdrawal does
          not affect processing carried out before withdrawal.
        </p>
      </Section>

      <Section number={7} title="Data sharing and international transfers">
        <p>
          We share information only with the service providers named in this policy, acting as
          processors on our behalf, and where we are required to do so by law. These providers
          may process information outside the European Economic Area. Where they do, transfers
          are made under the safeguards those providers have put in place, such as the European
          Commission’s standard contractual clauses.
        </p>
      </Section>

      <Section number={8} title="Retention">
        <p>
          Information you enter remains in your browser until you clear it, either through the
          reset control in the Service or through your browser’s settings. Session recordings
          and analytics data are retained by our providers in accordance with their standard
          retention periods and are deleted or anonymised thereafter.
        </p>
      </Section>

      <Section number={9} title="Your rights">
        <p>
          Subject to applicable law, you may have the right to request access to the personal
          data we hold about you; to request its correction or erasure; to object to or
          request restriction of processing; and to request a copy in a portable format. To
          exercise these rights, contact us using the details in section 12.
        </p>
        <p>
          Because the Service collects no identifying information, we may be unable to locate
          data relating to you without further details that would allow us to do so. If you
          believe your data has been handled unlawfully, you have the right to lodge a
          complaint with your local supervisory authority; in Sweden this is the Swedish
          Authority for Privacy Protection (Integritetsskyddsmyndigheten, IMY).
        </p>
      </Section>

      <Section number={10} title="Do Not Track and opting out">
        <p>
          Hotjar honours the browser <em>Do Not Track</em> setting. Enabling Do Not Track in
          your browser, using the opt-out mechanisms referred to in sections 2 and 3, or
          blocking these providers with a content blocker, will prevent the corresponding
          collection. The Service remains fully functional if you do so.
        </p>
      </Section>

      <Section number={11} title="Children">
        <p>
          The Service is intended for university students and is not directed at children
          under 13. We do not knowingly collect information from children under 13.
        </p>
      </Section>

      <Section number={12} title="Changes and contact">
        <p>
          We may update this policy from time to time. Material changes will be reflected in
          the “Last updated” date at the top of this page, and continued use of the Service
          after a change constitutes acceptance of the revised policy.
        </p>
        <p>
          For questions about this policy, or to request removal of a session recording,
          contact us through the links in the{' '}
          <Link to="/" className="underline underline-offset-2 hover:text-foreground">
            site footer
          </Link>
          .
        </p>
      </Section>

      <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        This policy is provided for information only and does not constitute legal advice. The
        Service is an independent project and is not affiliated with, endorsed by, or
        supported by the Stockholm School of Economics.
      </p>
    </main>

    <SiteFooter />
  </div>
);

export default Privacy;

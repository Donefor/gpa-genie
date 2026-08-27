/**
 * Consent gate for the two non-essential trackers.
 *
 * Neither Hotjar nor Google Analytics is present in index.html: both set
 * cookies, so under the ePrivacy rules they may only be loaded once the visitor
 * has actively agreed. Nothing here runs until `enableAnalytics` is called.
 */

const STORAGE_KEY = 'sse-gpa-calculator:consent';

/** Lets any part of the app reopen the consent banner. */
export const OPEN_CONSENT_EVENT = 'sse-gpa:open-consent';

export const openConsentSettings = () =>
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));

const HOTJAR_ID = 5326228;
const HOTJAR_VERSION = 6;
const GA_MEASUREMENT_ID = 'G-BV0BS6QSRK';

export type ConsentChoice = 'granted' | 'denied';

export interface ConsentState {
  choice: ConsentChoice;
  /** ISO date the choice was made, so it can be refreshed periodically. */
  decidedAt: string;
}

export const readConsent = (): ConsentState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.choice !== 'granted' && parsed.choice !== 'denied') return null;
    return { choice: parsed.choice, decidedAt: parsed.decidedAt ?? '' };
  } catch {
    return null;
  }
};

const writeConsent = (choice: ConsentChoice) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, decidedAt: new Date().toISOString() }),
    );
  } catch {
    // Without storage the banner reappears next visit, which is the safe default.
  }
};

/** Respect an explicit browser signal without asking. */
export const hasDoNotTrack = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const dnt =
    navigator.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack ??
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
};

let loaded = false;

const loadHotjar = () => {
  const w = window as unknown as {
    hj?: { q?: unknown[] } & ((...args: unknown[]) => void);
    _hjSettings?: { hjid: number; hjsv: number };
  };
  w.hj =
    w.hj ||
    function (...args: unknown[]) {
      (w.hj!.q = w.hj!.q || []).push(args);
    };
  w._hjSettings = { hjid: HOTJAR_ID, hjsv: HOTJAR_VERSION };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=${HOTJAR_VERSION}`;
  document.head.appendChild(script);
};

const loadGoogleAnalytics = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    w.dataLayer!.push(args);
  };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
};

/** Injects both trackers. Safe to call more than once. */
export const enableAnalytics = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  loadHotjar();
  loadGoogleAnalytics();
};

/**
 * Best-effort removal of the cookies the trackers set. The scripts themselves
 * stay in memory until the page is reloaded, so callers reload afterwards.
 */
export const clearTrackingCookies = () => {
  const domains = [window.location.hostname, `.${window.location.hostname}`];
  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0]?.trim();
    if (!name) return;
    if (!/^(_hj|_ga|_gid)/.test(name)) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    });
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
};

export const grantConsent = () => {
  writeConsent('granted');
  enableAnalytics();
};

export const denyConsent = () => {
  writeConsent('denied');
  clearTrackingCookies();
};

/** Called once on start-up: only loads anything if consent already exists. */
export const initConsent = () => {
  if (hasDoNotTrack()) return;
  if (readConsent()?.choice === 'granted') enableAnalytics();
};

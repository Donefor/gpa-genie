import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  OPEN_CONSENT_EVENT,
  denyConsent,
  grantConsent,
  hasDoNotTrack,
  initConsent,
  readConsent,
} from '@/lib/consent';

export const ConsentBanner = () => {
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState<'granted' | 'denied' | null>(null);

  useEffect(() => {
    initConsent();

    // Do Not Track is an explicit refusal; asking again would be rude.
    if (hasDoNotTrack()) return;

    const existing = readConsent();
    if (existing) {
      setDecided(existing.choice);
      return;
    }
    // Let the page paint before the banner slides in.
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const accept = useCallback(() => {
    grantConsent();
    setDecided('granted');
    setOpen(false);
  }, []);

  const decline = useCallback(() => {
    const wasGranted = readConsent()?.choice === 'granted';
    denyConsent();
    setDecided('denied');
    setOpen(false);
    // The scripts stay in memory once loaded, so a reload is the honest way out.
    if (wasGranted) window.location.reload();
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed bottom-4 left-4 right-4 z-[60] max-w-sm rounded-lg border border-border bg-card p-4 shadow-lg sm:right-auto"
    >
      <h2 id="consent-title" className="text-base tracking-tight">
        Help us improve the tool?
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Hotjar and Google Analytics help us find what is confusing. They set cookies and
        record an anonymised replay of your visit.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={accept} className="h-9 flex-1">
          Allow
        </Button>
        <Button variant="outline" onClick={decline} className="h-9 flex-1">
          No thanks
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {decided === 'granted' && 'Currently allowed. '}
        {decided === 'denied' && 'Currently declined. '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
          What gets recorded
        </Link>
      </p>
    </div>
  );
};

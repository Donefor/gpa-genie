import { useMemo, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { ALL_RECORDS } from '@/data/gradeStats';
import {
  ALL_TERMS,
  ANALYSIS_PROMPT,
  buildCsv,
  downloadCsv,
  filterByTermRange,
  termLabelOf,
} from '@/utils/exportData';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ExportPanel = () => {
  const [from, setFrom] = useState(ALL_TERMS[0].term);
  const [to, setTo] = useState(ALL_TERMS[ALL_TERMS.length - 1].term);
  const [copied, setCopied] = useState(false);

  const selection = useMemo(
    () => filterByTermRange(ALL_RECORDS, from, to),
    [from, to],
  );

  const handleDownload = () => {
    downloadCsv(`sse-grades-${from}-${to}.csv`, buildCsv(selection));
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ANALYSIS_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the prompt is visible below regardless.
    }
  };

  return (
    <section className="surface-card p-4 sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">Rather ask your own model?</h3>
      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Export the cleaned, deduplicated data for any range of study periods as a CSV that
        opens straight in Excel, then upload it to the model of your choice. There is a
        starter prompt below that explains the columns.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="w-36">
          <span className="field-label">From</span>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger aria-label="From period" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_TERMS.map((t) => (
                <SelectItem key={t.term} value={t.term}>
                  {termLabelOf(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <span className="field-label">To</span>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger aria-label="To period" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_TERMS.map((t) => (
                <SelectItem key={t.term} value={t.term}>
                  {termLabelOf(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleDownload} className="h-9 gap-2">
          <Download className="h-4 w-4" aria-hidden />
          Download CSV
        </Button>

        <Button variant="outline" onClick={handleCopyPrompt} className="h-9 gap-2">
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
          {copied ? 'Prompt copied' : 'Copy starter prompt'}
        </Button>

        <p className="numeric text-xs text-muted-foreground">
          {selection.length.toLocaleString()} rounds selected
        </p>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
          Show the starter prompt
        </summary>
        <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
{ANALYSIS_PROMPT}
        </pre>
      </details>
    </section>
  );
};

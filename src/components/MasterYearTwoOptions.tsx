import { ProgramConfig } from '@/types';
import { Programme } from '@/data/programmes';
import {
  departmentElectiveCount,
  REQUIRED_DEPARTMENT_ELECTIVES,
} from '@/utils/programmeModel';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OptionField, OptionGroup } from './OptionGroup';

const UNCHOSEN = '__unchosen__';

interface MasterYearTwoOptionsProps {
  programme: Programme;
  config: ProgramConfig;
  onThesisChange: (half: 'fall' | 'spring' | null) => void;
  onExchangeChange: (half: 'none' | 'fall' | 'spring') => void;
}

export const MasterYearTwoOptions = ({
  programme,
  config,
  onThesisChange,
  onExchangeChange,
}: MasterYearTwoOptionsProps) => {
  const fromDepartment = departmentElectiveCount(programme, config);
  const met = fromDepartment >= REQUIRED_DEPARTMENT_ELECTIVES;

  const thesisChosen = config.mscThesis !== null;

  return (
    <div className="space-y-3">
      {!thesisChosen && (
        <div className="flex items-start gap-2.5 rounded-md border border-warning/50 bg-warning/10 px-3 py-2.5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">
            <strong className="font-semibold">Choose when you write your thesis.</strong> It is
            required and takes a whole half-year, so the rest of the year depends on it.
          </p>
        </div>
      )}

      <OptionGroup>
        <OptionField
          label="Thesis"
          hint="Required, 30 ECTS. It takes a whole half-year, so choose which."
        >
          <Select
            value={config.mscThesis ?? UNCHOSEN}
            onValueChange={(v) => onThesisChange(v === UNCHOSEN ? null : (v as 'fall' | 'spring'))}
          >
            <SelectTrigger
              aria-label="Thesis"
              className={cn('h-9 w-full', !thesisChosen && 'border-warning text-muted-foreground')}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNCHOSEN}>Not chosen yet</SelectItem>
              <SelectItem value="fall">Autumn — periods 1 and 2</SelectItem>
              <SelectItem value="spring">Spring — periods 3 and 4</SelectItem>
            </SelectContent>
          </Select>
        </OptionField>

        <OptionField
          label="Exchange"
          hint="Optional, and Pass/Fail. It takes the half the thesis does not."
        >
          <Select
            value={config.mscExchange}
            onValueChange={(v) => onExchangeChange(v as 'none' | 'fall' | 'spring')}
          >
            <SelectTrigger aria-label="Exchange" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No exchange</SelectItem>
              <SelectItem value="fall" disabled={config.mscThesis === 'fall'}>
                Autumn — periods 1 and 2
              </SelectItem>
              <SelectItem value="spring" disabled={config.mscThesis === 'spring'}>
                Spring — periods 3 and 4
              </SelectItem>
            </SelectContent>
          </Select>
        </OptionField>
      </OptionGroup>

      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm',
          met ? 'border-[var(--sage)] bg-[var(--sage)]/15' : 'border-border bg-muted/50',
        )}
      >
        <span className="text-foreground/80">
          {REQUIRED_DEPARTMENT_ELECTIVES} of your electives must come from your own
          department.
        </span>
        <span className={cn('numeric font-semibold', met ? 'text-[var(--olive)]' : 'text-foreground')}>
          {fromDepartment} of {REQUIRED_DEPARTMENT_ELECTIVES} chosen
          {met && ' ✓'}
        </span>
      </div>
    </div>
  );
};

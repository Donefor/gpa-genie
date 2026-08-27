import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { CATALOGUE, catalogueCourse } from '@/data/courseCatalogue';
import { SuggestedElective } from '@/data/programmes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface CoursePickerProps {
  value: string | null;
  onChange: (courseNo: string | null) => void;
  /** Courses the programme page recommends, shown first. */
  suggested: SuggestedElective[];
  label: string;
}

export const CoursePicker = ({ value, onChange, suggested, label }: CoursePickerProps) => {
  const [open, setOpen] = useState(false);
  const picked = value ? catalogueCourse(value) : undefined;

  const suggestedNos = useMemo(
    () => new Set(suggested.map((s) => s.courseNo).filter(Boolean) as string[]),
    [suggested],
  );
  const recommended = useMemo(
    () => CATALOGUE.filter((c) => suggestedNos.has(c.courseNo)),
    [suggestedNos],
  );
  const rest = useMemo(
    () => CATALOGUE.filter((c) => !suggestedNos.has(c.courseNo)),
    [suggestedNos],
  );

  const row = (c: (typeof CATALOGUE)[number]) => (
    <CommandItem
      key={c.courseNo}
      value={`${c.name} ${c.courseNo}`}
      onSelect={() => {
        onChange(c.courseNo === value ? null : c.courseNo);
        setOpen(false);
      }}
    >
      <Check
        className={cn('mr-2 h-4 w-4 shrink-0', value === c.courseNo ? 'opacity-100' : 'opacity-0')}
      />
      <span className="min-w-0 flex-1 truncate">{c.name}</span>
      <span className="numeric ml-2 shrink-0 text-xs text-muted-foreground">
        {c.credits}
        {!c.creditsKnown && '*'} ECTS
      </span>
    </CommandItem>
  );

  return (
    <div className="flex items-center gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            className="h-9 min-w-0 flex-1 justify-between font-normal"
          >
            <span className={cn('truncate', !picked && 'text-muted-foreground')}>
              {picked ? picked.name : 'Choose a course'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search courses…" />
            <CommandList>
              <CommandEmpty>No course found.</CommandEmpty>
              {recommended.length > 0 && (
                <CommandGroup heading="Suggested for this programme">
                  {recommended.map(row)}
                </CommandGroup>
              )}
              <CommandGroup heading={recommended.length ? 'All courses' : 'Courses'}>
                {rest.map(row)}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {picked && (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onChange(null)}
          aria-label={`Clear ${label}`}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

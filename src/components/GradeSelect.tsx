import { Grade } from '@/types';
import { GRADE_OPTIONS } from '@/data/courseData';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GradeSelectProps {
  value: Grade;
  onChange: (value: Grade) => void;
  label: string;
}

export const GradeSelect = ({ value, onChange, label }: GradeSelectProps) => (
  <Select value={value} onValueChange={(next) => onChange(next as Grade)}>
    <SelectTrigger
      aria-label={label}
      // Masked so the chosen grade never reaches session recording.
      data-hj-suppress
      className={cn('h-9 w-full', value === 'Not finished' && 'text-muted-foreground')}
    >
      <SelectValue placeholder="Not finished" />
    </SelectTrigger>
    {/* The dropdown renders in a portal, outside the trigger, so it needs
        suppressing in its own right — otherwise the open panel shows which
        grade is currently ticked. */}
    <SelectContent data-hj-suppress>
      {GRADE_OPTIONS.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          // A hint, not a child: children are what the closed trigger shows.
          hint={option.points !== null ? (
            <span className="numeric">{option.points.toFixed(1)}</span>
          ) : null}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

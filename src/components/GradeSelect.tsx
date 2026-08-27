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
      className={cn('h-9 w-full', value === 'Not finished' && 'text-muted-foreground')}
    >
      <SelectValue placeholder="Not finished" />
    </SelectTrigger>
    <SelectContent>
      {GRADE_OPTIONS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          <span className="flex items-baseline gap-2">
            <span>{option.label}</span>
            {option.points !== null && (
              <span className="numeric text-xs text-muted-foreground">
                {option.points.toFixed(1)}
              </span>
            )}
          </span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

import { Specialization } from '@/types';
import { SPECIALIZATIONS } from '@/data/courseData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NONE = '__none__';

interface SpecializationSelectProps {
  value: Specialization | null;
  onChange: (value: Specialization | null) => void;
  disabled?: boolean;
  /** Already taken by the other specialisation slot. */
  unavailable?: Specialization | null;
  placeholder?: string;
  label: string;
}

export const SpecializationSelect = ({
  value,
  onChange,
  disabled,
  unavailable,
  placeholder = 'Select specialisation',
  label,
}: SpecializationSelectProps) => (
  <Select
    value={value ?? NONE}
    onValueChange={(next) => onChange(next === NONE ? null : (next as Specialization))}
    disabled={disabled}
  >
    <SelectTrigger aria-label={label} className="h-10 w-full">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={NONE}>{placeholder}</SelectItem>
      {SPECIALIZATIONS.map((spec) => (
        <SelectItem key={spec} value={spec} disabled={spec === unavailable}>
          {spec}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

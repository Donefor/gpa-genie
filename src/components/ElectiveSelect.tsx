import { ElectiveType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NONE = '__none__';

interface ElectiveSelectProps {
  value: ElectiveType | null;
  onChange: (value: ElectiveType | null) => void;
  disabled?: boolean;
  label: string;
}

export const ElectiveSelect = ({ value, onChange, disabled, label }: ElectiveSelectProps) => (
  <Select
    value={value ?? NONE}
    onValueChange={(next) => onChange(next === NONE ? null : (next as ElectiveType))}
    disabled={disabled}
  >
    <SelectTrigger aria-label={label} className="h-10 w-full">
      <SelectValue placeholder="Empty slot" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={NONE}>Empty slot</SelectItem>
      <SelectItem value="Graded">Graded elective</SelectItem>
      <SelectItem value="Pass/Fail">Pass/Fail elective</SelectItem>
    </SelectContent>
  </Select>
);

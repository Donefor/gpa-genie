
import { ElectiveType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ElectiveSelectProps {
  value: ElectiveType;
  onChange: (value: ElectiveType) => void;
  disabled?: boolean;
}

export const ElectiveSelect = ({ value, onChange, disabled }: ElectiveSelectProps) => {
  return (
    <Select 
      value={value || ""} 
      onValueChange={(val) => onChange(val === "remove" ? null : val as ElectiveType)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select elective type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Graded">Graded Elective</SelectItem>
        <SelectItem value="Pass/Fail">Pass/Fail Elective</SelectItem>
        {value && <SelectItem value="remove">Remove Elective</SelectItem>}
      </SelectContent>
    </Select>
  );
};


import { Grade } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradeSelectProps {
  value: Grade;
  onChange: (value: Grade) => void;
  isThirdYear?: boolean;
}

export const GradeSelect = ({ value, onChange, isThirdYear }: GradeSelectProps) => {
  return (
    <div className="flex justify-end">
      <Select value={value || "Not finished"} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Not finished" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Not finished">Not finished</SelectItem>
          <SelectItem value="Pass">Pass (3.0)</SelectItem>
          <SelectItem value="Good">Good (3.5)</SelectItem>
          <SelectItem value="Very good">Very good (4.0)</SelectItem>
          <SelectItem value="Excellent">Excellent (5.0)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

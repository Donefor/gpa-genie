
import { Specialization } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpecializationSelectProps {
  value: Specialization;
  onChange: (value: Specialization) => void;
  disabled?: boolean;
  disabledOptions?: Specialization[];
}

export const SpecializationSelect = ({ value, onChange, disabled, disabledOptions = [] }: SpecializationSelectProps) => {
  const specializations: Specialization[] = [
    'Economics',
    'Finance',
    'Accounting & Financial Management',
    'Marketing',
    'Management'
  ];

  return (
    <Select 
      value={value || ""} 
      onValueChange={(val) => onChange(val as Specialization)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select specialization" />
      </SelectTrigger>
      <SelectContent>
        {specializations.map((spec) => (
          <SelectItem
            key={spec}
            value={spec}
            disabled={disabledOptions.includes(spec)}
          >
            {spec}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

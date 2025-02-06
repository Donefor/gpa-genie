
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
  disabledOptions?: (Specialization | 'ALL')[];
}

export const SpecializationSelect = ({ value, onChange, disabled, disabledOptions = [] }: SpecializationSelectProps) => {
  const specializations: Specialization[] = [
    'Economics',
    'Finance',
    'Accounting & Financial Management',
    'Marketing',
    'Management'
  ];

  // If 'ALL' is in disabledOptions, disable all options
  const isAllDisabled = disabledOptions.includes('ALL');

  return (
    <Select 
      value={value || ""} 
      onValueChange={(val) => onChange(val as Specialization)}
      disabled={disabled || isAllDisabled}
    >
      <SelectTrigger className="w-full">
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

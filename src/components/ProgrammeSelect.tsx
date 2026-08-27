import { PROGRAMMES } from '@/data/programmes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProgrammeSelectProps {
  value: string;
  onChange: (key: string) => void;
}

export const ProgrammeSelect = ({ value, onChange }: ProgrammeSelectProps) => {
  const bachelor = PROGRAMMES.filter((p) => p.level === 'Bachelor');
  const master = PROGRAMMES.filter((p) => p.level === 'Master');

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label="Programme" className="h-10 w-full sm:w-[340px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Bachelor</SelectLabel>
          {bachelor.map((p) => (
            <SelectItem key={p.key} value={p.key}>
              {p.shortName}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Master</SelectLabel>
          {master.map((p) => (
            <SelectItem key={p.key} value={p.key}>
              {p.shortName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

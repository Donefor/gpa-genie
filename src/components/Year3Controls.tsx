
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type ExchangeOption = 'none' | 'fall' | 'spring';
export type ThesisOption = 'none' | 'fall' | 'spring';

interface Year3ControlsProps {
  onExchangeChange: (option: ExchangeOption) => void;
  onInternshipChange: (enabled: boolean) => void;
  onThesisChange: (option: ThesisOption) => void;
  exchangeOption: ExchangeOption;
  hasInternship: boolean;
  thesisOption: ThesisOption;
}

export const Year3Controls = ({
  onExchangeChange,
  onInternshipChange,
  onThesisChange,
  exchangeOption = 'none',
  hasInternship,
  thesisOption
}: Year3ControlsProps) => {
  const handleExchangeChange = (value: ExchangeOption) => {
    if (value === 'none') {
      onExchangeChange('none');
      onThesisChange('none');
    } else {
      onExchangeChange(value);
      if (value === 'fall') {
        onThesisChange('spring');
      } else if (value === 'spring') {
        onThesisChange('fall');
      }
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Select value={exchangeOption} onValueChange={handleExchangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Exchange Program" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Exchange</SelectItem>
          <SelectItem value="fall">Fall Exchange</SelectItem>
          <SelectItem value="spring">Spring Exchange</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={hasInternship ? 'true' : 'false'} 
        onValueChange={(value) => onInternshipChange(value === 'true')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Internship Program" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="false">No Internship</SelectItem>
          <SelectItem value="true">With Internship</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={thesisOption} 
        onValueChange={onThesisChange}
        disabled={exchangeOption !== 'none'}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Thesis Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Thesis</SelectItem>
          <SelectItem value="fall">Fall Thesis</SelectItem>
          <SelectItem value="spring">Spring Thesis</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

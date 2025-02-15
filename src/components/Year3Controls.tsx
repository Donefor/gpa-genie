
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
      // When exchange is selected, automatically set thesis to the opposite semester
      if (value === 'fall') {
        onThesisChange('spring');
      } else if (value === 'spring') {
        onThesisChange('fall');
      }
      // Disable internship when exchange is selected
      if (hasInternship) {
        onInternshipChange(false);
      }
    }
  };

  const handleInternshipChange = (value: boolean) => {
    onInternshipChange(value);
    if (value) {
      // Disable exchange and thesis when internship is selected
      onExchangeChange('none');
      onThesisChange('none');
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
        onValueChange={(value) => handleInternshipChange(value === 'true')}
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
          <SelectItem value="none">Remove Thesis</SelectItem>
          <SelectItem value="fall">Fall Thesis</SelectItem>
          <SelectItem value="spring">Spring Thesis</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};



import { useState } from 'react';
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
  exchangeOption,
  hasInternship,
  thesisOption
}: Year3ControlsProps) => {
  const handleExchangeChange = (value: ExchangeOption) => {
    onExchangeChange(value);
    // If enabling exchange, disable internship
    if (value !== 'none' && hasInternship) {
      onInternshipChange(false);
    }
  };

  const handleInternshipChange = (value: string) => {
    const enabled = value === 'true';
    onInternshipChange(enabled);
    // If enabling internship, disable exchange
    if (enabled && exchangeOption !== 'none') {
      onExchangeChange('none');
    }
  };

  return (
    <div className="flex flex-wrap gap-6 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Exchange Program</label>
        <Select value={exchangeOption} onValueChange={handleExchangeChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select exchange option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Exchange</SelectItem>
            <SelectItem value="fall">Exchange in Fall</SelectItem>
            <SelectItem value="spring">Exchange in Spring</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Internship</label>
        <Select 
          value={hasInternship ? 'true' : 'false'} 
          onValueChange={handleInternshipChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select internship option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">No Internship</SelectItem>
            <SelectItem value="true">Include Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Thesis Period</label>
        <Select 
          value={thesisOption} 
          onValueChange={onThesisChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select thesis period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select Period</SelectItem>
            <SelectItem value="fall">Fall Semester</SelectItem>
            <SelectItem value="spring">Spring Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};


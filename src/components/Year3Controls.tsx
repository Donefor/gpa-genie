
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
  exchangeOption = 'none',
  hasInternship,
  thesisOption
}: Year3ControlsProps) => {
  const handleExchangeChange = (value: ExchangeOption) => {
    if (value === 'none') {
      // When selecting "No Exchange", explicitly trigger the change to remove exchange courses
      onExchangeChange('none');
      // Reset thesis when exchange is disabled
      onThesisChange('none');
    } else {
      onExchangeChange(value);
      // Auto-select thesis period based on exchange selection
      if (value === 'fall') {
        onThesisChange('spring');
      } else if (value === 'spring') {
        onThesisChange('fall');
      }
    }
  };

  const handleInternshipChange = (value: string) => {
    const enabled = value === 'true';
    onInternshipChange(enabled);
    // If enabling internship, reset thesis and remove exchange courses from table
    if (enabled) {
      onThesisChange('none');
    }
  };

  return (
    <div className={`mb-8 w-full bg-muted p-4 rounded-lg shadow-sm`}>
      <div className="flex flex-wrap gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exchange Program</label>
          <Select value={exchangeOption} onValueChange={handleExchangeChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select exchange option" />
            </SelectTrigger>
            <SelectContent className="min-w-[200px]" align="start" position="item-aligned">
              <SelectItem value="none">No Exchange</SelectItem>
              <SelectItem value="fall">Exchange in Fall</SelectItem>
              <SelectItem value="spring">Exchange in Spring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Internship Program</label>
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
            disabled={exchangeOption !== 'none'} // Disable manual thesis selection when exchange is selected
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
    </div>
  );
};


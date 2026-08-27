import { ExchangeOption, ProgramConfig, ThesisOption } from '@/types';
import { year3Conflicts } from '@/utils/program';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OptionField, OptionGroup } from './OptionGroup';

interface Year3OptionsProps {
  config: ProgramConfig;
  onExchangeChange: (option: ExchangeOption) => void;
  onInternshipChange: (enabled: boolean) => void;
  onThesisChange: (option: ThesisOption) => void;
}

export const Year3Options = ({
  config,
  onExchangeChange,
  onInternshipChange,
  onThesisChange,
}: Year3OptionsProps) => {
  const conflicts = year3Conflicts(config);

  return (
    <OptionGroup>
      <OptionField
        label="Exchange"
        hint="Takes a full semester (30 ECTS) and is always graded Pass/Fail."
      >
        <Select
          value={config.exchange}
          onValueChange={(value) => onExchangeChange(value as ExchangeOption)}
        >
          <SelectTrigger aria-label="Exchange" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No exchange</SelectItem>
            <SelectItem value="fall">Autumn exchange</SelectItem>
            <SelectItem value="spring">Spring exchange</SelectItem>
          </SelectContent>
        </Select>
      </OptionField>

      <OptionField
        label="Internship"
        hint={
          conflicts.internshipBlocked
            ? 'Not available alongside an autumn exchange.'
            : 'Runs across the autumn, 7.5 ECTS per period, Pass/Fail.'
        }
      >
        <Select
          value={config.internship ? 'true' : 'false'}
          onValueChange={(value) => onInternshipChange(value === 'true')}
          disabled={conflicts.internshipBlocked}
        >
          <SelectTrigger aria-label="Internship" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">No internship</SelectItem>
            <SelectItem value="true">With internship</SelectItem>
          </SelectContent>
        </Select>
      </OptionField>

      <OptionField
        label="Thesis"
        hint="A single graded 15 ECTS thesis spread over two periods."
      >
        <Select
          value={config.thesis}
          onValueChange={(value) => onThesisChange(value as ThesisOption)}
        >
          <SelectTrigger aria-label="Thesis" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No thesis</SelectItem>
            <SelectItem value="fall" disabled={conflicts.thesisFallBlocked}>
              Autumn thesis
            </SelectItem>
            <SelectItem value="spring" disabled={conflicts.thesisSpringBlocked}>
              Spring thesis
            </SelectItem>
          </SelectContent>
        </Select>
      </OptionField>
    </OptionGroup>
  );
};

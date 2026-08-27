import { ProgramConfig, Specialization } from '@/types';
import { OptionField, OptionGroup } from './OptionGroup';
import { SpecializationSelect } from './SpecializationSelect';

interface Year2OptionsProps {
  config: ProgramConfig;
  onSpecializationChange: (spec: Specialization | null) => void;
  onSecondSpecializationChange: (spec: Specialization | null) => void;
}

export const Year2Options = ({
  config,
  onSpecializationChange,
  onSecondSpecializationChange,
}: Year2OptionsProps) => (
  <OptionGroup>
    <OptionField
      label="Primary specialisation"
      hint="Sets one 7.5 ECTS course in each of the third and fourth periods."
    >
      <SpecializationSelect
        label="Primary specialisation"
        value={config.specialization}
        onChange={onSpecializationChange}
        unavailable={config.secondSpecialization}
      />
    </OptionField>

    <OptionField
      label="Second specialisation"
      hint={
        config.specialization
          ? 'Optional. Takes the elective slot in both periods.'
          : 'Choose a primary specialisation first.'
      }
    >
      <SpecializationSelect
        label="Second specialisation"
        value={config.secondSpecialization}
        onChange={onSecondSpecializationChange}
        unavailable={config.specialization}
        disabled={!config.specialization}
        placeholder="None"
      />
    </OptionField>
  </OptionGroup>
);

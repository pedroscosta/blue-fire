import InputField from '@/components/inputs/InputField';
import NumberSlider, { NumberSliderProps } from '@/components/inputs/NumberSlider';
import { useContext } from 'react';
import { FormFieldProps } from '../Form';
import FormContext from '../FormContext';

type NumericalSliderFieldProps = {
  showStepper?: boolean;
} & NumberSliderProps &
  FormFieldProps;

const NumericalSliderField = ({ name, title, caption, ...rest }: NumericalSliderFieldProps) => {
  const { values, defaultValues, onUpdate } = useContext(FormContext);

  return (
    <InputField inline>
      <InputField.Header>
        <InputField.Label>{title}</InputField.Label>
        {caption && <InputField.Caption>{caption}</InputField.Caption>}
      </InputField.Header>
      <NumberSlider
        defaultValue={defaultValues[name]}
        w="60%"
        value={values[name]}
        onChange={(valueString) => {
          onUpdate?.(name, Number(valueString));
        }}
        {...rest}
      />
    </InputField>
  );
};

export default NumericalSliderField;

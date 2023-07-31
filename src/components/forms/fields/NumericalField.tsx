import InputField from '@/components/inputs/InputField';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FormFieldProps } from '../Form';
import FormContext from '../FormContext';

type NumericalFieldProps = {
  showStepper?: boolean;
} & NumberInputProps &
  FormFieldProps;

const NumericalField = ({ name, title, caption, showStepper, ...rest }: NumericalFieldProps) => {
  const { values, defaultValues, onUpdate } = useContext(FormContext);

  return (
    <InputField inline>
      <InputField.Header>
        <InputField.Label>{title}</InputField.Label>
        {caption && <InputField.Caption>{caption}</InputField.Caption>}
      </InputField.Header>
      <NumberInput
        defaultValue={defaultValues[name]}
        w="60%"
        value={values[name]}
        onChange={(valueString) => {
          onUpdate?.(name, Number(valueString));
        }}
        {...rest}
      >
        <NumberInputField />
        {showStepper && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </NumberInput>
    </InputField>
  );
};

export default NumericalField;

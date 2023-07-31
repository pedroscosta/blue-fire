import { VStack } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import FormContext from './FormContext';

export type FormFieldProps = {
  name: string;
  title: string;
  caption?: string;
};

type FormProps = {
  values: Record<string, any>;
  defaultValues?: Record<string, any>;
  autoSubmit?: boolean;
  onSubmit: (newValues: Record<string, any>) => void;
  children?: ReactNode;
};

const Form = ({ defaultValues = {}, autoSubmit = true, values, onSubmit, children }: FormProps) => {
  const [curValues, setCurValues] = useState(values);

  const onUpdate = (prop: string, value: any) => {
    const newVals = { ...curValues, [prop]: value };
    setCurValues(newVals);
    if (autoSubmit) onSubmit(newVals);
  };

  const context = { onSubmit, values: curValues, defaultValues, onUpdate };

  return (
    <VStack>
      <FormContext.Provider value={context}>{children}</FormContext.Provider>
    </VStack>
  );
};

export default Form;

import { createContext } from 'react';

type FormContext = {
  values: Record<string, any>;
  defaultValues: Record<string, any>;
  onSubmit: (newValues: Record<string, any>) => void;
  onUpdate: (prop: string, value: any) => void;
};

export default createContext<FormContext>({
  values: {},
  defaultValues: {},
  onSubmit: () => {},
  onUpdate: () => {},
});

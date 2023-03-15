import { ReactNode } from 'react';
import Caption from './Caption';
import Label from './Label';

interface InputFieldProps {
  children: ReactNode;
}

const InputField = ({ children }: InputFieldProps) => {
  return <>{children}</>;
};

export default Object.assign(InputField, {
  Label,
  Caption,
});

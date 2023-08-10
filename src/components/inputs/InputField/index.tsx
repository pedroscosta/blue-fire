import { HStack, VStack } from '@chakra-ui/react';
import { Children, cloneElement, isValidElement, ReactNode } from 'react';
import Caption from './Caption';
import Header from './Header';
import Label from './Label';

export interface InputFieldProps {
  children: ReactNode;
  inline?: boolean;
}

const InputField = ({ children, ...rest }: InputFieldProps) => {
  const { inline = false } = rest;
  const Stack = inline ? HStack : VStack;

  return (
    <Stack textAlign="left" alignItems={inline ? 'center' : 'normal'} width="100%">
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, rest) : child,
      )}
    </Stack>
  );
};

export default Object.assign(InputField, {
  Label,
  Header,
  Caption,
});

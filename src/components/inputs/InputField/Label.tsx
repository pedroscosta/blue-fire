import { Text } from '@chakra-ui/react';
import { InputFieldProps } from '.';

const Label = ({ children, inline }: InputFieldProps) => {
  return (
    <Text size="md" fontWeight="semibold" paddingY={inline ? 0 : 1}>
      {children}
    </Text>
  );
};

export default Label;

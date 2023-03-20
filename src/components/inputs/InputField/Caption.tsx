import { Text } from '@chakra-ui/react';
import { InputFieldProps } from '.';

const Caption = ({ children, inline }: InputFieldProps) => {
  return (
    <Text fontSize="sm" fontWeight="light" paddingY={inline ? 0 : 1}>
      {children}
    </Text>
  );
};

export default Caption;

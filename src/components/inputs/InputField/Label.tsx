import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface LabelProps {
  children: ReactNode;
}

const Label = ({ children }: LabelProps) => {
  return (
    <Text size="md" fontWeight="semibold" paddingY={1}>
      {children}
    </Text>
  );
};

export default Label;

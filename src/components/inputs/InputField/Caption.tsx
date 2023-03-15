import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CaptionProps {
  children: ReactNode;
}

const Caption = ({ children }: CaptionProps) => {
  return (
    <Text fontSize="sm" fontWeight="light" paddingY={1}>
      {children}
    </Text>
  );
};

export default Caption;

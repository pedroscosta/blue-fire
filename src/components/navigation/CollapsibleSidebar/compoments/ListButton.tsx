import { Button, forwardRef } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ListButtonProps {
  onClick?: () => void;
  children?: ReactNode;
}

const ListButton = forwardRef(({ children, onClick }: ListButtonProps, ref) => {
  return (
    <Button
      w={'100%'}
      onClick={() => (onClick ? onClick() : {})}
      variant="ghost"
      borderRadius={0}
      ref={ref}
    >
      {children}
    </Button>
  );
});

export default ListButton;

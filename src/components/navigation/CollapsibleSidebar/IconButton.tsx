import { Button, Icon, Tooltip } from '@chakra-ui/react';
import { ElementType } from 'react';

interface IconButtonProps {
  icon: ElementType;
  onClick: () => void;
  title?: string;
  active?: boolean;
}

const IconButton = ({ icon, onClick, title, active = false }: IconButtonProps) => {
  return (
    <Tooltip label={title} placement="auto">
      <Button
        variant="ghost"
        borderRightWidth={active ? 2 : 0}
        borderColor={'bf-highlight'}
        boxSize={12}
        borderRadius={0}
        fontSize="2xl"
        color={active ? 'bf-highlight' : 'bf-divider-highlight'}
        onClick={onClick}
      >
        <Icon as={icon} boxSize={6} />
      </Button>
    </Tooltip>
  );
};

export default IconButton;

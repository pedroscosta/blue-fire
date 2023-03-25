import { IconButton } from '@chakra-ui/react';

const SliderPointer = ({ left, bg }: { left?: number | string; bg?: string }) => {
  return (
    <IconButton
      left={left}
      top="2px"
      minW={0}
      height="20px"
      width="10px"
      transform="translate(-50%, -50%)"
      aria-label={''}
      variant="solid"
      bg={bg ?? 'bf-canvas-default'}
      border={'2px'}
      borderColor={'bf-fg-emphasis'}
      _hover={{
        borderColor: 'bf-fg-muted',
        transition: 'unset',
      }}
      // _active={{ bg: 'bf-border-subtle', borderColor: 'bf-fg-subtle' }}
    />
  );
};

export default SliderPointer;

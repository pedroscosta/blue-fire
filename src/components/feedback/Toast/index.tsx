import { Box, Button, Flex, Icon, Progress, RenderProps, useDisclosure } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';

export interface ToastProps {
  content: ReactNode | string;
  extendedContent?: ReactNode | string;
  indeterminate?: boolean;
}

const Toast = (props: ToastProps & RenderProps) => {
  const { content, onClose, extendedContent, indeterminate = false } = props;
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box
      color="white"
      p={0}
      bg="bf-bg-primary"
      borderColor="divider"
      borderWidth={'1px'}
      minW={'28rem'}
      maxW={'28rem'}
      position="relative"
    >
      <Flex position="absolute" right={1} top={1} direction={'row-reverse'}>
        <Button onClick={onClose} size={'2xs'} variant="ghost" verticalAlign={'center'}>
          <Icon as={MdClose} boxSize={5} />
          {/* <Text fontSize="xs" paddingRight={1}></Text> */}
        </Button>
        {extendedContent && (
          <Button onClick={onToggle} size={'2xs'} variant="ghost" verticalAlign={'center'}>
            <Icon as={isOpen ? IoChevronUp : IoChevronDown} boxSize={5} />
          </Button>
        )}
      </Flex>
      <Box p={3}>
        {content}
        <br />
        {isOpen && extendedContent}
      </Box>
      {indeterminate && <Progress size="xs" isIndeterminate marginTop={2} />}
    </Box>
  );
};

export default Toast;

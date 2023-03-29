import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Icon,
  Progress,
  Text,
  useDisclosure,
  useMultiStyleConfig,
  UseToastOptions,
} from '@chakra-ui/react';
import { ElementType, ReactNode } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {
  MdCheckCircleOutline,
  MdClose,
  MdErrorOutline,
  MdInfoOutline,
  MdWarningAmber,
} from 'react-icons/md';

export interface ToastProps {
  content: ReactNode | string;
  extendedContent?: ReactNode | string;
  progress?: number;
}

const STATUSES: Record<string, { icon?: ElementType; colorScheme: string }> = {
  info: { icon: MdInfoOutline, colorScheme: 'blue' },
  warning: { icon: MdWarningAmber, colorScheme: 'orange' },
  success: { icon: MdCheckCircleOutline, colorScheme: 'green' },
  error: { icon: MdErrorOutline, colorScheme: 'red' },
  loading: { colorScheme: 'blue' },
};

type RenderProps = Parameters<NonNullable<UseToastOptions['render']>>[0];

const Toast = (props: ToastProps & RenderProps) => {
  const { content, onClose, extendedContent, progress, status = 'info' } = props;
  const { isOpen, onToggle } = useDisclosure();

  const iconColor = (
    (
      useMultiStyleConfig('Alert', { colorScheme: STATUSES[status].colorScheme, variant: 'subtle' })
        .container as any
    )['--alert-fg'] as string
  ).substring(7);

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
      <Box p={3} whiteSpace="pre-wrap">
        <Flex alignItems="center" gap={2}>
          {status !== 'loading' ? (
            <Icon as={STATUSES[status].icon} boxSize={5} color={iconColor} />
          ) : (
            <CircularProgress isIndeterminate size={5} color={iconColor} />
          )}
          {content}
        </Flex>
        {isOpen && (
          <Text fontSize="sm" m={2}>
            {extendedContent}
          </Text>
        )}
      </Box>
      {progress !== undefined && <Progress size="xs" value={progress} marginTop={2} />}
    </Box>
  );
};

export default Toast;

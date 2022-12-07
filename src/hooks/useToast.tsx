import Toast, { ToastProps } from '@/components/feedback/Toast';
import { useToast, UseToastOptions } from '@chakra-ui/react';

interface UseToastProps extends UseToastOptions, ToastProps {}

const useCustomToast = (props: UseToastProps) => {
  const { content, indeterminate, duration, ...rest } = props || {};
  return useToast({
    position: 'bottom-right',
    duration: indeterminate ? null : duration,
    render: ({ onClose }) => (
      <Toast content={content} onClose={onClose} indeterminate={indeterminate} {...rest} />
    ),
    ...rest,
  });
};

export default useCustomToast;

import Toast, { ToastProps } from '@/components/feedback/Toast';
import { ToastId, useToast, UseToastOptions } from '@chakra-ui/react';

interface UseToastProps extends UseToastOptions, ToastProps {
  id?: ToastId;
}

const useCustomToast = () => {
  const toast = useToast();

  const toastOptions = (props: UseToastProps) => {
    const { content, indeterminate, duration, id, ...rest } = props || {};

    return {
      position: 'bottom-right',
      duration: indeterminate ? null : duration,
      render: ({ onClose }) => (
        <Toast content={content} onClose={onClose} indeterminate={indeterminate} {...rest} />
      ),
      id,
    } as UseToastOptions;
  };

  const add = (props: UseToastProps) => toast(toastOptions(props));

  const update = (id: ToastId, props: UseToastProps) => toast.update(id, toastOptions(props));

  const close = (id: ToastId) => toast.close(id);

  const closeAll = () => toast.closeAll();

  const isActive = (id: ToastId) => toast.isActive(id);

  return { add, close, closeAll, update, isActive };
};

export default useCustomToast;

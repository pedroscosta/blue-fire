import Toast, { ToastProps } from '@/components/feedback/Toast';
import { cleanUndefinedProps } from '@/utils/objects';
import { ToastId, useToast, UseToastOptions } from '@chakra-ui/react';

export interface UseToastProps extends UseToastOptions, ToastProps {
  id?: ToastId;
}

const useCustomToast = () => {
  const toast = useToast();

  const toastOptions = (props: UseToastProps) => {
    const { content, duration, id, onCloseComplete, ...rest } = props || {};

    return cleanUndefinedProps({
      position: 'bottom-right',
      render: ({ onClose }) => <Toast content={content} onClose={onClose} {...rest} />,
      duration,
      id,
      onCloseComplete,
    } as UseToastOptions);
  };

  const add = (props: UseToastProps) => toast(toastOptions(props));

  const update = (id: ToastId, props: UseToastProps) => toast.update(id, toastOptions(props));

  const close = (id: ToastId) => toast.close(id);

  const closeAll = () => toast.closeAll();

  const isActive = (id: ToastId) => toast.isActive(id);

  return { add, close, closeAll, update, isActive };
};

export default useCustomToast;

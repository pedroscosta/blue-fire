import { Button, ButtonProps, Tooltip, TooltipProps } from '@chakra-ui/react';

type Props = Omit<TooltipProps & ButtonProps, 'children'> & { children?: React.ReactNode };

const TooltipButton = (props: Props) => {
  const fixedProps = { label: props['aria-label'], ...props };

  return (
    <Tooltip {...{ ...fixedProps, boxSize: undefined }}>
      <Button {...fixedProps}>{fixedProps.children}</Button>
    </Tooltip>
  );
};

export default TooltipButton;

import { IconButton, IconButtonProps, Tooltip, TooltipProps } from '@chakra-ui/react';

type Props = Omit<TooltipProps & IconButtonProps, 'children'> & { children?: React.ReactNode };

const TooltipIconButton = (props: Props) => {
  const fixedProps = { label: props['aria-label'], ...props };

  return (
    <Tooltip {...{ ...fixedProps, boxSize: undefined }}>
      <IconButton {...fixedProps}>{fixedProps.children}</IconButton>
    </Tooltip>
  );
};

export default TooltipIconButton;

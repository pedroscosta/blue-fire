import {
  AccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  AccordionPanelProps,
  Spacer,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface WrapperProps extends AccordionItemProps {
  title: string;
  children: ReactNode;
  buttonProps?: AccordionButtonProps;
  panelProps?: AccordionPanelProps;
}

const AccordionItemWrapper = ({
  children,
  title,
  panelProps,
  buttonProps,
  ...rest
}: WrapperProps) => {
  return (
    <AccordionItem {...rest}>
      <AccordionButton {...buttonProps}>
        {title}
        <Spacer />
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel {...panelProps}>{children}</AccordionPanel>
    </AccordionItem>
  );
};

export default AccordionItemWrapper;

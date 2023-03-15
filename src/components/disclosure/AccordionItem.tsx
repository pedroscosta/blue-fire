import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionPanelProps,
  Box,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface WrapperProps {
  title: string;
  children: ReactNode;
  pl?: number;
  pr?: number;
  panelProps?: AccordionPanelProps;
}

const AccordionItemWrapper = ({ children, title, pl, pr, panelProps }: WrapperProps) => {
  return (
    <AccordionItem>
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left" pl={pl} pr={pr}>
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel {...panelProps}>{children}</AccordionPanel>
    </AccordionItem>
  );
};

export default AccordionItemWrapper;

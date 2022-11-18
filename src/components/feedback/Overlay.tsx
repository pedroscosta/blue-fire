import { Box, HTMLChakraProps, ThemingProps, useStyleConfig } from '@chakra-ui/react';

export interface OverlayProps extends HTMLChakraProps<'div'>, ThemingProps {
  icon?: React.ReactElement;
}

const Overlay = ({ children, variant, icon, ...rest }: OverlayProps) => {
  const styles = useStyleConfig('Overlay', { variant });

  return (
    <Box __css={styles} {...rest}>
      <>
        {icon}
        {children}
      </>
    </Box>
  );
};

export default Overlay;

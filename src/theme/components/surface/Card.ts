import type { StyleConfig } from '@chakra-ui/react';

const style: StyleConfig = {
  baseStyle: ({ condensed, borderRadius }) => ({
    container: {
      bg: 'transparent',
      padding: 0,
      shadow: 'none',
      borderWidth: '1px',
      borderColor: 'inherent',
      borderRadius: borderRadius ?? 'md',
    },
    header: {
      paddingY: condensed ? '8px' : '16px',
      paddingX: '16px',
      borderTopRadius: borderRadius ?? 'md',
      borderBottomWidth: '1px',
      bg: 'canvas.subtle',
      color: 'fg.emphasis',
      display: 'flex',
      flexDir: 'row',
    },
    body: {
      paddingY: condensed ? '8px' : '16px',
      paddingX: '16px',
    },
    footer: {
      paddingY: condensed ? '8px' : '16px',
      paddingX: '16px',
      borderBottomRadius: borderRadius ?? 'md',
      borderTopWidth: '1px',
      display: 'flex',
      flexDir: 'row',
    },
  }),
  variants: {
    subtle: ({ condensed }) => ({
      container: {
        bg: 'transparent',
        color: 'fg.default',
      },
    }),
  },
};

export default style;

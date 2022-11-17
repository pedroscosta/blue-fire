import { extendTheme, StyleConfig, ThemeConfig } from '@chakra-ui/react';
import { Styles } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const semanticTokens = {
  // It seems like extension types aren't the best right now. https://github.com/chakra-ui/chakra-ui/issues/4573 and https://github.com/chakra-ui/chakra-ui/issues/4226#issuecomment-904630320
  colors: {
    'bf-bg-primary': {
      _light: 'white',
      _dark: 'gray.800',
    },
    'bf-bg-highlight': {
      _light: 'gray.100',
      _dark: 'gray.700',
    },
    'bf-divider': {
      _light: 'gray.200',
      _dark: 'whiteAlpha.300',
    },
  },
};

const components: Record<string, StyleConfig> = {
  CustomBadge: {
    baseStyle: ({ colorMode }) => ({
      bg: colorMode === 'dark' ? 'green.300' : 'green.500',
      color: colorMode === 'dark' ? 'gray.800' : 'white',
      textTransform: 'uppercase',
      fontWeight: 'semibold',
      letterSpacing: '0.02em',
      padding: '4px',
      borderRadius: '2px',
      fontSize: '12px',
    }),
    variants: {
      custom: ({ colorMode }) => ({
        bg: colorMode === 'dark' ? 'blue.200' : 'blue.500',
        padding: '8px',
      }),
    },
  },
  Menu: {
    sizes: {
      context: {
        item: {
          fontSize: '0.5rem',
          px: 1,
          py: 0.5,
        },
        list: {
          py: 0,
          minWidth: 24,
        },
      },
      sm: {
        item: {
          fontSize: '0.75rem',
          px: 2,
          py: 1,
        },
        list: {
          py: 1,
          minWidth: 32,
        },
      },
      md: {
        item: {
          fontSize: '0.875rem',
          px: 2,
          py: 1,
        },
        list: {
          py: 1,
        },
      },
    },
  },
};

const styles: Styles = {
  global: (props) => ({
    '.butterflies-link': {
      stroke: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
      strokeWidth: '2px',
    },
  }),
};

const Theme = extendTheme({ config, semanticTokens, components, styles });

export default Theme;

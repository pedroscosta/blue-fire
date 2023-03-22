import { cssVar, extendTheme, StyleConfig, ThemeConfig } from '@chakra-ui/react';
import { Styles } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const semanticTokens = {
  // It seems like extension types aren't the best right now. https://github.com/chakra-ui/chakra-ui/issues/4573 and https://github.com/chakra-ui/chakra-ui/issues/4226#issuecomment-904630320
  colors: {
    'bf-canvas-default': {
      _light: 'white',
      _dark: 'gray.900',
    },
    'bf-canvas-subtle': {
      _light: 'gray.100',
      _dark: 'gray.800',
    },
    'bf-fg-default': {
      _light: 'gray.900',
      _dark: 'gray.100',
    },
    'bf-fg-subtle': {
      _light: 'gray.500',
      _dark: 'gray.400',
    },
    'bf-fg-muted': {
      _light: 'gray.600',
      _dark: 'gray.300',
    },
    'bf-fg-emphasis': {
      _light: 'white',
      _dark: 'white',
    },
    'bf-border-default': {
      _light: 'gray.200',
      _dark: 'gray.600',
    },
    'bf-border-subtle': {
      _light: 'gray.100',
      _dark: 'gray.700',
    },
    // DEPRECATED COLORS (TO-BE REMOVED)
    'bf-canvas-primary': {
      _light: 'white',
      _dark: 'gray.900',
    },
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
    'bf-divider-highlight': {
      _light: 'gray.400',
      _dark: 'whiteAlpha.500',
    },
    'bf-highlight': {
      _light: 'blue.600',
      _dark: 'white',
    },
  },
};

const components: Record<string, StyleConfig> = {
  Overlay: {
    baseStyle: ({ colorMode }) => ({
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px',
      display: 'flex',
      flexDirection: 'column',
      bg: colorMode === 'dark' ? 'whiteAlpha.300' : 'blackAlpha.300',
      color: colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.700',
      textTransform: 'uppercase',
      fontWeight: 'semibold',
      letterSpacing: '0.02em',
      padding: '4px',
      fontSize: '2.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      outlineStyle: 'dashed',
      outlineWidth: '0.3rem',
      outlineOffset: '-1.5rem',
      outlineColor: colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300',
      zIndex: 1000,
    }),
    variants: {
      success: ({ colorMode }) => ({
        bg: colorMode === 'dark' ? 'blue.200' : 'blue.500',
        color: colorMode === 'dark' ? 'blue.200' : 'blue.500',
        padding: '8px',
        outlineColor: colorMode === 'dark' ? 'rgba(154, 230, 180, 0.16)' : 'green.100',
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
  Accordion: {
    baseStyle: {
      button: {
        _expanded: {
          bg: 'bf-canvas-subtle',
          borderBottom: '1px',
          borderColor: 'bf-divider',
        },
      },
      panel: {
        paddingX: 0,
        paddingY: 2,
      },
    },
  },
  Popover: {
    baseStyle: {
      content: {
        [cssVar('popper-arrow-bg').variable]: 'colors.bf-canvas-subtle',
        // TODO: FIX ARROW COLOR (https://github.com/chakra-ui/chakra-ui/issues/7476)
        bg: 'bf-canvas-subtle',
        borderColor: 'bf-border-default',
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
    body: {
      bg: 'bf-canvas-primary',
    },
    [cssVar('popper-arrow-shadow-color').variable]: 'white',
  }),
};

const Theme = extendTheme({ config, semanticTokens, components, styles });

export default Theme;

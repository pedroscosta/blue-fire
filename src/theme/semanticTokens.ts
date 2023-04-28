import { merge } from 'lodash';
import colors, { Colors } from './colors';

export type TokenMap = Record<
  string,
  { baseColor: [string, string]; variants: Record<string, [Variant, Variant]> }
>;
export type Variant = { shade: number; alpha?: number };

const computeVariantHex = (baseColor: string, shade: number, alpha?: number) =>
  (typeof colors[baseColor] === 'string'
    ? colors[baseColor]
    : (colors[baseColor] as Record<number, string>)[shade]) +
  Math.round((alpha ?? 1) * 255).toString(16);

export const tokensFromColors = (tokenMap: TokenMap, colors: Colors, prefix = '') => {
  const tokens: [string, { _light: string; _dark: string }][] = [];

  Object.entries(tokenMap).forEach(([tokenBaseName, token]) => {
    Object.entries(token.variants).forEach(([variantName, variant]) => {
      tokens.push([
        `${prefix + tokenBaseName}.${variantName}`,
        {
          _light: computeVariantHex(token.baseColor[0], variant[0].shade, variant[0].alpha),
          _dark: computeVariantHex(token.baseColor[1], variant[1].shade, variant[1].alpha),
        },
      ]);
    });
  });

  return {
    colors: Object.fromEntries(tokens),
  };
};

export default merge(
  {
    colors: {
      'canvas.default': {
        _light: 'white',
        _dark: 'gray.900',
      },
      'canvas.subtle': {
        _light: 'gray.100',
        _dark: 'gray.800',
      },
      'fg.default': {
        _light: 'gray.900',
        _dark: 'gray.100',
      },
      'fg.subtle': {
        _light: 'gray.500',
        _dark: 'gray.400',
      },
      'fg.muted': {
        _light: 'gray.600',
        _dark: 'gray.300',
      },
      'fg.emphasis': {
        _light: 'white',
        _dark: 'white',
      },
      'border.default': {
        _light: 'gray.200',
        _dark: 'gray.600',
      },
      'border.subtle': {
        _light: 'gray.100',
        _dark: 'gray.700',
      },
      // DEPRECATED TOKENS (TO-BE REMOVED)
      // TODO: Remove any mentions to tokens starting in 'bf-'
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
  },

  tokensFromColors(
    {
      accent: {
        baseColor: ['blue', 'blue'],
        variants: {
          fg: [{ shade: 500 }, { shade: 500 }],
          emphasis: [{ shade: 500 }, { shade: 500 }],
          muted: [
            { shade: 500, alpha: 0.4 },
            { shade: 500, alpha: 0.4 },
          ],
          subtle: [
            { shade: 500, alpha: 0.1 },
            { shade: 500, alpha: 0.1 },
          ],
        },
      },
      success: {
        baseColor: ['green', 'green'],
        variants: {
          fg: [{ shade: 600 }, { shade: 300 }],
          emphasis: [{ shade: 500 }, { shade: 500 }],
          muted: [
            { shade: 500, alpha: 0.4 },
            { shade: 500, alpha: 0.4 },
          ],
          subtle: [
            { shade: 500, alpha: 0.1 },
            { shade: 500, alpha: 0.1 },
          ],
        },
      },
      attention: {
        baseColor: ['yellow', 'yellow'],
        variants: {
          fg: [{ shade: 600 }, { shade: 300 }],
          emphasis: [{ shade: 500 }, { shade: 500 }],
          muted: [
            { shade: 500, alpha: 0.4 },
            { shade: 500, alpha: 0.4 },
          ],
          subtle: [
            { shade: 500, alpha: 0.1 },
            { shade: 500, alpha: 0.1 },
          ],
        },
      },
      severe: {
        baseColor: ['orange', 'orange'],
        variants: {
          fg: [{ shade: 600 }, { shade: 300 }],
          emphasis: [{ shade: 500 }, { shade: 500 }],
          muted: [
            { shade: 500, alpha: 0.4 },
            { shade: 500, alpha: 0.4 },
          ],
          subtle: [
            { shade: 500, alpha: 0.1 },
            { shade: 500, alpha: 0.1 },
          ],
        },
      },
      danger: {
        baseColor: ['red', 'red'],
        variants: {
          fg: [{ shade: 600 }, { shade: 300 }],
          emphasis: [{ shade: 500 }, { shade: 500 }],
          muted: [
            { shade: 500, alpha: 0.4 },
            { shade: 500, alpha: 0.4 },
          ],
          subtle: [
            { shade: 500, alpha: 0.1 },
            { shade: 500, alpha: 0.1 },
          ],
        },
      },
    },
    colors,
  ),
);

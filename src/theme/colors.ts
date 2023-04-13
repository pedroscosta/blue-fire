import palette from './palette.json';

export type Palette = Record<string, string[] | string>;

export const chakraColorsFromPalette = (palette: Palette) => {
  return Object.fromEntries(
    Object.entries(palette).map(([k, v]) => [
      k,
      typeof v === 'string' ? v : Object.fromEntries(v.map((v_, k_) => [k_ * 100, v_])),
    ]),
  );
};

export default chakraColorsFromPalette(palette);

export type Colors = ReturnType<typeof chakraColorsFromPalette>;

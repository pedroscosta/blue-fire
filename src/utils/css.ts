export type CssUnits = 'ch' | 'ex' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'pt' | 'pc' | 'px';

export function parseUnit(value: string) {
  const match = value.match(/^(0?[-.]?\d+)(r?e[m|x]|v[h|w|min|max]+|p[x|t|c]|[c|m]m|%|s|in|ch)$/);

  return match ? { value: Number(match[1]), unit: match[2] } : { value, unit: undefined };
}

const PIXELS_PER_INCH = 96;

const unitsToPx: Record<string, number> = {
  ch: 8,
  ex: 7.15625,
  em: 16,
  rem: 16,
  in: PIXELS_PER_INCH,
  cm: PIXELS_PER_INCH / 2.54,
  mm: PIXELS_PER_INCH / 25.4,
  pt: PIXELS_PER_INCH / 72,
  pc: PIXELS_PER_INCH / 6,
  px: 1,
  '%': 1,
};

export function convertUnit(
  value: string | number,
  targetUnit: CssUnits = 'px',
  referenceValue?: number,
) {
  value = value.toString();

  const { value: value_, unit } = parseUnit(value);

  if (!unit || !unitsToPx[unit]) return 0;

  if (unit === '%')
    return referenceValue ? (value_ * referenceValue) / 100 / unitsToPx[targetUnit] : 0;

  return (value_ * unitsToPx[unit]) / unitsToPx[targetUnit];
}

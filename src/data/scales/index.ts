import { AnyD3Scale, scaleBand, scaleLinear } from '@visx/scale';
import { DataType } from 'bluefire';

const generateScales = (type: DataType, props: Record<string, any>): AnyD3Scale => {
  if (type === DataType.CATEGORY) {
    return scaleBand<string>({
      padding: 1 - (props['band-band'] ?? 0),
      align: props['band-align'] ?? 0,
    });
  }

  return scaleLinear<number>({});
};

export { generateScales };

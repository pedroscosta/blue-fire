import { AnyD3Scale } from '@visx/scale';

export const getBandwidth = (scale: AnyD3Scale): number => {
  const anyScale = scale as any; // This is because we're accessing unkown properties for the type AnyD3Scale
  console.log('typeof', anyScale.bandwidth, typeof anyScale.bandwidth);
  if (anyScale.bandwidth !== undefined && typeof anyScale.bandwidth === 'function')
    return anyScale.bandwidth();

  return 0;
};

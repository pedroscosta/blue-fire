import { AnyD3Scale } from '@visx/scale';
import { createContext } from 'react';

interface ChartContextType {
  series: Record<string, AnyD3Scale>;
  setSeries: (id: string, scale: AnyD3Scale) => void;
}

const initialValue: ChartContextType = {
  series: {},
  setSeries: (id: string, scale: AnyD3Scale) => {},
};

const ChartContext = createContext<ChartContextType>(initialValue);

export default ChartContext;

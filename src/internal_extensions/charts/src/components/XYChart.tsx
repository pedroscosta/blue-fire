import { ParentSize } from '@visx/responsive';
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart as VisXYChart,
} from '@visx/xychart';

interface XYChartProps {
  id: string;
  tabId: string;
}

const data = [
  { x: '2020-01-01', y: 50 },
  { x: '2020-01-02', y: 10 },
  { x: '2020-01-03', y: 20 },
];

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

const XYChart = (props: XYChartProps) => {
  return (
    <ParentSize>
      {({ width: visWidth, height: visHeight }) => (
        <VisXYChart width={visWidth} height={visHeight}>
          <AnimatedAxis orientation="bottom" />
          <AnimatedGrid columns={false} numTicks={4} />
          <AnimatedLineSeries dataKey="Line 1" data={data} {...accessors} />
        </VisXYChart>
      )}
    </ParentSize>
  );
};
export default XYChart;

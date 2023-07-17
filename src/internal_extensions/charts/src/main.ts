import { ChartComponentType, charts } from 'bluefire';
import { MdShowChart } from 'react-icons/md';
import AxisComponent from './components/AxisComponent';
import LineChart, { LineChartErrorCheck, LineChartProps } from './components/LineChart';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const activate = () => {
  // Charts
  charts.registerComponent({
    id: 'bf:line-chart',
    name: 'Line Chart',
    component: LineChart,
    type: ChartComponentType.CHART,
    baseType: 'bf:xy-chart',
    icon: MdShowChart,
    props: LineChartProps,
    validation: LineChartErrorCheck,
  });
  // Accessories
  charts.registerComponent(AxisComponent);
};

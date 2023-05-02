import { ChartComponentType, charts } from 'bluefire';
import { MdShowChart } from 'react-icons/md';
import XYChart from './components/AxisComponent';
import LineChart, { LineChartErrorCheck, LineChartProps } from './components/LineChart';

export const activate = () => {
  // Chart types
  charts.registerBaseType('bf:xy-chart', 'XY Chart', XYChart);
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
};

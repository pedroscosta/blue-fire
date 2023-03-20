import { ChartComponentType, charts } from 'bluefire';
import { MdShowChart } from 'react-icons/md';
import LineChart, { LineChartProps } from './components/LineChart';
import XYChart from './components/XYChart';

export interface ChartProps {
  id: string;
  tabId: string;
}

export const activate = () => {
  charts.registerBaseType('bf:xy-chart', 'XY Chart', XYChart);
  charts.registerComponent(
    'bf:line-chart',
    'Line Chart',
    LineChart,
    ChartComponentType.CHART,
    'bf:xy-chart',
    MdShowChart,
    LineChartProps,
  );
};

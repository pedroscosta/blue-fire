import { Axis } from '@visx/axis';
import { scaleLinear, scalePoint } from '@visx/scale';
import {
  ChartComponentProps,
  ChartComponentSizeCalculator,
  ChartComponentType,
  ComponentPropertiesRegister,
  ComponentPropertyType,
  RegisterChartData
} from 'bluefire';
import { max, min, zipWith } from 'lodash';
import { TbAxisX } from 'react-icons/tb';
import { ArrayElement } from '../main';

const isXOriented = (dock: string) => {
  return ['LEFT', 'RIGHT'].includes(dock);
}

// data accessors
const getX = (d: any) => d.x;
const getY = (d: any) => d.y;

// scales
const xScale = scalePoint<string>({});

const yScale = scaleLinear<number>({});

const component = ({ width, height, data, dock, margins }: ChartComponentProps) => {
  const xData = zipWith(data.dimensions[0], data.measures[0], (d, m) => ({ x: d, y: m }));

  type LineData = ArrayElement<typeof xData>;

  xScale.range([margins.LEFT, width - margins.RIGHT]);
  xScale.domain(data.dimensions[0]);

  // xScale.paddingInner(0);
  // xScale.paddingOuter(0);

  const minY = min(data.measures[0]);
  const maxY = max(data.measures[0]);
  const rangeY = maxY - minY;

  yScale.range([margins.TOP, height - margins.BOTTOM]);
  yScale.domain([minY - rangeY * 0.05, maxY + rangeY * 0.05]);

  console.log('axis', [0, width], xScale('c'));

  return <Axis orientation={dock.toLowerCase() as any} scale={isXOriented(dock) ? yScale : xScale} left={dock === "LEFT" ? width : 0} top = {dock === "TOP" ? height : 0} stroke='#FFF'/>;
};

const defaultProps = {
  'line-color': 'blue.400',
  'line-thickness': 4,
};

export const props: ComponentPropertiesRegister = {
  appearance: {
    title: 'Appearance',
    groups: [
      {
        title: 'Line',
        properties: {
          'line-color': {
            name: 'Color',
            desc: 'Line color',
            type: ComponentPropertyType.COLOR,
            defaultValue: defaultProps['line-color'],
          },
          'line-thickness': {
            name: 'Thickness',
            desc: 'Line width (px)',
            type: ComponentPropertyType.NUMBER,
            defaultValue: defaultProps['line-thickness'],
            inputProps: {
              min: 0,
              // step: 1,
              precision: 0,
            },
          },
          'line-dashed': {
            name: 'Dashed',
            desc: 'Use a dashed stroke',
            type: ComponentPropertyType.BOOLEAN,
            defaultValue: false,
          },
        },
      },
    ],
  },
};

// Size calculator

const sizeCalculator: ChartComponentSizeCalculator = (data, props, dock) => {
  return 20;
};

export default {
  id: 'bf:axis-component',
  name: 'Axis',
  component,
  type: ChartComponentType.ACCESSORY,
  baseType: 'bf:xy-chart',
  icon: TbAxisX,
  props,
  allowedDocks: ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'],
  sizeCalculator
} satisfies RegisterChartData;

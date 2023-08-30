import * as xCurves from '@visx/curve';
import { LinePath } from '@visx/shape';
import {
  ChartComponentErrorCheck,
  ChartComponentProps,
  colors,
  ComponentPropertiesRegister,
  ComponentPropertyType,
} from 'bluefire';
import { max, min, zipWith } from 'lodash';
import { ArrayElement } from '../main';
import { getBandwidth } from '../utils/safeAcessors';

const curves = {
  Basis: xCurves.curveBasis,
  'Basis (closed)': xCurves.curveBasisClosed,
  'Basis (open)': xCurves.curveBasisOpen,
  Bundle: xCurves.curveBundle,
  Cardinal: xCurves.curveCardinal,
  'Cardinal (closed)': xCurves.curveCardinalClosed,
  'Cardinal (open)': xCurves.curveCardinalOpen,
  'Catmull-Rom': xCurves.curveCatmullRom,
  'Catmull-Rom (closed)': xCurves.curveCatmullRomClosed,
  'Catmull-Rom (open)': xCurves.curveCatmullRomOpen,
  Linear: xCurves.curveLinear,
  'Linear (closed)': xCurves.curveLinearClosed,
  'Monotone (X)': xCurves.curveMonotoneX,
  'Monotone (Y)': xCurves.curveMonotoneY,
  Natural: xCurves.curveNatural,
  Step: xCurves.curveStep,
  'Step (after)': xCurves.curveStepAfter,
  'Step (before)': xCurves.curveStepBefore,
};

// data accessors
const getX = (d: any) => d.x;
const getY = (d: any) => d.y;

const LineChart = ({ width, height, data, props, scales }: ChartComponentProps) => {
  const xScale = scales.dimensions[0];
  const yScale = scales.measures[0];

  const xData = zipWith(data.dimensions[0], data.measures[0], (d, m) => ({ x: d, y: m }));

  type LineData = ArrayElement<typeof xData>;

  xScale.range([0, width]);
  xScale.domain(data.dimensions[0]);

  const minY = min(data.measures[0]);
  const maxY = max(data.measures[0]);
  const rangeY = maxY - minY;

  yScale.range([0, height]);
  yScale.domain([minY - rangeY * 0.05, maxY + rangeY * 0.05]);

  const strokeWidth = props?.['line-thickness'] || defaultProps['line-thickness'];

  return (
    <LinePath<LineData>
      curve={Object.values(curves)[props?.['line-curve'] || 0]}
      data={xData}
      x={(d) => (xScale(getX(d)) ?? 0) + getBandwidth(xScale) / 2}
      y={(d) => yScale(getY(d)) ?? 0}
      stroke={
        props?.['line-color']
          ? colors.safeHsvaToHexa(props['line-color'])
          : colors.getNamedColor(defaultProps['line-color'], true)
      }
      strokeWidth={strokeWidth}
      strokeDasharray={
        props?.['line-dashed'] ? `${2.5 * strokeWidth},${3.75 * strokeWidth}` : undefined
      }
      strokeOpacity={1}
      shapeRendering="geometricPrecision"
    />
  );
};

export default LineChart;

const defaultProps = {
  'line-color': 'blue.400',
  'line-thickness': 4,
};

export const LineChartProps: ComponentPropertiesRegister = {
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
          'line-curve': {
            name: 'Curve type',
            desc: 'Curve function',
            type: ComponentPropertyType.SELECT,
            defaultValue: 0,
            options: Object.keys(curves),
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

export const LineChartErrorCheck: ChartComponentErrorCheck = (data, props) => {
  if (
    !data ||
    !data.dimensions ||
    data.dimensions.length === 0 ||
    !data.measures ||
    data.measures.length === 0
  )
    return { title: 'No data loaded' };

  const d = data.dimensions[0];

  for (const m of data.measures) {
    if (m.length !== d.length)
      return {
        title: 'Invalid data',
        message: `Measures and dimensions don't have matching lengths`,
      };
  }
};

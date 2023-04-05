import { hsvaToHexa } from '@uiw/color-convert';
import { curveBasis } from '@visx/curve';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { ComponentPropertiesRegister, ComponentPropertyType, getStore } from 'bluefire';
import { useEffect, useState } from 'react';
import { ChartProps } from '../main';

const data = [
  { x: 10, y: 20 },
  { x: 20, y: 50 },
  { x: 40, y: 10 },
];

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type LineData = ArrayElement<typeof data>;

// data accessors
const getX = (d: any) => d.x;
const getY = (d: any) => d.y;

// scales
const xScale = scaleLinear<number>({
  domain: [0, 50],
});

const yScale = scaleLinear<number>({
  domain: [0, 50],
});

const LineChart = ({ width, height, id, tabId, compId }: ChartProps) => {
  const [compProps, setCompProps] = useState<any>();

  useEffect(
    () =>
      getStore().subscribe(
        (s) => s.sheets.sheets[tabId][id]?.components[compId]?.props, //
        (props) => setCompProps(props),
      ),
    [],
  );

  xScale.range([0, width]);
  yScale.range([0, height]);

  // console.log(compProps, tabId, id, compId);

  return (
    <LinePath<LineData>
      curve={curveBasis}
      data={data}
      x={(d) => xScale(getX(d)) ?? 0}
      y={(d) => yScale(getY(d)) ?? 0}
      stroke={compProps?.['line-color'] ? hsvaToHexa(compProps['line-color']) : undefined}
      strokeWidth={4}
      strokeOpacity={1}
      shapeRendering="geometricPrecision"
    />
  );
};

export default LineChart;

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
            defaultValue: 'blue.400',
          },
        },
      },
    ],
  },
};

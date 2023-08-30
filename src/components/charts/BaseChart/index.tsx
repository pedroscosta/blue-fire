import ChartError from '@/components/feedback/ChartError';
import { generateScales } from '@/data/scales';
import { useStore } from '@/store';
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import { ElementType } from '@react-spring/web';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import {
  ChartComponent,
  ChartComponentData,
  ChartComponentProps,
  ChartDataMargins,
  QueriedChartData,
} from 'bluefire';
import { MdDeleteOutline, MdMoreVert } from 'react-icons/md';
import shallow from 'zustand/shallow';

type ElementPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const getElementMargins = (
  dock: string,
  margins: ChartDataMargins,
  parentSize: { width: number; height: number },
): ElementPosition => {
  switch (dock) {
    case 'LEFT':
      return { top: 0, left: 0, width: margins.LEFT, height: parentSize.height };
    case 'RIGHT':
      return {
        top: 0,
        left: parentSize.width - margins.RIGHT,
        width: margins.RIGHT,
        height: parentSize.height,
      };
    case 'TOP':
      return { top: 0, left: 0, width: parentSize.width, height: margins.TOP };
    case 'BOTTOM':
      return {
        top: parentSize.height - margins.BOTTOM,
        left: 0,
        width: parentSize.width,
        height: margins.BOTTOM,
      };
    default:
      return {
        top: margins.TOP,
        left: margins.LEFT,
        width: parentSize.width - margins.RIGHT - margins.LEFT,
        height: parentSize.height - margins.BOTTOM - margins.TOP,
      };
  }
};

const BaseChart = ({ tabId, id }: { tabId: string; id: string }) => {
  const [data, registry, removeChart, queryColumn] = useStore(
    (s) => [s.sheets.sheets[tabId][id], s.registry, s.sheets.removeChart, s.data.queryColumn],
    shallow,
  );

  const queriedData: QueriedChartData = {
    dimensions: data.data.dimensions.map((v) => queryColumn(v.query) || []),
    measures: data.data.measures.map((v) => queryColumn(v.query) || []),
  };

  for (const v of Object.values(data.components)) {
    const validator = (registry.components['bf:chart-components'][v.component] as ChartComponent)
      ?.data?.validation;

    if (validator) {
      const response = validator(queriedData, data.components[v.component]?.props);

      if (response) return <ChartError {...response} />;
    }
  }

  const scales = {
    dimensions: data.data.dimensions.map((i) => generateScales(i.type, i.scaleProps)),
    measures: data.data.measures.map((i) => generateScales(i.type, i.scaleProps)),
  };

  const margins: ChartDataMargins = { TOP: 0, LEFT: 0, BOTTOM: 0, RIGHT: 0 };

  const docks = {
    TOP: [] as ChartComponentData[],
    BOTTOM: [] as ChartComponentData[],
    LEFT: [] as ChartComponentData[],
    RIGHT: [] as ChartComponentData[],
    FULL: [] as ChartComponentData[],
  };

  for (const v of Object.values(data.components)) {
    (docks as any)[v.dock]?.push(v);

    if (v.dock === 'FULL') continue;

    const sizeCalc = (registry.components['bf:chart-components'][v.component] as ChartComponent)
      ?.data?.sizeCalculator;

    if (sizeCalc && (margins as any)[v.dock.toUpperCase()] !== undefined)
      (margins as any)[v.dock.toUpperCase()] += sizeCalc(
        queriedData,
        data.components[v.component]?.props,
        v.dock,
      );
  }

  return (
    <>
      <Text fontSize={'lg'} fontWeight={'semibold'} paddingLeft={2}>
        {data.components['bf:base-chart']?.props?.['chart-title']}
      </Text>
      <Text paddingLeft={2}>{data.components['bf:base-chart']?.props?.['chart-subtitle']}</Text>
      <Box flex="1 1 auto" position="relative">
        <ParentSize parentSizeStyles={{ inset: 0, position: 'absolute' }}>
          {(parent) => (
            <svg width={parent.width} height={parent.height}>
              {Object.entries(docks).map(([dock, components]) => {
                const elementPosition = getElementMargins(dock, margins, parent);

                return (
                  <Group
                    key={dock}
                    top={elementPosition.top}
                    left={elementPosition.left}
                    width={elementPosition.width}
                    height={elementPosition.height}
                  >
                    {components.map((comp, index) => {
                      const Element = registry.components['bf:chart-components'][comp.component]
                        ?.component as ElementType<ChartComponentProps>;

                      if (!Element) return;

                      const props = data.components[comp.component]?.props;

                      return (
                        <Element
                          key={index}
                          width={elementPosition.width}
                          height={elementPosition.height}
                          margins={margins}
                          props={props || {}}
                          data={queriedData}
                          dataProps={data.data}
                          dock={dock}
                          scales={scales}
                        />
                      );
                    })}
                  </Group>
                );
              })}
            </svg>
          )}
        </ParentSize>
      </Box>
      <Menu isLazy size="sm" closeOnBlur>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<Icon as={MdMoreVert} boxSize={5} />}
          variant="ghost"
          isRound
          size="sm"
          position="absolute"
          top="0"
          right="0"
          onClick={(e) => e.stopPropagation()}
        />
        <Portal>
          <MenuList>
            <MenuItem
              icon={<Icon as={MdDeleteOutline} boxSize={4} />}
              command="DEL"
              onClick={() => removeChart(tabId, id)}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </>
  );
};

export default BaseChart;

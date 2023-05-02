import ChartError from '@/components/feedback/ChartError';
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
import { ParentSize } from '@visx/responsive';
import { AnyD3Scale } from '@visx/scale';
import { ChartComponent, ChartComponentProps, QueriedChartData } from 'bluefire';
import { MdDeleteOutline, MdMoreVert } from 'react-icons/md';
import shallow from 'zustand/shallow';
import ChartContext from './context';

const BaseChart = ({ tabId, id }: { tabId: string; id: string }) => {
  const [data, registry, removeChart, queryColumn] = useStore(
    (s) => [s.sheets.sheets[tabId][id], s.registry, s.sheets.removeChart, s.data.queryColumn],
    shallow,
  );
  const series: Record<string, AnyD3Scale> = {};
  const setSeries = (id: string, scale: AnyD3Scale) => {
    series[id] = scale;
  };

  const queriedData: QueriedChartData = {
    dimensions: data.data.dimensions.map((v) => queryColumn(v.query) || []),
    measures: data.data.measures.map((v) => queryColumn(v.query) || []),
  };

  for (const [k, v] of Object.entries(data.components)) {
    const validator = (registry.components['bf:chart-components'][v.component] as ChartComponent)
      ?.data?.validation;

    if (validator) {
      const response = validator(queriedData, data.components[v.component]?.props);

      if (response) return <ChartError {...response} />;
    }
  }

  return (
    <ChartContext.Provider value={{ series, setSeries }}>
      <Text fontSize={'lg'} fontWeight={'semibold'} paddingLeft={2}>
        {data.components['bf:base-chart']?.props?.['chart-title']}
      </Text>
      <Text paddingLeft={2}>{data.components['bf:base-chart']?.props?.['chart-subtitle']}</Text>
      <Box flex="1 1 auto" position="relative">
        <ParentSize parentSizeStyles={{ inset: 0, position: 'absolute' }}>
          {(parent) => (
            <svg width={parent.width} height={parent.height}>
              {Object.entries(data.components).map(([k, v]) => {
                const Element = registry.components['bf:chart-components'][v.component]
                  ?.component as ElementType<ChartComponentProps>;
                const props = data.components[v.component]?.props;

                if (!Element) return;

                return (
                  <Element
                    key={k}
                    width={parent.width}
                    height={parent.height}
                    id={id}
                    tabId={tabId}
                    compId={k}
                    props={props || {}}
                    data={queriedData}
                    dataProps={data.data}
                  />
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
    </ChartContext.Provider>
  );
};

export default BaseChart;

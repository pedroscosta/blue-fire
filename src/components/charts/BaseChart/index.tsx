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
import { ParentSize } from '@visx/responsive';
import { AnyD3Scale } from '@visx/scale';
import { MdDeleteOutline, MdMoreVert } from 'react-icons/md';
import shallow from 'zustand/shallow';
import ChartContext from './context';

const BaseChart = ({ tabId, id }: { tabId: string; id: string }) => {
  const [data, registry, removeChart] = useStore(
    (s) => [s.sheets.sheets[tabId][id], s.registry, s.sheets.removeChart],
    shallow,
  );
  const series: Record<string, AnyD3Scale> = {};
  const setSeries = (id: string, scale: AnyD3Scale) => {
    series[id] = scale;
  };

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
                const Element = registry.components['bf:chart-components'][v.component]?.component;

                if (!Element) return;

                return (
                  <Element
                    key={k}
                    width={parent.width}
                    height={parent.height}
                    id={id}
                    tabId={tabId}
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

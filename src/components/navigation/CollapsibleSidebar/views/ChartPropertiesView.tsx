import AccordionItem from '@/components/disclosure/AccordionItem';
import InputField from '@/components/inputs/InputField';
import { useStore } from '@/store';
import { ComponentRegister } from '@/store/slices/registry';
import {
  Accordion,
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChartProperty, ChartPropertyType } from 'bluefire';
import produce from 'immer';
import { useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import shallow from 'zustand/shallow';

interface PropertyItemProps {
  id: string;
  tabId: string;
  propId: string;
  prop: ChartProperty;
  propValue: any;
  updateProp: (propId: string, value: any) => void;
}

const PropertyItem = ({ id, tabId, propId, prop, propValue, updateProp }: PropertyItemProps) => {
  if (prop.type === ChartPropertyType.TEXT) {
    return (
      <Box w="100%">
        <InputField>
          <InputField.Label>{prop.name}</InputField.Label>
          <Input
            placeholder={prop.defaultValue}
            value={propValue}
            onChange={(e) => updateProp(propId, e.target.value)}
          />
          <InputField.Caption>{prop.desc}</InputField.Caption>
        </InputField>
      </Box>
    );
  }

  return <></>;
};

const ChartsPropertiesView = () => {
  const [curScope, setCurScope] = useState('bf:base-chart');

  const [id, tabId] = useStore(
    (s) => [s.context.state['bf:selected-chart-id'], s.context.state['bf:selected-chart-tab']],
    shallow,
  );

  const chartData = useStore((s) => s.sheets.sheets[tabId][id], shallow);

  const chartComps = chartData.components;

  const chartTypes = {
    ...useStore((s) => s.registry.components['bf:chart-components']),
    'bf:base-chart': { data: { name: 'None' } },
  } as Record<string, ComponentRegister>;

  const chartPropsTemplate =
    useStore((s) => s.chartProps.state, shallow)[chartComps[curScope].component] ?? {};

  const updateChart = useStore((s) => s.sheets.updateChart, shallow);

  const updateProp = (propId: string, value: any) => {
    updateChart(tabId, id, (prev) =>
      produce(prev, (draft) => {
        if (draft.components[curScope]) draft.components[curScope].props[propId] = value;
      }),
    );
  };

  return (
    <VStack spacing={2}>
      <HStack w={'100%'}>
        <Text flex="1 1 auto" paddingLeft={2}>
          Component:
        </Text>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                rightIcon={isOpen ? <MdExpandLess /> : <MdExpandMore />}
              >
                {chartTypes[chartComps[curScope].component].data.name}
              </MenuButton>
              <MenuList>
                {Object.entries(chartComps).map(([k, v]) => (
                  <MenuItem key={k} onClick={() => setCurScope(k)}>
                    {chartTypes[v.component]?.data?.name}
                  </MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>
      </HStack>
      <Divider />
      <Accordion allowToggle w="100%">
        {Object.entries(chartPropsTemplate).map(([catId, cat]) => (
          <AccordionItem key={catId} title={cat.title + ':'}>
            <Accordion allowToggle w="100%">
              {cat.groups.map((groupId, group) => (
                <AccordionItem key={group} title={groupId.title + ':'} pl={4} panelProps={{ p: 2 }}>
                  <VStack spacing={3} textAlign="left">
                    {Object.entries(groupId.properties).map(([propId, prop]) => (
                      <PropertyItem
                        id={id}
                        tabId={tabId}
                        propId={propId}
                        prop={prop}
                        key={propId}
                        propValue={chartComps[curScope].props[propId]}
                        updateProp={updateProp}
                      />
                    ))}
                  </VStack>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
};

export default ChartsPropertiesView;

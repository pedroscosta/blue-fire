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
import { useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import shallow from 'zustand/shallow';

interface PropertyItemProps {
  id: string;
  tabId: string;
  propId: string;
  prop: ChartProperty;
}

const PropertyItem = ({ id, tabId, propId, prop }: PropertyItemProps) => {
  if (prop.type === ChartPropertyType.TEXT) {
    return (
      <Box w="100%">
        <InputField>
          <InputField.Label>{prop.name}</InputField.Label>
          <Input placeholder={prop.defaultValue} />
          <InputField.Caption>{prop.desc}</InputField.Caption>
        </InputField>
      </Box>
    );
  }

  return <></>;
};

const ChartsPropertiesView = () => {
  const [id, tabId] = useStore(
    (s) => [s.context.state['bf:selected-chart-id'], s.context.state['bf:selected-chart-tab']],
    shallow,
  );
  const chartData = useStore((s) => s.sheets.sheets[tabId][id], shallow);

  const chartTypes = {
    ...useStore((s) => s.registry.components['bf:chart-components']),
    'bf:base-chart': { data: { name: 'None' } },
  } as Record<string, ComponentRegister>;

  const chartComps = ['bf:base-chart'].concat(
    Object.values(chartData.components).map((v) => v.component),
  );

  const [curScope, setCurScope] = useState(0);

  const chartPropsTemplate =
    useStore((s) => s.chartProps.state, shallow)[chartComps[curScope]] ?? {};

  return (
    <VStack spacing={2}>
      <HStack w={'100%'}>
        <Text flex="1 1 auto" paddingLeft={2}>
          Scope:
        </Text>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                rightIcon={isOpen ? <MdExpandLess /> : <MdExpandMore />}
              >
                {chartTypes[chartComps[curScope]].data.name}
              </MenuButton>
              <MenuList>
                {chartComps.map((v, k) => (
                  <MenuItem key={k} onClick={() => setCurScope(k)}>
                    {chartTypes[chartComps[k]].data.name}
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

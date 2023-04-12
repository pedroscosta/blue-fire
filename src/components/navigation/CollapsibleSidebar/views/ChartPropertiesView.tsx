import AccordionItem from '@/components/disclosure/AccordionItem';
import ColorPicker from '@/components/inputs/ColorPicker';
import InputField from '@/components/inputs/InputField';
import Select from '@/components/inputs/Select';
import useDebouncedState from '@/hooks/useDebouncedState';
import { useStore } from '@/store';
import { genericTypeGuard } from '@/utils/types';
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ComponentProperty, ComponentPropertyType, ComponentRegister } from 'bluefire';
import produce from 'immer';
import { ReactNode, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import shallow from 'zustand/shallow';

interface PropertyItemProps {
  id: string;
  tabId: string;
  propId: string;
  prop: ComponentProperty;
  propValue: any;
  updateProp: (propId: string, value: any) => void;
}

const PropertyItem = ({ id, tabId, propId, prop, propValue, updateProp }: PropertyItemProps) => {
  const [displayedValue, updateDisplayedValue] = useDebouncedState(
    propValue,
    (v) => {
      updateProp(propId, v);
    },
    200,
  );

  const inputs: Partial<Record<ComponentPropertyType, ReactNode>> = {
    [ComponentPropertyType.TEXT]: (
      <InputField>
        <InputField.Label>{prop.name + ':'}</InputField.Label>
        <Input
          placeholder={prop.defaultValue}
          value={propValue}
          onChange={(e) => updateProp(propId, e.target.value)}
        />
        <InputField.Caption>{prop.desc}</InputField.Caption>
      </InputField>
    ),
    [ComponentPropertyType.COLOR]: (
      <InputField inline>
        <InputField.Header>
          <InputField.Label>{prop.name + ':'}</InputField.Label>
          <InputField.Caption>{prop.desc}</InputField.Caption>
        </InputField.Header>
        <ColorPicker
          value={displayedValue || prop.defaultValue}
          onChange={(val) => updateDisplayedValue(val)}
        />
      </InputField>
    ),
    [ComponentPropertyType.NUMBER]: (
      <InputField inline>
        <InputField.Header>
          <InputField.Label>{prop.name + ':'}</InputField.Label>
          <InputField.Caption>{prop.desc}</InputField.Caption>
        </InputField.Header>
        <NumberInput
          defaultValue={prop.defaultValue}
          min={genericTypeGuard(prop.inputProps?.['min'], 'number')}
          max={genericTypeGuard(prop.inputProps?.['max'], 'number')}
          step={genericTypeGuard(prop.inputProps?.['step'], 'number')}
          precision={genericTypeGuard(prop.inputProps?.['precision'], 'number')}
          w="60%"
          value={propValue}
          onChange={(valueString) => {
            updateProp(propId, Number(valueString));
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputField>
    ),
    [ComponentPropertyType.SELECT]: (
      <InputField inline>
        <InputField.Header>
          <InputField.Label>{prop.name + ':'}</InputField.Label>
          <InputField.Caption>{prop.desc}</InputField.Caption>
        </InputField.Header>
        <Select
          options={prop.options || []}
          value={propValue || prop.defaultValue}
          onChange={(i) => updateProp(propId, i)}
          containerProps={{ w: '60%' }}
        />
      </InputField>
    ),
    [ComponentPropertyType.BOOLEAN]: (
      <InputField inline>
        <InputField.Header>
          <InputField.Label>{prop.name + ':'}</InputField.Label>
          <InputField.Caption>{prop.desc}</InputField.Caption>
        </InputField.Header>
        <Switch isChecked={propValue} onChange={(e) => updateProp(propId, e.target.checked)} />
      </InputField>
    ),
  };

  const Element: ReactNode = inputs[prop.type];

  return <>{Element}</>;
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
                      <Box w="100%" key={propId}>
                        <PropertyItem
                          id={id}
                          tabId={tabId}
                          propId={propId}
                          prop={prop}
                          propValue={chartComps[curScope].props[propId]}
                          updateProp={updateProp}
                        />
                      </Box>
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

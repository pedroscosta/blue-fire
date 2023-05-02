import AccordionItem from '@/components/disclosure/AccordionItem';
import ColorPicker from '@/components/inputs/ColorPicker';
import InputField from '@/components/inputs/InputField';
import Select, { Group, Option } from '@/components/inputs/Select';
import useDebouncedState from '@/hooks/useDebouncedState';
import { useStore } from '@/store';
import { genericTypeGuard } from '@/utils/types';
import {
  Accordion,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import {
  ComponentProperty,
  ComponentPropertyType,
  ComponentRegister,
  DataProperty,
} from 'bluefire';
import { chakraComponents, SingleValueProps } from 'chakra-react-select';
import { ReactNode, useState } from 'react';
import { MdChevronRight } from 'react-icons/md';
import shallow from 'zustand/shallow';
import DataSelector from './DataSelector';

interface PropertyItemProps {
  propId: string;
  prop: ComponentProperty;
  propValue: any;
  updateProp: (propId: string, value: any) => void;
}

const PropertyItem = ({ propId, prop, propValue, updateProp }: PropertyItemProps) => {
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
          options={(prop.options || []).map((opt, idx) => ({
            value: idx.toString(),
            label: opt,
          }))}
          value={{
            value: propValue || prop.defaultValue,
            label: prop.options?.[propValue || prop.defaultValue],
          }}
          onChange={(i) => updateProp(propId, i?.value)}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SingleValue = ({ children, ...props }: SingleValueProps<Option>) => (
  <chakraComponents.SingleValue {...props}>
    <Breadcrumb
      spacing="4px"
      separator={<MdChevronRight />}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <BreadcrumbItem isCurrentPage={props.getValue()?.[0]?.value === 'bf:base-chart'}>
        <BreadcrumbLink
          onClick={() =>
            props.setValue((props.options[0] as Group<Option>).options[0], 'select-option')
          }
        >
          Chart
        </BreadcrumbLink>
      </BreadcrumbItem>

      {props.getValue()?.[0]?.value !== 'bf:base-chart' && (
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{(props.getValue()?.[0] as any)?.label}</BreadcrumbLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  </chakraComponents.SingleValue>
);

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
    useStore((s) => s.chartProps.state, shallow)[chartComps[curScope]?.component] ?? {};

  const modifyChart = useStore((s) => s.sheets.modifyChart, shallow);

  const updateProp = (propId: string, value: any) => {
    modifyChart(tabId, id, (draft) => {
      if (draft.components[curScope]) draft.components[curScope].props[propId] = value;
    });
  };

  const updateDataProps = (type: 'dimensions' | 'measures', value: DataProperty[]) => {
    modifyChart(tabId, id, (draft) => {
      draft.data[type] = value;
    });
  };

  const selectOptions: Group<Option>[] = [
    {
      label: 'Components',
      options: Object.entries(chartComps).map(([k, v]) => ({
        value: k,
        label: chartTypes[v.component]?.data?.name,
      })),
    },
  ];

  return (
    <VStack>
      <Select
        options={selectOptions}
        defaultValue={selectOptions[0].options[0]}
        onChange={(val: any) => setCurScope(val.value)}
        components={{ SingleValue }}
        additionalProps={{ setCurScope }}
        variant="unstyled"
        containerProps={{ w: '100%', pl: '8px' }}
        isSearchable={false}
      />
      <Tabs isLazy w="100%" style={{ marginTop: '0' }} isFitted>
        <TabList>
          <Tab>Data</Tab>
          <Tab>Properties</Tab>
        </TabList>
        <TabPanels>
          <TabPanel w="100%">
            <DataSelector
              type="dimensions"
              data={chartData.data.dimensions}
              updateDataProps={updateDataProps}
            />
            <DataSelector
              type="measures"
              data={chartData.data.measures}
              updateDataProps={updateDataProps}
            />
          </TabPanel>
          <TabPanel w="100%" p="0" paddingTop={2}>
            <Accordion allowToggle w="100%">
              {Object.entries(chartPropsTemplate).map(([catId, cat]) => (
                <AccordionItem key={catId} title={cat.title + ':'} panelProps={{ p: 0 }}>
                  <Accordion allowToggle w="100%">
                    {cat.groups.map((groupId, group) => (
                      <AccordionItem
                        key={group}
                        title={groupId.title + ':'}
                        margin={4}
                        panelProps={{ p: 2 }}
                        borderWidth="1px"
                        borderRadius="8px"
                        overflow="hidden"
                      >
                        <VStack spacing={3} textAlign="left" p="0">
                          {Object.entries(groupId.properties).map(([propId, prop]) => (
                            <Box w="100%" key={propId}>
                              <PropertyItem
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default ChartsPropertiesView;

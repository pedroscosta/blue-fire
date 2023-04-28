import InputField from '@/components/inputs/InputField';
import Select, { Group, Option } from '@/components/inputs/Select';
import TooltipIconButton from '@/components/inputs/TooltipIconButton';
import { useStore } from '@/store';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Divider,
  HStack,
  Icon,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { DataProperty, DataType } from 'bluefire';
import { chakraComponents, DropdownIndicatorProps, PlaceholderProps } from 'chakra-react-select';
import { chain, findIndex } from 'lodash';
import { useState } from 'react';
import { MdAdd, MdModeEdit, MdOutlineDelete } from 'react-icons/md';

const dataTypeOptions: { value: DataType; label: string }[] = [
  { value: DataType.CATEGORY, label: 'Categorical' },
  { value: DataType.NUMBER, label: 'Number' },
];

type DataItemProps = {
  value: DataProperty;
  index: number;
  removeItem: (idx: number) => void;
  openItem: (idx: number) => void;
  updateItem: (idx: number, newVal: DataProperty) => void;
  isOpen: boolean;
};

const DataItem = ({ index, value, removeItem, openItem, isOpen, updateItem }: DataItemProps) => {
  return (
    <Box borderWidth="1px" borderColor={isOpen ? 'inherit' : 'transparent'} borderRadius="md" p={2}>
      <HStack>
        <Text color="fg.default">{value.name}</Text>
        <Spacer />
        <TooltipIconButton
          icon={<MdModeEdit />}
          aria-label="Edit"
          variant="ghost"
          boxSize={6}
          minW={0}
          onClick={() => openItem(index)}
        />
        <TooltipIconButton
          icon={<MdOutlineDelete />}
          aria-label="Delete"
          variant="ghost"
          boxSize={6}
          minW={0}
          onClick={() => removeItem(index)}
        />
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <Box marginTop={3} p={1}>
          <InputField inline>
            <InputField.Header>
              <InputField.Label>Type:</InputField.Label>
              <InputField.Caption>Data type</InputField.Caption>
            </InputField.Header>
            <Select<{ value: DataType; label: string }>
              options={dataTypeOptions}
              value={dataTypeOptions[findIndex(dataTypeOptions, (i) => i.value === value.type)]}
              onChange={(i) => {
                if (i !== null) updateItem(index, { ...value, type: i.value });
              }}
              containerProps={{ w: '60%' }}
            />
          </InputField>
        </Box>
      </Collapse>
    </Box>
  );
};

type DataSelectorProps = {
  type: 'dimensions' | 'measures';
  data: DataProperty[];
  updateDataProps: (type: 'dimensions' | 'measures', value: DataProperty[]) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Placeholder = ({ children, ...props }: PlaceholderProps<Option>) => {
  return (
    <chakraComponents.Placeholder {...props}>
      <Box
        sx={{
          color: 'fg.default',
        }}
      >
        Add new
      </Box>
    </chakraComponents.Placeholder>
  );
};

const DropdownIndicator = (props: DropdownIndicatorProps<Option>) => (
  <chakraComponents.DropdownIndicator {...props}>
    <Icon as={MdAdd} />
  </chakraComponents.DropdownIndicator>
);

const DataSelector = ({ type, data, updateDataProps }: DataSelectorProps) => {
  const [curOpenItem, setCurOpenItem] = useState<number>();
  const fields = useStore((s) => s.data.loadedState.fields);

  const selectOptions: Group<Option>[] = chain(Object.entries(fields))
    .groupBy((x) => x[1])
    .map((value, key) => ({
      label: key,
      options: value.map((x) => ({ value: x[0], label: x[0] })),
    }))
    .value();

  const removeItem = (idx: number) => {
    const arr = [...data];
    arr.splice(idx, 1);
    updateDataProps(type, arr);
    if (curOpenItem === idx) setCurOpenItem(undefined);
  };

  const openItem = (idx: number) => {
    setCurOpenItem(curOpenItem !== idx ? idx : undefined);
  };

  const updateItem = (idx: number, newVal: DataProperty) => {
    const arr = [...data];
    arr[idx] = newVal;
    updateDataProps(type, arr);
  };

  return (
    <Card
      // @ts-ignore
      condensed
      borderRadius="lg"
      marginBottom={4}
    >
      <CardHeader>{type.charAt(0).toUpperCase() + type.slice(1)}</CardHeader>
      <CardBody px={2}>
        {data.map((v, k) => (
          <>
            <DataItem
              key={k}
              value={v}
              index={k}
              removeItem={removeItem}
              openItem={openItem}
              isOpen={curOpenItem === k}
              updateItem={updateItem}
            />
            {k !== data.length - 1 && curOpenItem !== k && curOpenItem !== k + 1 && <Divider />}
          </>
        ))}
        <Select
          options={selectOptions}
          onChange={(val: any) =>
            updateDataProps(type, [
              ...data,
              { name: val.label, query: val.label, type: DataType.NUMBER },
            ])
          }
          // @ts-ignore
          components={{ Placeholder, DropdownIndicator }}
          value={null}
          variant="unstyled"
          containerProps={{ w: '100%', pl: '8px' }}
        />
      </CardBody>
    </Card>
  );
};

export default DataSelector;

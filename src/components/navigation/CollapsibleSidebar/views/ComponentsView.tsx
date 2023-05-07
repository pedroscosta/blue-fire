import { useStore } from '@/store';
import { HStack, Icon } from '@chakra-ui/react';
import { ChartComponent, ChartComponentType } from 'bluefire';
import { useDrag } from 'react-dnd';
import ListButton from '../compoments/ListButton';

const Item = ({ id, type }: { id: string; type: ChartComponent }) => {
  const [, dragRef] = useDrag({
    type: 'bf:component-sidebar-item',
    item: {
      id,
      allowedDocks: type.data.allowedDocks,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <ListButton ref={dragRef}>
      <HStack w="100%" spacing={'4'}>
        <Icon as={type.data.icon} />
        <p>{type.data.name}</p>
      </HStack>
    </ListButton>
  );
};

const ComponentsView = () => {
  const chartTypes = useStore((s) => s.registry.components['bf:chart-components'] || {});

  return (
    <>
      {Object.entries(chartTypes).map(
        ([id, comp]) =>
          comp.data.type === ChartComponentType.ACCESSORY && (
            <Item key={id} id={id} type={comp as ChartComponent} />
          ),
      )}
    </>
  );
};

export default ComponentsView;

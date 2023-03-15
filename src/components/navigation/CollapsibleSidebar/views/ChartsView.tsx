import { useStore } from '@/store';
import { ChartComponent } from '@/store/slices/registry';
import { HStack, Icon } from '@chakra-ui/react';
import { ChartComponentType } from 'bluefire';
import { useDrag } from 'react-dnd';
import ListButton from '../compoments/ListButton';

const Item = ({ id, type }: { id: string; type: ChartComponent }) => {
  const [, dragRef] = useDrag({
    type: 'bf:chart-sidebar-item',
    item: { id, startingData: type.data.startingData },
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

const ChartsView = () => {
  const chartTypes = useStore((s) => s.registry.components['bf:chart-components'] || {});

  return (
    <>
      {Object.entries(chartTypes).map(([id, comp]) => (
        <>
          {comp.data.type === ChartComponentType.CHART && (
            <Item key={id} id={id} type={comp as ChartComponent} />
          )}
        </>
      ))}
    </>
  );
};

export default ChartsView;

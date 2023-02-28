import { useStore } from '@/store';
import { ChartType } from '@/store/slices/sheets';
import { HStack, Icon } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import ListButton from '../compoments/ListButton';

const Item = ({ id, type }: { id: string; type: ChartType }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'bf:chart-sidebar-item',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <ListButton ref={dragRef}>
      <HStack w="100%" spacing={'4'}>
        <Icon as={type.icon} />
        <p>{type.name}</p>
      </HStack>
    </ListButton>
  );
};

const ChartsView = () => {
  const chartTypes = useStore((s) => s.registry.components['bf:chart-types'] || {});

  return (
    <>
      {Object.entries(chartTypes).map(([id, comp]) => (
        <Item key={id} id={id} type={{ component: comp.component, ...comp.data }} />
      ))}
    </>
  );
};

export default ChartsView;

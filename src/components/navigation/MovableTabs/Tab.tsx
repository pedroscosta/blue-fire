/* eslint-disable react/require-default-props */
import { Button, MenuItem, MenuList, useStyleConfig } from '@chakra-ui/react';
import { ContextMenu } from 'chakra-ui-contextmenu';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface TabProps {
  selected: boolean;
  name: string;
  id: string;
  index?: number | undefined;
  tabChange: () => void;
  tabMove?: (draggedIndex: number, targetIndex: number) => void | undefined;
}

const Tab = ({
  name,
  tabChange,
  id,
  tabMove = undefined,
  index = undefined,
  selected = false,
}: TabProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const styles: any = useStyleConfig('Tabs');

  const [{ isDragging }, dragRef] = useDrag({
    type: 'bf:workspace-tab',
    item: { index, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'bf:workspace-tab',
    hover: (item: any, monitor) => {
      if (index === undefined || !tabMove) return;

      const draggedIndex = item.index;

      if (draggedIndex === index) return;

      const targetSize = ref.current?.getBoundingClientRect();
      const targetCenter = ((targetSize?.right || 0) - (targetSize?.left || 0)) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedLeft = (draggedOffset?.x || 0) - (targetSize?.left || 0);

      if (draggedIndex < index && draggedLeft < targetCenter) return;

      if (draggedIndex > index && draggedLeft > targetCenter) return;

      tabMove(draggedIndex, index);

      item.index = index;
    },
  });

  dropRef(dragRef(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0 : 1 }}>
      <ContextMenu<HTMLButtonElement>
        renderMenu={() => (
          <MenuList>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuList>
        )}
        menuProps={{ size: 'md' }}
      >
        {(contextRef) => (
          <Button
            __css={styles.tab}
            aria-selected={selected}
            onMouseDown={(e) => e.button === 0 && tabChange()}
            ref={contextRef}
          >
            {name}
          </Button>
        )}
      </ContextMenu>
    </div>
  );
};

export default Tab;

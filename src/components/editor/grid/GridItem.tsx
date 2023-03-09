/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Popover, PopoverAnchor, PopoverContent, Stack } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { DraggableData, ResizableDelta, Rnd } from 'react-rnd';

import TooltipIconButton from '@/components/inputs/TooltipIconButton';
import { useStore } from '@/store';
import { roundObject } from '@/utils/math';
import { PanelData } from 'bluefire';
import { HiOutlineDatabase } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';
import shallow from 'zustand/shallow';
import './GridItem.css';

export type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

const convertResizeDelta = (delta: ResizableDelta, gridUnits: [number, number]) =>
  roundObject({
    width: delta.width / gridUnits[0],
    height: delta.height / gridUnits[1],
  }) as ResizableDelta;

const convertDragData = (data: DraggableData, gridUnits: [number, number]) =>
  roundObject({
    deltaX: data.deltaX / gridUnits[0],
    deltaY: data.deltaY / gridUnits[1],
    lastX: data.lastX / gridUnits[0],
    lastY: data.lastY / gridUnits[1],
    x: data.x / gridUnits[0],
    y: data.y / gridUnits[1],
  }) as DraggableData;

interface GridItemProps {
  panel: PanelData;
  id: string;
  gridUnits: [number, number];
  gridSize: [number, number];
  children?: ReactNode;
  onResizeStart?: (id: string, dir: ResizeDirection) => void;
  onResize?: (id: string, dir: ResizeDirection, delta: ResizableDelta) => void;
  onResizeStop?: (id: string, dir: ResizeDirection, delta: ResizableDelta) => void;
  onDragStart?: (id: string, data: DraggableData) => void;
  onDrag?: (id: string, data: DraggableData) => void;
  onDragStop?: (id: string, data: DraggableData) => void;
  dummy?: boolean;
}

const getPopoverPosition = (p: PanelData, gs: [number, number]) => {
  if (p.x + p.w < gs[0]) return 'right-start';
  if (p.x > 0) return 'left-start';
  if (p.y + p.h < gs[1]) return 'bottom-end';
  if (p.y > 0) return 'top-end';
};

const GridItem = ({
  panel,
  id,
  gridUnits,
  gridSize,
  children,
  onResizeStart,
  onResize,
  onResizeStop,
  onDragStart,
  onDrag,
  onDragStop,
  dummy,
}: GridItemProps) => {
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const context = useStore((s) => s.context, shallow);
  const selected = context.state['bf:selected-chart'] === id;

  const popoverPos = getPopoverPosition(panel, gridSize);

  return (
    <Rnd
      position={{ x: panel.x * gridUnits[0], y: panel.y * gridUnits[1] }}
      size={{ width: panel.w * gridUnits[0], height: panel.h * gridUnits[1] }}
      bounds="parent"
      minWidth={gridUnits[0] * 2}
      minHeight={gridUnits[1] * 2}
      resizeGrid={gridUnits}
      dragGrid={gridUnits}
      onResizeStart={(_e, dir) => {
        setResizing(true);
        onResizeStart && onResizeStart(id, dir);
      }}
      onResize={(_e, dir, _ref, delta) => {
        onResize && onResize(id, dir, convertResizeDelta(delta, gridUnits));
      }}
      onResizeStop={(_e, dir, _ref, delta) => {
        setResizing(false);
        onResizeStop && onResizeStop(id, dir, convertResizeDelta(delta, gridUnits));
      }}
      onDragStart={(_e, data) => {
        setDragging(true);
        onDragStart && onDragStart(id, convertDragData(data, gridUnits));
      }}
      onDrag={(_e, data) => onDrag && onDrag(id, convertDragData(data, gridUnits))}
      onDragStop={(_e, data) => {
        setDragging(false);
        onDragStop && onDragStop(id, convertDragData(data, gridUnits));
      }}
      className={resizing ? 'react-draggable-dragging' : ''}
    >
      <Popover
        placement={popoverPos ?? 'right-start'}
        isLazy
        isOpen={!(dragging || resizing) && selected && popoverPos != undefined}
      >
        <PopoverAnchor>
          <Box
            p={1}
            height="100%"
            onClick={(e) => {
              context.set('bf:selected-chart', selected ? undefined : id);
              // e.stopPropagation();
            }}
          >
            <Box
              borderWidth={dummy ? '2px' : '1px'}
              borderColor={'divider'}
              borderStyle={dummy ? 'dashed' : 'solid'}
              height="100%"
              p={2}
            >
              {children}
            </Box>
          </Box>
        </PopoverAnchor>
        <PopoverContent w={'auto'} bg={'transparent'} border="">
          <Stack
            direction={
              ['right', 'left'].includes(popoverPos?.split('-')[0] || '') ? 'column' : 'row'
            }
          >
            <TooltipIconButton
              colorScheme="blue"
              variant="outline"
              aria-label="Add components"
              icon={<MdAdd />}
              boxSize={8}
              placement="right"
            />
            <TooltipIconButton
              colorScheme="blue"
              variant="outline"
              aria-label="Data"
              icon={<HiOutlineDatabase />}
              boxSize={8}
              placement="right"
            />
          </Stack>
        </PopoverContent>
      </Popover>
    </Rnd>
  );
};

export default GridItem;

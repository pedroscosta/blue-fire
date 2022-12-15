/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { DraggableData, ResizableDelta, Rnd } from 'react-rnd';
import { PanelData } from './GridLayout';

import { roundObject } from '@/utils/math';
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
  children?: ReactNode;
  onResizeStart?: (id: string, dir: ResizeDirection) => void;
  onResize?: (id: string, dir: ResizeDirection, delta: ResizableDelta) => void;
  onResizeStop?: (id: string, dir: ResizeDirection, delta: ResizableDelta) => void;
  onDragStart?: (id: string, data: DraggableData) => void;
  onDrag?: (id: string, data: DraggableData) => void;
  onDragStop?: (id: string, data: DraggableData) => void;
  dummy?: boolean;
}

const GridItem = ({
  panel,
  id,
  gridUnits,
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
      onDragStart={(_e, data) => onDragStart && onDragStart(id, convertDragData(data, gridUnits))}
      onDrag={(_e, data) => onDrag && onDrag(id, convertDragData(data, gridUnits))}
      onDragStop={(_e, data) => onDragStop && onDragStop(id, convertDragData(data, gridUnits))}
      className={resizing ? 'react-draggable-dragging' : ''}
    >
      <Box p={1} height="100%">
        <Box
          borderWidth={dummy ? '2px' : '1px'}
          borderColor={'divider'}
          borderStyle={dummy ? 'dashed' : 'solid'}
          height="100%"
        >
          {children}
        </Box>
      </Box>
    </Rnd>
  );
};

export default GridItem;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { DraggableData, ResizableDelta } from 'react-rnd';
import GridItem, { ResizeDirection } from './GridItem';

interface GridLayoutProps {
  width: number;
  height: number;
  gridSize?: [number, number];
}

export interface PanelData {
  x: number;
  y: number;
  w: number;
  h: number;
}

const nid = nanoid();
const nid2 = nanoid();

const isColliding = (moving: PanelData, fixed: PanelData) =>
  moving.x + moving.w > fixed.x &&
  fixed.x + fixed.w > moving.x &&
  moving.y + moving.h > fixed.y &&
  fixed.y + fixed.h > moving.y;

const GridLayout = ({ width, height, gridSize = [24, 24] }: GridLayoutProps) => {
  const gridUnits: [number, number] = [width / gridSize[0], height / gridSize[1]];

  const [panels, setPanels] = useState<Record<string, PanelData>>({
    [nid]: { x: 0, y: 0, w: 2, h: 2 },
    [nid2]: { x: 3, y: 4, w: 2, h: 2 },
  });

  const [dummyPanel, setDummyPanel] = useState<PanelData>();

  const setPanelState = (
    key: string,
    state: Partial<PanelData> | ((prev: PanelData) => Partial<PanelData>),
  ) => {
    setPanels((last) => ({
      ...last,
      [key]: { ...last[key], ...(typeof state === 'function' ? state(last[key]) : state) },
    }));
  };

  // // // // // // // // // // // RESIZING MANAGEMENT

  const onResizeStart = (id: string, dir: ResizeDirection) => {
    setDummyPanel(panels[id]);
  };

  const onResize = (id: string, dir: ResizeDirection, delta: ResizableDelta) => {
    let collided = false;

    if (!dummyPanel) return;

    const topLeft = ['top', 'left', 'topLeft'].includes(dir);

    const { x, y, w, h } = {
      x: panels[id].x - (topLeft ? delta.width : 0),
      y: panels[id].y - (topLeft ? delta.height : 0),
      w: panels[id].w + delta.width,
      h: panels[id].h + delta.height,
    };

    Object.entries(panels).forEach(([id_, value]) => {
      if (id_ !== id && isColliding({ ...dummyPanel, w, h }, value)) collided = true;
    });

    if (!collided)
      setDummyPanel(
        (_last) =>
          ({
            x,
            y,
            w,
            h,
          } as PanelData),
      );
  };

  const onResizeStop = (id: string, _dir: ResizeDirection, _delta: ResizableDelta) => {
    if (!dummyPanel) return;
    setPanelState(id, dummyPanel);
    setDummyPanel(undefined);
  };

  // // // // // // // // // // // DRAGGING MANAGEMENT

  const onDragStart = (id: string, _data: DraggableData) => {
    setDummyPanel(panels[id]);
  };

  const onDrag = (id: string, data: DraggableData) => {
    if (!dummyPanel) return;

    const { x, y } = data;
    let collided = false;

    Object.entries(panels).forEach(([id_, panel]) => {
      if (id_ !== id && isColliding({ ...dummyPanel, x, y }, panel)) collided = true;
    });

    if (!collided)
      setDummyPanel(
        (last) =>
          ({
            ...last,
            x,
            y,
          } as PanelData),
      );
  };

  const onDragStop = (id: string, _data: DraggableData) => {
    if (!dummyPanel) return;
    setPanelState(id, dummyPanel);
    setDummyPanel(undefined);
  };

  return (
    <Box style={{ width, height, flex: '1 1 auto', display: 'flex' }}>
      {dummyPanel && (
        <GridItem
          key={'dummy'}
          panel={dummyPanel}
          gridUnits={gridUnits}
          id={'dummy'}
          dummy
        ></GridItem>
      )}
      {Object.entries(panels).map(([id, panel]) => {
        return (
          <GridItem
            key={id}
            panel={panel}
            gridUnits={gridUnits}
            id={id}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragStop={onDragStop}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
          >
            <span className="text">{id}</span>
          </GridItem>
        );
      })}
    </Box>
  );
};

export default GridLayout;

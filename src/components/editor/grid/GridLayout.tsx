/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
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
  hover?: boolean;
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

  // // // // // // // // // // // DND MANAGEMENT

  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, isOverCurrent }, dropRef] = useDrop({
    accept: 'bf:chart-sidebar-item',
    hover: (item, monitor) => {
      if (!ref.current) return;

      let pos = monitor.getClientOffset();
      if (!pos) return;

      const targetSize = ref.current.getBoundingClientRect();

      pos = {
        x: Math.floor((pos.x - targetSize.x) / gridUnits[0]),
        y: Math.floor((pos.y - targetSize.y) / gridUnits[1]),
      };

      if (isOverCurrent && !dummyPanel) setDummyPanel({ ...pos, w: 2, h: 2, hover: true });

      if (isOverCurrent && dummyPanel && (pos.x !== dummyPanel.x || pos.y !== dummyPanel.y)) {
        let collided = false;

        Object.entries(panels).forEach(([key, value]) => {
          if (isColliding({ ...dummyPanel, ...pos }, value)) collided = true;
        });

        if (!collided) setDummyPanel((last) => ({ ...last, ...pos } as PanelData));
      }

      if (!isOverCurrent && dummyPanel && dummyPanel.hover) setDummyPanel(undefined);
    },
    drop: (item, monitor) => {
      if (
        dummyPanel &&
        dummyPanel.hover &&
        dummyPanel.x >= 0 &&
        dummyPanel.y >= 0 &&
        dummyPanel.x < gridSize[0] &&
        dummyPanel.y < gridSize[1]
      )
        setPanelState(nanoid(), { ...dummyPanel, hover: undefined });
    },
    collect: (monitor) => {
      if (!monitor.isOver({ shallow: true }) && dummyPanel && dummyPanel.hover)
        setDummyPanel(undefined);
      return {
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      };
    },
  });

  dropRef(ref);

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
    <Box style={{ width, height, flex: '1 1 auto', display: 'flex' }} ref={ref}>
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

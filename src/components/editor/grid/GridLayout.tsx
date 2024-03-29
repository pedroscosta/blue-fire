/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseChart from '@/components/charts/BaseChart';
import { useStore } from '@/store';
import { Box } from '@chakra-ui/react';
import { ChartData, PanelData } from 'bluefire';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableData, ResizableDelta } from 'react-rnd';
import GridItem, { ResizeDirection } from './GridItem';

interface GridLayoutProps {
  width: number;
  height: number;
  tabId: string;
  gridSize?: [number, number];
}

const nid = nanoid();
const nid2 = nanoid();

const isColliding = (moving: PanelData, fixed: PanelData) =>
  moving.x + moving.w > fixed.x &&
  fixed.x + fixed.w > moving.x &&
  moving.y + moving.h > fixed.y &&
  fixed.y + fixed.h > moving.y;

const GridLayout = ({ width, height, tabId, gridSize = [24, 24] }: GridLayoutProps) => {
  const gridUnits: [number, number] = [width / gridSize[0], height / gridSize[1]];

  const [sheet, updateChart, context] = useStore((s) => [
    s.sheets.sheets[tabId] || {},
    s.sheets.updateChart,
    s.context,
  ]);

  const panels = Object.fromEntries(Object.entries(sheet).map(([k, v]) => [k, v.panelData]));

  const [dummyPanel, setDummyPanel] = useState<PanelData>();

  const setPanelState = (
    key: string,
    state: Partial<PanelData> | ((prev: PanelData) => Partial<PanelData>),
  ) => {
    updateChart(tabId, key, (last) => ({ ...last, panelData: { ...last.panelData, ...state } }));
  };

  // // // // // // // // // // // DND MANAGEMENT

  const ref = useRef<HTMLDivElement>(null);

  const [{ isOverCurrent }, dropRef] = useDrop({
    accept: 'bf:chart-sidebar-item',
    hover: (item, monitor) => {
      if (!isOverCurrent) return;
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
      if (!isOverCurrent) return;
      if (
        dummyPanel &&
        dummyPanel.hover &&
        dummyPanel.x >= 0 &&
        dummyPanel.y >= 0 &&
        dummyPanel.x < gridSize[0] &&
        dummyPanel.y < gridSize[1]
      )
        updateChart(tabId, nanoid(), {
          ...((item as any).startingData || {}),
          components: {
            'bf:base-chart': { component: 'bf:base-chart', props: {}, dock: 'NONE' },
            ...(item as any).startingData?.components,
          },
          panelData: { ...dummyPanel, hover: undefined },
          data: {
            dimensions: [],
            measures: [],
          },
        } as ChartData);
    },
    collect: (monitor) => {
      const isOverCurrent = monitor.isOver({ shallow: true });

      if (!isOverCurrent && dummyPanel && dummyPanel.hover) setDummyPanel(undefined);

      return {
        isOverCurrent,
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

    const top = ['top', 'topLeft', 'topRight'].includes(dir);
    const left = ['left', 'topLeft', 'bottomLeft'].includes(dir);

    const { x, y, w, h } = {
      x: panels[id].x - (left ? delta.width : 0),
      y: panels[id].y - (top ? delta.height : 0),
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
    <Box
      style={{ width, height, flex: '1 1 auto', display: 'flex' }}
      ref={ref}
      onClick={(e) => {
        if (e.target === e.currentTarget) context.set('bf:selected-chart', undefined);
      }}
    >
      {dummyPanel && (
        <GridItem
          key={'dummy'}
          panel={dummyPanel}
          gridUnits={gridUnits}
          gridSize={gridSize}
          id={'dummy'}
          tabId={tabId}
          dummy
        ></GridItem>
      )}
      {Object.entries(panels).map(([id, panel]) => {
        return (
          <GridItem
            key={id}
            panel={panel}
            gridUnits={gridUnits}
            gridSize={gridSize}
            id={id}
            tabId={tabId}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragStop={onDragStop}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
          >
            <BaseChart tabId={tabId} id={id} />
          </GridItem>
        );
      })}
    </Box>
  );
};

export default GridLayout;

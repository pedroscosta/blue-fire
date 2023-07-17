import { convertUnit } from '@/utils/css';
import { Box } from '@chakra-ui/react';
import type { Identifier, TargetType } from 'dnd-core';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import type { XOR } from 'ts-xor';
import Docks from './docks';

type CssDistance = string | number;

type CssPoint = XOR<{ left: CssDistance }, { right: CssDistance }> &
  XOR<{ top: CssDistance }, { bottom: CssDistance }>;

export type ReceiverDock = {
  point: CssPoint;
  area: {
    left?: CssDistance;
    right?: CssDistance;
    top?: CssDistance;
    bottom?: CssDistance;
    width?: CssDistance;
    height?: CssDistance;
    inset?: CssDistance;
  };
};

type SnapReceiverProps = {
  docks: Record<string, ReceiverDock>;
  accept: TargetType;
  onDrop: (itemType: Identifier, item: any, dockId: string) => void;
  snapDistance?: CssDistance;
  fallbackDock?: string;
  greedy?: boolean;
  additionalSelectCondition?: (itemType: Identifier, item: unknown, dockId: string) => boolean;
};

const SnapReceiver = ({
  docks,
  accept,
  onDrop,
  snapDistance = '10%',
  fallbackDock,
  greedy,
  additionalSelectCondition,
}: SnapReceiverProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [selectedDock, setSelectedDock] = useState<string>();

  const [{ isOverCurrent, isOver, isDragging }, dropRef] = useDrop({
    accept,
    hover: (item: any, monitor) => {
      const itemType = monitor.getItemType();
      if (itemType === null || !(isOverCurrent || (isOver && greedy))) return;
      if (!ref.current) return;

      let pos = monitor.getClientOffset();

      if (!pos) return;

      const targetSize = ref.current.getBoundingClientRect();

      pos = {
        x: pos.x - targetSize.x,
        y: pos.y - targetSize.y,
      };

      let selDock =
        item.allowedDocks && item.allowedDocks.includes(fallbackDock) ? fallbackDock : undefined;

      for (const [dockId, dock] of Object.entries(docks)) {
        const point = {
          x:
            dock.point.left !== undefined
              ? convertUnit(dock.point.left, 'px', targetSize.width)
              : targetSize.width - convertUnit(dock.point.right, 'px', targetSize.width),
          y:
            dock.point.top !== undefined
              ? convertUnit(dock.point.top, 'px', targetSize.height)
              : targetSize.height - convertUnit(dock.point.bottom, 'px', targetSize.height),
        };

        const distance = {
          x: convertUnit(snapDistance.toString(), 'px', targetSize.width),
          y: convertUnit(snapDistance.toString(), 'px', targetSize.height),
        };

        if (
          Math.abs(point.x - pos.x) <= distance.x &&
          Math.abs(point.y - pos.y) <= distance.y &&
          (!additionalSelectCondition || additionalSelectCondition(itemType, item, dockId)) &&
          (!item.allowedDocks || item.allowedDocks.includes(dockId))
        ) {
          selDock = dockId;
          break;
        }
      }

      setSelectedDock(selDock);
    },
    drop: (item, monitor) => {
      const itemType = monitor.getItemType();
      if (itemType !== null && selectedDock && !(monitor.didDrop() && !greedy))
        onDrop(itemType, item, selectedDock);
    },
    collect: (monitor) => {
      const isOverCurrent = monitor.isOver({ shallow: true });
      const isOver = monitor.isOver();

      if (!(isOverCurrent || (isOver && greedy)) && selectedDock) setSelectedDock(undefined);

      return { isOverCurrent, isOver, isDragging: monitor.getItem() !== null };
    },
  });

  dropRef(ref);

  return (
    <Box ref={ref} inset={0} position="absolute" pointerEvents={isDragging ? 'auto' : 'none'}>
      {selectedDock && (
        <Box bg="accent.subtle" position="absolute" sx={{ ...docks[selectedDock].area }}></Box>
      )}
    </Box>
  );
};

export default SnapReceiver;

export { Docks };

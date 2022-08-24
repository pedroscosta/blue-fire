/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';
import { stat } from 'fs';

const GridItem = ({
  children,
  grid,
  gridSize,
  panel,
  onDragStop,
  onDragStart,
  onDrag,
  onResizeStart,
  onResize,
  onResizeStop,
  index,
  dummy,
  resizing,
}) => {
  return (
    <Draggable
      cancel=".react-resizable-handle"
      bounds={
        gridSize && {
          left: 0,
          top: 0,
          right: (gridSize[0] - panel.w) * grid[0],
          bottom: (gridSize[1] - panel.h) * grid[1],
        }
      }
      grid={grid}
      position={{ x: grid[0] * panel.x, y: grid[1] * panel.y }}
      onStop={(e, data) => {
        if (onDragStop) {
          onDragStop(
            e,
            Math.round(data.x / grid[0]),
            Math.round(data.y / grid[1])
          );
        }
      }}
      onStart={(e, data) => {
        if (onDragStart) {
          onDragStart(
            e,
            Math.round(data.x / grid[0]),
            Math.round(data.y / grid[1])
          );
        }
      }}
      onDrag={(e, data) => {
        if (dummy) {
          return false;
        }
        if (onDrag) {
          onDrag(
            e,
            Math.round(data.x / grid[0]),
            Math.round(data.y / grid[1]),
            Math.round(data.deltaX / grid[0]),
            Math.round(data.deltaY / grid[1])
          );
        }
        return true;
      }}
    >
      <ResizableBox
        width={grid[0] * panel.w}
        height={grid[1] * panel.h}
        className={`${dummy ? 'dummy' : 'box'} ${resizing ? 'resizing' : ''}`}
        draggableOpts={{ grid }}
        minConstraints={grid}
        maxConstraints={[
          (gridSize[0] - panel.x) * grid[0],
          (gridSize[1] - panel.y) * grid[1],
        ]}
        resizeHandles={['se']}
        onResizeStop={(e, data) => {
          if (onResizeStop) {
            onResizeStop(
              e,
              Math.round(data.size.width / grid[0]),
              Math.round(data.size.height / grid[1])
            );
          }
        }}
        onResizeStart={(e, data) => {
          if (onResizeStart) {
            onResizeStart(
              e,
              Math.round(data.size.width / grid[0]),
              Math.round(data.size.height / grid[1])
            );
          }
        }}
        onResize={(e, data) => {
          if (onResize) {
            onResize(
              e,
              Math.round(data.size.width / grid[0]),
              Math.round(data.size.height / grid[1])
            );
          }
        }}
      >
        {children}
      </ResizableBox>
    </Draggable>
  );
};

export default GridItem;

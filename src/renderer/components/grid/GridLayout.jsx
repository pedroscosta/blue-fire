/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDrop } from 'react-dnd';

import { nanoid } from 'nanoid';

import GridItem from './GridItem';
import './grid.scss';

const isColliding = (moving, static) => {
  return (
    moving.x + moving.w > static.x &&
    static.x + static.w > moving.x &&
    moving.y + moving.h > static.y &&
    static.y + static.h > moving.y
  );
};

const calculateCollisionOffset = (moving, static) => {
  let x = 0;
  let y = 0;

  if (moving.x + moving.w >= static.x && static.x >= moving.x)
    x += static.x - (moving.x + moving.w);
  else if (
    moving.x + moving.w > static.x + static.w &&
    moving.x + moving.w > static.x
  )
    x += static.x + static.w - moving.x;

  if (moving.y + moving.h >= static.y && static.y >= moving.y)
    y += static.y - (moving.y + moving.h);
  else if (
    moving.y + moving.h > static.y + static.h &&
    moving.y + moving.h > static.y
  )
    y += static.y + static.h - moving.y;

  return [x, y];
};

const GridLayout = ({ gridSize, width, height }) => {
  const [panels, setPanels] = useState({
    1: { x: 0, y: 0, w: 2, h: 1 },
    2: { x: 3, y: 0, w: 2, h: 1 },
  });
  const [dummyPanel, setDummyPanel] = useState(null);
  const [sizeUnits, setSizeUnits] = useState([0, 0]);

  const ref = useRef();

  const setPanelState = (key, state) => {
    setPanels((last) => ({
      ...last,
      [key]: { ...last[key], ...state },
    }));
  };

  // // // // // // // // // // // DND MANAGEMENT

  const [{ isOver, isOverCurrent }, dropRef] = useDrop({
    accept: 'CHART',
    hover: (item, monitor) => {
      let pos = monitor.getClientOffset();
      const targetSize = ref.current.getBoundingClientRect();

      pos = {
        x: Math.floor((pos.x - targetSize.x) / sizeUnits[0]),
        y: Math.floor((pos.y - targetSize.y) / sizeUnits[1]),
      };

      if (isOverCurrent && !dummyPanel)
        setDummyPanel({ ...pos, w: 1, h: 1, hover: true });

      if (
        isOverCurrent &&
        dummyPanel &&
        (pos.x !== dummyPanel.x || pos.y !== dummyPanel.y)
      ) {
        let collided = false;

        Object.entries(panels).forEach(([key, value]) => {
          if (isColliding({ ...dummyPanel, ...pos }, value)) collided = true;
        });

        if (!collided) setDummyPanel((last) => ({ ...last, ...pos }));
      }

      if (!isOverCurrent && dummyPanel && dummyPanel.hover) setDummyPanel(null);
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
        setPanels((last) => ({
          ...last,
          [nanoid()]: { ...dummyPanel, hover: null },
        }));
    },
    collect: (monitor) => {
      if (!monitor.isOver({ shallow: true }) && dummyPanel && dummyPanel.hover)
        setDummyPanel(null);
      return {
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      };
    },
  });

  // // // // // // // // // // // RESIZING MANAGEMENT

  const onResizeStart = (key, e, finalW, finalH) => {
    setDummyPanel(panels[key]);
    setPanelState(key, { resizing: true });
  };

  const onResize = (key, e, w, h) => {
    let collided = false;

    Object.entries(panels).forEach(([key_, value]) => {
      if (key_ !== key && isColliding({ ...dummyPanel, w, h }, value))
        collided = true;
    });

    if (!collided)
      setDummyPanel((last) => ({
        ...last,
        w,
        h,
      }));
  };

  const onResizeStop = (key, e, finalW, finalH) => {
    setPanelState(key, { w: dummyPanel.w, h: dummyPanel.h, resizing: false });
    setDummyPanel(null);
  };

  // // // // // // // // // // // DRAGGING MANAGEMENT

  const onDragStart = (key, e, finalX, finalY) => {
    setDummyPanel(panels[key]);
    setPanelState(key, { dragging: true });
  };

  const onDrag = (key, e, x, y, dx, dy) => {
    let collided = false;

    Object.entries(panels).forEach(([key_, value]) => {
      if (key_ !== key && isColliding({ ...dummyPanel, x, y }, value))
        collided = true;
    });

    if (!collided)
      setDummyPanel((last) => ({
        ...last,
        x,
        y,
      }));
  };

  const onDragStop = (key, e, finalX, finalY) => {
    setPanelState(key, { x: dummyPanel.x, y: dummyPanel.y, dragging: false });
    setDummyPanel(null);
  };

  // // // // // // // // // // // GRID UNITS

  useEffect(() => {
    setSizeUnits([width / gridSize[0], height / gridSize[1]]);
  }, [width, height, setSizeUnits, gridSize]);

  return (
    <div
      style={{
        width,
        height,
        backgroundSize: `${sizeUnits[0]}px ${sizeUnits[1]}px`,
        display: 'flex',
      }}
      className="grid-base"
      ref={dropRef}
    >
      <div style={{ flex: '1 1 auto' }} ref={ref}>
        {dummyPanel && (
          <GridItem
            panel={dummyPanel}
            grid={[sizeUnits[0], sizeUnits[1]]}
            gridSize={gridSize}
            index="dummy"
            dummy
          />
        )}
        {Object.keys(panels).map((key) => {
          const panel = panels[key];
          return (
            <GridItem
              panel={panel}
              grid={sizeUnits}
              gridSize={gridSize}
              index={key}
              // dragGrid={[sizeUnits[0], sizeUnits[1]]}
              onDragStart={(e, finalX, finalY) => {
                onDragStart(key, e, finalX, finalY);
              }}
              onDrag={(e, x, y, dx, dy) => {
                onDrag(key, e, x, y, dx, dy);
              }}
              onDragStop={(e, finalX, finalY) => {
                onDragStop(key, e, finalX, finalY);
              }}
              onResizeStart={(e, finalW, finalH) => {
                onResizeStart(key, e, finalW, finalH);
              }}
              onResize={(e, w, h) => {
                onResize(key, e, w, h);
              }}
              onResizeStop={(e, finalW, finalH) => {
                onResizeStop(key, e, finalW, finalH);
              }}
              resizing={panel.resizing}
            >
              <span className="text">{key}</span>
            </GridItem>
          );
        })}
      </div>
    </div>
  );
};

GridLayout.defaultProps = {
  gridSize: [24, 24],
};

export default GridLayout;

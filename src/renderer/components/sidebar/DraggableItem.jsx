/* eslint-disable react/prop-types */
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ content, type }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return <div ref={dragRef}>{content}</div>;
};

export default DraggableItem;

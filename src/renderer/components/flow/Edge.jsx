/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { getBezierPath, getBezierEdgeCenter } from 'react-flow-renderer';
import './edge.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import useDeepCompareEffect from 'use-deep-compare-effect';

const foreignObjectSize = 40;

const onEdgeClick = (evt, id) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
};

function usePointsOnPath(edgePath, lengths) {
  // edgePath is curve path & lengths is array points (0<t<1) on curve.

  const [points, setPoints] = useState([]);
  const pathRef = useRef(null);
  useDeepCompareEffect(() => {
    const pathEl = pathRef.current;
    if (pathEl) {
      const totalLength = pathEl.getTotalLength();
      setPoints(
        lengths.map((length) => pathEl.getPointAtLength(totalLength * length))
      );
    }
  }, [edgePath, lengths]);
  return { points, pathRef };
}

export default function DataEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const center = 0.5;
  const {
    points: [centerPoint],
    pathRef,
  } = usePointsOnPath(edgePath, [center]);

  console.log(data);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path animated"
        d={edgePath}
        ref={pathRef}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={(centerPoint && centerPoint.x - foreignObjectSize / 2) || 0}
        y={(centerPoint && centerPoint.y - foreignObjectSize / 2) || 0}
        className="edgebutton-foreignobject"
      >
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          className="edgebutton"
          style={{
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <IconButton
            aria-label="settings"
            variant="contained"
            onClick={(event) => data.onEdgeRemove(id)}
            style={{
              background: '#FFF',
              borderColor: '#64748B',
              borderStyle: 'solid',
              borderWidth: '1px',
              padding: '0',
            }}
          >
            <CloseIcon sx={{ fontSize: '0.9rem' }} />
          </IconButton>
        </Box>
      </foreignObject>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  isEdge,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer';
import DataNode from '../flow/data/DataNode';
import DataEdge from '../flow/Edge';

const nodeTypes = { dataNode: DataNode };

const edgeTypes = { dataEdge: DataEdge };

const newElements = [
  {
    id: '4',
    type: 'dataNode',
    data: {
      label: 'Test',
      file: 'test.csv',
      rows: ['id', 'name', 'email', 'password'],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'dataNode',
    data: {
      label: 'Test2',
      file: 'test.csv',
      rows: ['id', 'name', 'email', 'password'],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges = [];

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();

const onNodeContextMenu = (event, node) => {
  event.preventDefault();
};

const DataFlow = () => {
  const [elements, setElements] = useState(newElements);
  const [edges, setEdges] = useState(initialEdges);

  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'dataEdge',
            data: { onEdgeRemove },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes) => setElements((nds) => applyNodeChanges(changes, nds)),
    [setElements]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onEdgeRemove = (id) => {
    setEdges((eds) =>
      eds.filter((edge) => {
        return edge.id !== id;
      })
    );
  };

  React.useEffect(() => {
    console.log('Component1 has mounted...');
    return () => {
      console.log('Component1 has unmounted...');
    };
  }, []);

  return (
    <ReactFlow
      nodes={elements}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      elementsSelectable
      selectNodesOnDrag
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onInit={onLoad}
      onNodeContextMenu={onNodeContextMenu}
      fitView
    >
      <Background variant="lines" gap={24} size={1} />
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          switch (node.type) {
            case 'valueNode':
              return 'LightGreen';
            case 'dataNode':
              return 'Lavender';
            case 'sourceNode':
              return 'Gold';
            default:
              return '#eee';
          }
        }} // TODO: Fix this
      />
    </ReactFlow>
  );
};

export default DataFlow;

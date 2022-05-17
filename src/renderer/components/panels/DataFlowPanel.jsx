/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
} from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'react-flow-renderer';
import DataNode from '../flow/data/DataNode';
import DataEdge from '../flow/Edge';

const nodeTypes = { dataNode: DataNode };

const edgeTypes = { dataEdge: DataEdge };

const newElements = [];

const initialEdges = [];

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();

const onNodeContextMenu = (event, node) => {
  event.preventDefault();
};

const DataFlow = React.forwardRef((props, ref) => {
  const { initialState } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);

  const { fitView } = useReactFlow();

  const onElementsRemove = (elementsToRemove) =>
    setNodes((els) => removeElements(elementsToRemove, els));

  const onEdgeRemove = useCallback(
    (id) => {
      setEdges((eds) =>
        eds.filter((edge) => {
          return edge.id !== id;
        })
      );
    },
    [setEdges]
  );

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
    [onEdgeRemove, setEdges]
  );

  const insertDataNode = useCallback(
    (newNode) => {
      setNodes((nds) => nds.concat(newNode));
      fitView({ duration: 100, padding: 0.3 });
    },
    [setNodes, fitView]
  );

  const createNodeFromData = useCallback(
    (tableName, columns, file) =>
      insertDataNode({
        id: `${tableName}-node`,
        type: 'dataNode',
        position: {
          x: Math.random() * 300,
          y: Math.random() * 300,
        },
        data: {
          label: tableName,
          file,
          columns,
        },
      }),
    [insertDataNode]
  );

  useImperativeHandle(ref, () => ({
    insertDataNode,
    createNodeFromData,
  }));

  React.useEffect(() => {
    return () => {
      onUnmount();
    };
  }, [nodes, edges]);

  const onUnmount = useCallback(() => {
    props.onChange(nodes, edges);
  }, [nodes, edges]);

  return (
    <ReactFlow
      nodes={nodes}
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
});

export default DataFlow;

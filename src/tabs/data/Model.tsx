import { useToken } from '@chakra-ui/react';
import { useState } from 'react';
import { Background, ButterflyDag, ReactNodeData } from 'react-butterfly-dag';
import 'react-butterfly-dag/dist/style.css';
import Node from './Node';

const Model = () => {
  const [nodes, setNodes] = useState<ReactNodeData[]>([
    {
      id: 'books',
      type: Node,
      left: 50,
      top: 50,
      data: {
        title: 'Books',
        cols: ['id', 'name', 'author-id'],
      },
    },
  ]);

  const dividerColor = useToken('colors', 'bf-divider');

  return (
    <>
      <ButterflyDag
        canvasProps={{
          disLinkable: true,
          linkable: true,
          draggable: true,
          zoomable: true,
          moveable: true,
          theme: {
            edge: {
              shapeType: 'AdvancedBezier',
            },
          },
        }}
        data={{
          nodes,
        }}
        onStateChange={(state) => setNodes(() => state.nodes)}
      >
        <Background type="circle" color={dividerColor} />
      </ButterflyDag>
    </>
  );
};

export default Model;

import { useStore } from '@/store';
import { useToken } from '@chakra-ui/react';
import { Background, ButterflyDag, ReactNodeData } from 'react-butterfly-dag';
import 'react-butterfly-dag/dist/style.css';
import shallow from 'zustand/shallow';
import Node from './Node';

const Model = () => {
  const {
    dataSources,
    dataModel: { dag },
    setDagData,
  } = useStore((s) => s.data, shallow);

  const nodes: ReactNodeData[] = Object.entries(dag).map(([k, v]) => ({
    id: k,
    type: Node,
    left: v.left,
    top: v.top,
    data: {
      title: k,
      cols: dataSources[k].columns,
    },
  }));

  const updateDagData = (state: ReactNodeData[]) =>
    setDagData(
      state.reduce((res, cur) => ({ ...res, [cur.id]: { top: cur.top, left: cur.left } }), {}),
    );

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
        onStateChange={(state) => updateDagData(state.nodes)}
      >
        <Background type="circle" color={dividerColor} />
      </ButterflyDag>
    </>
  );
};

export default Model;

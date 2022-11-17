import { Endpoint } from 'react-butterfly-dag';
import './Node.css';

interface NodeProps {
  data: {
    title: string;
    cols: string[];
  };
}

const Node = ({ data: { title, cols } }: NodeProps) => {
  return (
    <div className="table-node-root">
      <div className="table-node-header">{title}</div>
      {cols.map((col) => (
        <div className="table-node-item" key={col}>
          <Endpoint
            type="target"
            id={`${col}-target`}
            style={{
              background: '#fff',
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '0.5rem',
              position: 'absolute',
              left: '0.2rem',
            }}
            endpointProps={{ expandArea: 10 }}
          />
          {col}
          <Endpoint
            type="source"
            id={`${col}-source`}
            style={{
              background: '#fff',
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '0.5rem',
              position: 'absolute',
              right: '0.2rem',
            }}
            endpointProps={{ expandArea: 10 }}
          />
        </div>
      ))}
    </div>
  );
};

export default Node;

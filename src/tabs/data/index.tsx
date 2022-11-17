import Model from './Model';

interface DataTabProps {
  id: string;
}

const DataTab = ({ id }: DataTabProps) => {
  return (
    <div id={id} style={{ flex: '1 1 auto' }}>
      <Model />
    </div>
  );
};

export default DataTab;

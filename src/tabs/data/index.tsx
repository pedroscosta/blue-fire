import Overlay from '@/components/feedback/Overlay';
import { useDropzone } from 'react-dropzone';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import Model from './Model';

interface DataTabProps {
  id: string;
}

const DataTab = ({ id }: DataTabProps) => {
  const { getRootProps, isDragAccept } = useDropzone({
    accept: {
      'text/*': ['.csv'],
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
    noClick: true,
  });

  return (
    <>
      <div
        id={id}
        style={{ flex: '1 1 auto', display: 'flex', position: 'relative' }}
        {...getRootProps()}
      >
        {isDragAccept && (
          <Overlay icon={<BsFileEarmarkPlus size={'6.5rem'} />}>Insert new data source</Overlay>
        )}
        <Model />
      </div>
    </>
  );
};

export default DataTab;

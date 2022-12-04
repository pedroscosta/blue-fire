import Overlay from '@/components/feedback/Overlay';
import { useStore } from '@/store';
import { stripExtension } from '@/utils/files';
import { useDropzone } from 'react-dropzone';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import * as XLSX from 'xlsx';
import shallow from 'zustand/shallow';
import Model from './Model';

interface DataTabProps {
  id: string;
}

const DataTab = ({ id }: DataTabProps) => {
  const { createDataSource } = useStore((s) => s.data, shallow);

  const handleFileDrop = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { sheetRows: 1 });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const dataArray: any = XLSX.utils
      .sheet_to_json(worksheet, {
        header: 1,
      })
      .filter((row: any) => row.length > 0);

    const columns = dataArray[0];

    createDataSource(stripExtension(file.name), {
      location: file.path,
      columns,
    });
  };

  const { getRootProps, isDragAccept } = useDropzone({
    accept: {
      'text/*': ['.csv'],
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => handleFileDrop(file));
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

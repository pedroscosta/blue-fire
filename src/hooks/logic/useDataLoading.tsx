import { DataSource, LoadedData } from '@/store/slices/data';
import { ToastId } from '@chakra-ui/react';
import { IpcRendererEvent } from 'electron';
import { useRef } from 'react';
import useToast, { UseToastProps } from '../useToast';

const useDataLoading = () => {
  const toast = useToast();

  const toastId = useRef<ToastId>();

  const load = (data: Record<string, DataSource>, callback: (buffer: LoadedData) => void) => {
    let loadedFiles = 0;

    const buffer: LoadedData = {
      fields: {},
      tables: {},
    };

    const removeListener = ipcBridge.subscribe(
      'bf:load-data',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_e: IpcRendererEvent, d: any) => {
        d = d[0];

        let text: string | undefined = undefined;

        switch (d.type) {
          case 'BEGIN': {
            options.content = 'Loading data...';
            options.extendedContent = '';
            options.duration = null;
            options.status = 'loading';
            break;
          }
          case 'END': {
            options.content = 'Data loaded successfully';
            options.status = 'success';
            options.duration = 5000;
            options.progress = undefined;

            callback(buffer);
            break;
          }
          case 'FILE_FAIL': {
            text = `Cannot load ${d.payload.file}, please check the file integrity. \n Aborting...`;
            options.status = 'error';
            options.content = 'Data loading failed';
            break;
          }
          case 'START_FILE': {
            text = `Loading ${d.payload.file}...`;
            break;
          }
          case 'LOADED_FILE': {
            text = `  Done.\n`;
            loadedFiles++;
            options.progress = (loadedFiles / Object.keys(data).length) * 100;

            d.payload.columns.forEach((c: string) => {
              buffer.fields[c] = d.payload.file;
            });

            buffer.tables[d.payload.file] = d.payload.data;

            break;
          }
        }

        if (text) {
          options.extendedContent = `${options.extendedContent + text}`;
        }

        if (toastId.current && toast.isActive(toastId.current)) {
          toast.update(toastId.current, options);
        } else {
          toastId.current = toast.add(options);
        }
      },
    );

    const options = {
      content: 'Loading data...',
      onCloseComplete: () => removeListener(),
      progress: 0,
    } as UseToastProps;

    ipcBridge.loadData(data);
  };

  return { load };
};

export default useDataLoading;

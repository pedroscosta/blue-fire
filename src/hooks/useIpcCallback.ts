import { IpcRendererEvent } from 'electron';
import { useEffect } from 'react';

const useIpcCallback = (channel: string, callback: (data: any) => void) => {
  useEffect(() => {
    const removeListener = ipcBridge.subscribe(channel, (_e: IpcRendererEvent, data: any) =>
      callback(data),
    );
    return () => {
      removeListener();
    };
  }, []);
};

export default useIpcCallback;

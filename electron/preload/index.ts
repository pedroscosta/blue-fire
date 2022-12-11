import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface DataSource {
  location: string;
  columns: string[];
}

contextBridge.exposeInMainWorld('electron', {
  closeWindow: () => ipcRenderer.send('closeWindow'),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  isWindowMaximized: () => ipcRenderer.invoke('isWindowMaximized'),
});

const ipcBridge = {
  subscribe: (channel: string, callback: (e: IpcRendererEvent, data: any) => void) => {
    const subscription = (e: IpcRendererEvent, ...args: any) => callback(e, args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  loadData: (sources: Record<string, DataSource>) => ipcRenderer.send('bf:load-data', sources),
};

contextBridge.exposeInMainWorld('ipcBridge', ipcBridge);

module.exports = ipcBridge;

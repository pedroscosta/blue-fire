import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const bfCore = {
  saveFileAs: async (stored: unknown) => {
    return ipcRenderer.invoke('BF_CORE_SAVE_FILE_AS', stored);
  },
  saveFile: (stored: unknown) => {
    ipcRenderer.invoke('BF_CORE_SAVE_FILE', stored);
  },
  openFile: () => ipcRenderer.invoke('BF_CORE_OPEN_FILE'),
  appData: () => ipcRenderer.invoke('BF_CORE_GET_APP_DATA'),
  // Load data
  reloadDataSources: (stored: unknown) => {
    ipcRenderer.invoke('BF_CORE_RELOAD_DATA_SOURCES', stored);
  },
  handleLoadDataResponse: (
    callback: (event: IpcRendererEvent, ...args: unknown[]) => void
  ) => ipcRenderer.on('BF_CORE_LOAD_DATA_RESPONSE', callback),
  // Load modules
  loadModules: (dir: string) => ipcRenderer.invoke('BF:LOAD_MODULES', dir),
};

export default bfCore;

contextBridge.exposeInMainWorld('bfCore', bfCore);

contextBridge.exposeInMainWorld('electron', {
  closeWindow: () => ipcRenderer.send('closeWindow'),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  isWindowMaximized: () => ipcRenderer.invoke('isWindowMaximized'),
});

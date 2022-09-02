const { ipcRenderer } = require('electron');

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
  handleLoadDataResponse: (callback: (...args: unknown[]) => void) =>
    ipcRenderer.on('BF_CORE_LOAD_DATA_RESPONSE', callback),
  // Load modules
  loadModules: () => {
    ipcRenderer.invoke('BF:LOAD_MODULES');
  },
};

export default bfCore;

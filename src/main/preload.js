const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  closeWindow: () => ipcRenderer.send('closeWindow'),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  isWindowMaximized: () => ipcRenderer.invoke('isWindowMaximized'),
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    send(channel) {
      ipcRenderer.send(channel);
    },
  },
});

contextBridge.exposeInMainWorld('bfCore', {
  // Menu functions
  saveFileAs: async (stored) => {
    return ipcRenderer.invoke('BF_CORE_SAVE_FILE_AS', stored);
  },
  saveFile: (stored) => {
    ipcRenderer.invoke('BF_CORE_SAVE_FILE', stored);
  },
  openFile: () => ipcRenderer.invoke('BF_CORE_OPEN_FILE'),
  appData: () => ipcRenderer.invoke('BF_CORE_GET_APP_DATA'),
  // Load data
  reloadDataSources: (stored) => {
    ipcRenderer.invoke('BF_CORE_RELOAD_DATA_SOURCES', stored);
  },
  handleLoadDataResponse: (callback) =>
    ipcRenderer.on('BF_CORE_LOAD_DATA_RESPONSE', callback),
});

/* eslint-disable import/extensions */
const { contextBridge, ipcRenderer } = require('electron');

const bfCore = require('./api.ts');

contextBridge.exposeInMainWorld('electron', {
  closeWindow: () => ipcRenderer.send('closeWindow'),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  isWindowMaximized: () => ipcRenderer.invoke('isWindowMaximized'),
});

contextBridge.exposeInMainWorld('bfCore', bfCore);

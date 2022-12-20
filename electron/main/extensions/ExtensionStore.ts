import { ipcMain, protocol } from 'electron';
import fs from 'fs';
import path from 'path';
import Extension from './Extension';

export default class ExtensionStore {
  private loadedExtensions: { [index: string]: Extension } = {};

  constructor() {
    this.registerExtensionsProtocol();
    this.registerIPC();
  }

  private registerExtensionsProtocol() {
    return protocol.registerFileProtocol('bf-extension', (request, callback) => {
      const entry = request.url.substring('bf-extension://'.length);
      const extName = entry.split('/')[0];
      const { folder } = this.loadedExtensions[extName];
      const filePath = path.normalize(`${folder}/${entry}`);
      callback({ path: filePath });
    });
  }

  getExtensions() {
    return Object.values(this.loadedExtensions);
  }

  getActiveExtensions() {
    return Object.values(this.loadedExtensions).filter((ext) => ext.active);
  }

  loadExtension(ext: Extension) {
    this.loadedExtensions[ext.name] = ext;
  }

  unloadExtension(name: string): boolean {
    return delete this.loadedExtensions[name];
  }

  loadExtensions(folder: string) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const extensionsNames = fs.readdirSync(folder);

    extensionsNames.forEach((extension) => {
      if (!extension.startsWith('_'))
        this.loadedExtensions[extension] = new Extension(extension, folder);
    });
  }

  registerIPC() {
    ipcMain.handle('bf:extensions:getActive', (_event: Event) => {
      return JSON.parse(JSON.stringify(this.getActiveExtensions()));
    });
  }
}

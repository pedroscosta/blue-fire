/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import ExtensionStore from './extensions/ExtensionStore';
import { resolveHtmlPath } from './util';
import { getAppVersion, saveStoreContents } from './utils/app';
import { readXLSX } from './utils/dataSources';

const fs = require('fs').promises;
const fsSync = require('fs');

/* ===================================================================================================================
      Setting userData
 =================================================================================================================== */

const userDataPath = path.join(app.getPath('home'), '.bluefire');
// TODO: Save this to a settings context

if (!fsSync.existsSync(userDataPath)) {
  fsSync.mkdirSync(userDataPath);
}

// app.setPath('userData', path.join(app.getPath('home'), 'bluefire'));

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      contextIsolation: true, // add this
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    // Remove the window frame from windows applications
    frame: false,
    // Hide the titlebar from MacOS applications while keeping the stop lights
    titleBarStyle: 'hidden',
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    /* ===================================================================================================================
      Extensions store
 =================================================================================================================== */

    const extensionStore = new ExtensionStore();

    extensionStore.loadExtensions(path.join(userDataPath, 'extensions'));

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

/* ===================================================================================================================
      Title bar
 =================================================================================================================== */

ipcMain.on('closeWindow', () => {
  mainWindow?.close();
});

ipcMain.on('minimizeWindow', () => {
  mainWindow?.minimize();
});

ipcMain.on('maximizeWindow', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.restore();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('isWindowMaximized', () => {
  return mainWindow?.isMaximized();
});

/* ===================================================================================================================
      Menu functions
 =================================================================================================================== */

ipcMain.handle('BF_CORE_SAVE_FILE_AS', async (_event, store) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    defaultPath: 'default.bf',
    filters: [
      { name: 'BlueFire Project', extensions: ['bf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (filePath && !canceled) {
    saveStoreContents(store, filePath);
    return filePath;
  }

  return undefined;
});

ipcMain.handle('BF_CORE_SAVE_FILE', (_event, store) => {
  saveStoreContents(store);
});

ipcMain.handle('BF_CORE_OPEN_FILE', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'BlueFire Project', extensions: ['bf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (filePaths && !canceled) {
    const filePath = filePaths[0];
    const data = await fs.readFile(filePath, 'utf8');

    const fileData = JSON.parse(data);
    return [fileData, filePath];
  }

  return undefined;
});

ipcMain.handle('BF_CORE_GET_APP_DATA', () => ({ version: getAppVersion() }));

/* ===================================================================================================================
      Loading data sources
 =================================================================================================================== */

ipcMain.handle('BF_CORE_RELOAD_DATA_SOURCES', async (_event, dataModel) => {
  // Had to use a for loop here instead of forEach (or similar) because for loops are "async aware", meaning: they execute async statements in the right order.
  for (const [file, values] of Object.entries<any>(dataModel.tables)) {
    mainWindow?.webContents.send('BF_CORE_LOAD_DATA_RESPONSE', {
      type: 'START_FILE',
      payload: { file },
    });

    let fileData;

    try {
      fileData = await fs.readFile(values.file);
    } catch (e) {
      mainWindow?.webContents.send('BF_CORE_LOAD_DATA_RESPONSE', {
        type: 'FILE_FAIL',
        payload: { file },
      });

      continue;
    }

    const [columns, data] = readXLSX(fileData);

    mainWindow?.webContents.send('BF_CORE_LOAD_DATA_RESPONSE', {
      type: 'LOADED_FILE',
      payload: { file, columns, data },
    });
  }
  mainWindow?.webContents.send('BF_CORE_LOAD_DATA_RESPONSE', {
    type: 'END',
  });
});

/* ===================================================================================================================
      Loading modules
 =================================================================================================================== */

ipcMain.handle('BF:DISCOVER_MODULES', (_event: Event, dir: string) => {
  const files = fsSync.readdirSync(path.join(__dirname, dir));
  return files.map((file: string) => file.split('\\').join('/')); // path.join(__dirname, dir, file)
}); //

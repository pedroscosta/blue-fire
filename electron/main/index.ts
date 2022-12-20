// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, '../public');
process.env.SRC = join(__dirname, '../../../src');

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { existsSync, mkdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { release } from 'os';
import { join } from 'path';
import ExtensionStore from './extensions/ExtensionStore';
import { readXLSX } from './utils/fileUtils';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const installExtensions = async () => {
  const installer: any = (await import('electron-devtools-installer')).default;
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

/* ===================================================================================================================
      Setting userData
 =================================================================================================================== */

const userDataPath = join(app.getPath('home'), '.bluefire');
// TODO: Save this to a settings context

if (!existsSync(userDataPath)) {
  mkdirSync(userDataPath);
}

/* ===================================================================================================================
        Setting main window
  =================================================================================================================== */

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  if (!app.isPackaged) {
    await installExtensions();
  }

  win = new BrowserWindow({
    title: 'Blue Fire',
    icon: join(process.env.PUBLIC, 'icons', 'blue-fire-512.png'),
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Remove the window frame from windows applications
    frame: false,
    // Hide the titlebar from MacOS applications while keeping the stop lights
    titleBarStyle: 'hidden',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  /* ===================================================================================================================
      Extensions store
 =================================================================================================================== */

  const extensionStore = new ExtensionStore();

  extensionStore.loadExtensions(join(userDataPath, 'extensions'));
  extensionStore.loadExtensions(
    join(app.isPackaged ? process.env.DIST : process.env.SRC, 'internal_extensions'),
  );
  createWindow();
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

/* ===================================================================================================================
      Title bar
 =================================================================================================================== */

ipcMain.on('closeWindow', () => {
  win?.close();
});

ipcMain.on('minimizeWindow', () => {
  win?.minimize();
});

ipcMain.on('maximizeWindow', () => {
  if (win?.isMaximized()) {
    win?.restore();
  } else {
    win?.maximize();
  }
});

ipcMain.handle('isWindowMaximized', () => {
  return win?.isMaximized();
});

/* ===================================================================================================================
      File loading
 =================================================================================================================== */

export interface DataSource {
  location: string;
  columns: string[];
}

let loadingData = false; // TODO: Fix this for a better solution, web workers maybe?

ipcMain.on('bf:load-data', async (_e, sources: Record<string, DataSource>) => {
  if (loadingData) return;

  loadingData = true;
  let aborted = false;

  win?.webContents.send('bf:load-data', {
    type: 'BEGIN',
  });

  for (const [file, source] of Object.entries(sources)) {
    const { location } = source;

    win?.webContents.send('bf:load-data', {
      type: 'START_FILE',
      payload: { file, location },
    });

    try {
      const fileData = await readFile(location);

      const [columns, data] = readXLSX(fileData);

      win?.webContents.send('bf:load-data', {
        type: 'LOADED_FILE',
        payload: { file, location, data, columns },
      });
    } catch (__e) {
      win?.webContents.send('bf:load-data', {
        type: 'FILE_FAIL',
        payload: { file, location },
      });

      aborted = true;
      break;
    }
  }

  if (!aborted) {
    win?.webContents.send('bf:load-data', {
      type: 'END',
    });
  }
  loadingData = false;
});

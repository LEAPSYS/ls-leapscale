import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { SerialPort } from 'serialport';
import { ReadlineParser } from 'serialport';

let mainWindow;
let port;
let parser;
let isClosing = false;
let lastWeights = [];

const STABLE_COUNT = 5;
const STABLE_RANGE = 0.002;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

async function closePort() {
  return new Promise((resolve) => {
    if (!port || !port.isOpen) {
      return resolve();
    }
    console.log('Closing serial port...');
    parser?.removeAllListeners();
    port.close((err) => {
      if (err) {
        console.error('Error closing port:', err.message);
      } else {
        console.log('Serial port closed successfully');
      }
      resolve();
    });
  });
}

function extractWeight(data) {
  const match = data.match(/([\d.]+)/);
  if (!match) return null;
  return parseFloat(match[1]);
}

function checkStableWeight(weight) {
  lastWeights.push(weight);
  if (lastWeights.length > STABLE_COUNT) {
    lastWeights.shift();
  }
  if (lastWeights.length === STABLE_COUNT) {
    const max = Math.max(...lastWeights);
    const min = Math.min(...lastWeights);
    if (max - min <= STABLE_RANGE) {
      const stableWeight = weight;
      mainWindow.webContents.send('stable-weight', stableWeight);
      lastWeights = [];
    }
  }
}

// APP EVENTS

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.ls.leapscale');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  await closePort();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  if (isClosing) {
    return;
  }
  event.preventDefault();
  isClosing = true;
  await closePort();
  setTimeout(() => app.quit(), 500);
});

// IPC EVENTS

ipcMain.handle('disconnect-port', async () => {
  if (port && port.isOpen) {
    await closePort();
    mainWindow.webContents.send('port-status', 'disconnected'); 
  }
});

ipcMain.handle('list-ports', async () => {
  const ports = await SerialPort.list();
  return ports.map((p) => p.path);
});

ipcMain.handle('connect-port', async (event, portPath) => {
  if (port && port.isOpen) {
    await closePort();
  }
  port = new SerialPort({
    path: portPath,
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: false,
    lock: false
  });
  await new Promise((r) => setTimeout(r, 800));
  return new Promise((resolve, reject) => {
    port.open((err) => {
      if (err) {
        console.error('Open error', err.message);
        return reject(err.message);
      }
    });
  
    port.on('open', () => {
      mainWindow.webContents.send('port-status', 'connected');
    });
    port.on('close', () => {
      mainWindow.webContents.send('port-status', 'disconnected');
    });
    parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    parser.on('data', (data) => {
      const weight = extractWeight(data);
      if (!weight) return;
      mainWindow.webContents.send('live-weight', weight);
      checkStableWeight(weight);
    });
    return resolve(true);
  });
});

// PROCESS EVENTS

process.on('SIGINT', async () => {
  await closePort();
  process.exit();
});

process.on('uncaughtException', async (err) => {
  console.error(err);
  await closePort();
  process.exit(1);
});

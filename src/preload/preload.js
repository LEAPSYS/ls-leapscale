import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {
  listPorts: () => ipcRenderer.invoke('list-ports'),
  connectPort: (port) => ipcRenderer.invoke('connect-port', port),
  disconnectPort: () => ipcRenderer.invoke('disconnect-port'),
  onLiveWeight: (callback) => ipcRenderer.on('live-weight', (e, data) => callback(data)),
  onStableWeight: (callback) => ipcRenderer.on('stable-weight', (e, data) => callback(data)),
  onPortStatus: (callback) => ipcRenderer.on('port-status', (e, status) => callback(status)),
  loadItems: () => ipcRenderer.invoke('load-items'),
  onMangingStatus: (callback) => ipcRenderer.on('manging-status', (e, data) => callback(data)),
  saveFile: (fileName, content) => ipcRenderer.invoke('save-file', fileName, content),
  readFile: (fileName) => ipcRenderer.invoke('read-file', fileName)
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}

import { contextBridge, ipcRenderer } from 'electron'

import { IPC_CHANNELS } from '../shared/ipc.js'
import type { AppSettings, DownloadProgress, DownloadRequest, VideoInfo } from '../shared/models.js'

const electronAPI = {
  probeUrl: (url: string): Promise<VideoInfo> => ipcRenderer.invoke(IPC_CHANNELS.PROBE_URL, url),
  startDownload: (request: DownloadRequest): Promise<{ taskId: string }> =>
    ipcRenderer.invoke(IPC_CHANNELS.START_DOWNLOAD, request),
  openDirectory: (path?: string): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.OPEN_DIRECTORY, path),
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  setSettings: (next: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_SETTINGS, next),
  onDownloadProgress: (listener: (progress: DownloadProgress) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, progress: DownloadProgress) => {
      listener(progress)
    }

    ipcRenderer.on(IPC_CHANNELS.DOWNLOAD_PROGRESS, handler)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.DOWNLOAD_PROGRESS, handler)
    }
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

import { contextBridge, ipcRenderer } from 'electron'

import { IPC_CHANNELS, IPC_ERROR_PREFIX } from '../shared/ipc.js'
import type {
  AppSettings,
  DownloadProgress,
  DownloadRequest,
  RuntimeDiagnostics,
  VideoInfo,
} from '../shared/models.js'

interface IpcErrorPayload {
  code: string
  message: string
  context: string
  details?: string
}

function normalizeInvokeError(error: unknown): Error {
  if (!(error instanceof Error)) {
    return new Error('Unknown IPC error')
  }

  if (!error.message.startsWith(IPC_ERROR_PREFIX)) {
    return error
  }

  try {
    const payload = JSON.parse(error.message.slice(IPC_ERROR_PREFIX.length)) as IpcErrorPayload
    const details = payload.details ? ` (${payload.details})` : ''
    return new Error(`[${payload.code}] ${payload.message}${details}`)
  } catch {
    return new Error('Malformed IPC error payload')
  }
}

async function invokeIpc<T>(channel: string, ...args: unknown[]): Promise<T> {
  try {
    return await ipcRenderer.invoke(channel, ...args)
  } catch (error) {
    throw normalizeInvokeError(error)
  }
}

const electronAPI = {
  probeUrl: (url: string): Promise<VideoInfo> => invokeIpc(IPC_CHANNELS.PROBE_URL, url),
  startDownload: (request: DownloadRequest): Promise<{ taskId: string }> =>
    invokeIpc(IPC_CHANNELS.START_DOWNLOAD, request),
  openDirectory: (path?: string): Promise<string | null> =>
    invokeIpc(IPC_CHANNELS.OPEN_DIRECTORY, path),
  getSettings: (): Promise<AppSettings> => invokeIpc(IPC_CHANNELS.GET_SETTINGS),
  setSettings: (next: Partial<AppSettings>): Promise<AppSettings> =>
    invokeIpc(IPC_CHANNELS.SET_SETTINGS, next),
  getBinaryStatus: (): Promise<RuntimeDiagnostics> => invokeIpc(IPC_CHANNELS.GET_BINARY_STATUS),
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

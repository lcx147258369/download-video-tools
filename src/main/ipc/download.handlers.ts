import type { IpcMain } from 'electron'

import type { DownloadProgress, DownloadRequest } from '../../shared/models.js'
import { IPC_CHANNELS } from '../../shared/ipc.js'
import { YtDlpService } from '../services/yt-dlp.service.js'
import { createIpcError } from '../utils/error.js'

export function registerDownloadHandlers(
  ipcMain: IpcMain,
  ytDlpService: YtDlpService,
  emitProgress: (progress: DownloadProgress) => void,
): void {
  ipcMain.handle(IPC_CHANNELS.START_DOWNLOAD, async (_event, request: DownloadRequest) => {
    try {
      return await ytDlpService.startDownload(request, emitProgress)
    } catch (error) {
      throw createIpcError(error, {
        code: 'DOWNLOAD_START_FAILED',
        message: 'Failed to start download task.',
        context: `url=${request.url}`,
      })
    }
  })
}

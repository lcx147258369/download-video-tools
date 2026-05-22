import type { IpcMain } from 'electron'

import { IPC_CHANNELS } from '../../shared/ipc.js'
import { YtDlpService } from '../services/yt-dlp.service.js'
import { createIpcError } from '../utils/error.js'

export function registerProbeHandlers(ipcMain: IpcMain, ytDlpService: YtDlpService): void {
  ipcMain.handle(IPC_CHANNELS.PROBE_URL, async (_event, url: string) => {
    try {
      return await ytDlpService.probe(url)
    } catch (error) {
      throw createIpcError(error, {
        code: 'PROBE_FAILED',
        message: 'Failed to probe video metadata.',
        context: `url=${url}`,
      })
    }
  })
}

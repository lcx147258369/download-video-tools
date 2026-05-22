import type { IpcMain } from 'electron'

import { IPC_CHANNELS } from '../../shared/ipc.js'
import { YtDlpService } from '../services/yt-dlp.service.js'

export function registerProbeHandlers(ipcMain: IpcMain, ytDlpService: YtDlpService): void {
  ipcMain.handle(IPC_CHANNELS.PROBE_URL, async (_event, url: string) => {
    return ytDlpService.probe(url)
  })
}

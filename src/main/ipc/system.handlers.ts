import type { IpcMain } from 'electron'
import { dialog, shell } from 'electron'

import { IPC_CHANNELS } from '../../shared/ipc.js'
import type { AppSettings } from '../../shared/models.js'
import { SettingsService } from '../services/settings.service.js'

export function registerSystemHandlers(
  ipcMain: IpcMain,
  settingsService: SettingsService,
): void {
  ipcMain.handle(IPC_CHANNELS.OPEN_DIRECTORY, async (_event, path?: string) => {
    if (path) {
      await shell.openPath(path)
      return path
    }

    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    })

    if (result.canceled) {
      return null
    }

    return result.filePaths[0] ?? null
  })

  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => settingsService.getSettings())
  ipcMain.handle(IPC_CHANNELS.SET_SETTINGS, async (_event, next: Partial<AppSettings>) => {
    return settingsService.setSettings(next)
  })
}

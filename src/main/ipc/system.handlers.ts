import type { IpcMain } from 'electron'
import { dialog, shell } from 'electron'

import { IPC_CHANNELS } from '../../shared/ipc.js'
import type { AppSettings } from '../../shared/models.js'
import { BinaryService } from '../services/binary.service.js'
import { SettingsService } from '../services/settings.service.js'
import { createIpcError } from '../utils/error.js'

export function registerSystemHandlers(
  ipcMain: IpcMain,
  settingsService: SettingsService,
  binaryService: BinaryService,
): void {
  ipcMain.handle(IPC_CHANNELS.OPEN_DIRECTORY, async (_event, path?: string) => {
    try {
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
    } catch (error) {
      throw createIpcError(error, {
        code: 'OPEN_DIRECTORY_FAILED',
        message: 'Failed to open directory dialog.',
        context: 'system:open-directory',
      })
    }
  })

  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => {
    try {
      return settingsService.getSettings()
    } catch (error) {
      throw createIpcError(error, {
        code: 'GET_SETTINGS_FAILED',
        message: 'Failed to load settings.',
        context: 'settings:get',
      })
    }
  })
  ipcMain.handle(IPC_CHANNELS.SET_SETTINGS, async (_event, next: Partial<AppSettings>) => {
    try {
      return settingsService.setSettings(next)
    } catch (error) {
      throw createIpcError(error, {
        code: 'SET_SETTINGS_FAILED',
        message: 'Failed to save settings.',
        context: 'settings:set',
      })

      ipcMain.handle(IPC_CHANNELS.GET_BINARY_STATUS, async () => {
        try {
          return await binaryService.getRuntimeDiagnostics()
        } catch (error) {
          throw createIpcError(error, {
            code: 'GET_BINARY_STATUS_FAILED',
            message: 'Failed to read binary diagnostics.',
            context: 'system:get-binary-status',
          })
        }
      })
    }
  })
}

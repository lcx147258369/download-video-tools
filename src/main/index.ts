import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { registerDownloadHandlers } from './ipc/download.handlers.js'
import { registerProbeHandlers } from './ipc/probe.handlers.js'
import { registerSystemHandlers } from './ipc/system.handlers.js'
import { SettingsService } from './services/settings.service.js'
import { YtDlpService } from './services/yt-dlp.service.js'
import { IPC_CHANNELS } from '../shared/ipc.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    void window.loadURL(devServerUrl)
  } else {
    const rendererPath = path.resolve(__dirname, '../../dist/index.html')
    void window.loadFile(rendererPath)
  }

  return window
}

function registerIpcHandlers(): void {
  const ytDlpService = new YtDlpService()
  const settingsService = new SettingsService(app.getPath('downloads'))

  const emitProgress = (progress: Parameters<BrowserWindow['webContents']['send']>[1]) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(IPC_CHANNELS.DOWNLOAD_PROGRESS, progress)
    }
  }

  registerProbeHandlers(ipcMain, ytDlpService)
  registerDownloadHandlers(ipcMain, ytDlpService, emitProgress)
  registerSystemHandlers(ipcMain, settingsService)
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

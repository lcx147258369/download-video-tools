import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { registerDownloadHandlers } from './ipc/download.handlers.js'
import { registerProbeHandlers } from './ipc/probe.handlers.js'
import { registerSystemHandlers } from './ipc/system.handlers.js'
import { BinaryService } from './services/binary.service.js'
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

function registerIpcHandlers(): BinaryService {
  const ytDlpService = new YtDlpService()
  const settingsService = new SettingsService(app.getPath('downloads'))
  const binaryService = new BinaryService()

  const emitProgress = (progress: Parameters<BrowserWindow['webContents']['send']>[1]) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(IPC_CHANNELS.DOWNLOAD_PROGRESS, progress)
    }
  }

  registerProbeHandlers(ipcMain, ytDlpService)
  registerDownloadHandlers(ipcMain, ytDlpService, emitProgress)
  registerSystemHandlers(ipcMain, settingsService, binaryService)
  return binaryService
}

app.whenReady().then(() => {
  const binaryService = registerIpcHandlers()
  createMainWindow()

  void binaryService.getRuntimeDiagnostics().then((diagnostics) => {
    if (!diagnostics.ytDlp.available) {
      dialog.showErrorBox(
        'yt-dlp unavailable',
        `Cannot find executable "${diagnostics.ytDlp.command}".\n\n` +
          `Please install yt-dlp or set YT_DLP_PATH.\n` +
          `Details: ${diagnostics.ytDlp.error ?? 'Unknown error'}`,
      )
    }
  })

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

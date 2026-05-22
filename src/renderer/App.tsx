import { useEffect, useMemo, useState } from 'react'

import type { AppSettings, DownloadProgress, RuntimeDiagnostics, VideoInfo } from '../shared/models'
import { DownloadTaskList } from './components/DownloadTaskList'
import { SettingsPanel } from './components/SettingsPanel'
import { UrlInput } from './components/UrlInput'
import { VideoInfoCard } from './components/VideoInfoCard'

const DEFAULT_SETTINGS: AppSettings = {
  downloadDir: '',
  maxConcurrent: 2,
  useProxy: false,
  proxyUrl: '',
}

export function App() {
  const [url, setUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedFormatId, setSelectedFormatId] = useState('best')
  const [tasks, setTasks] = useState<DownloadProgress[]>([])
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [diagnostics, setDiagnostics] = useState<RuntimeDiagnostics | null>(null)

  const api = window.electronAPI
  const isElectronAvailable = useMemo(() => Boolean(api), [api])

  useEffect(() => {
    if (!api) {
      return
    }

    void api
      .getSettings()
      .then(setSettings)
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load settings.')
      })
    void api
      .getBinaryStatus()
      .then(setDiagnostics)
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load binary diagnostics.')
      })
    return api.onDownloadProgress((progress) => {
      setTasks((current) => {
        const index = current.findIndex((task) => task.taskId === progress.taskId)
        if (index === -1) {
          return [progress, ...current]
        }

        const next = [...current]
        next[index] = { ...next[index], ...progress }
        return next
      })
    })
  }, [api])

  const handleProbe = async () => {
    if (!api || !url.trim()) {
      return
    }

    setErrorMessage(null)
    try {
      const probed = await api.probeUrl(url.trim())
      setVideoInfo(probed)
      setSelectedFormatId(probed.formats[0]?.id ?? 'best')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to probe URL.')
    }
  }

  const handleStart = async () => {
    if (!api || !url.trim()) {
      return
    }

    setErrorMessage(null)
    try {
      await api.startDownload({
        url: url.trim(),
        outputDir: settings.downloadDir,
        formatId: selectedFormatId,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start download.')
    }
  }

  const handleSettingsChange = async (next: Partial<AppSettings>) => {
    const merged = { ...settings, ...next }
    setSettings(merged)
    if (!api) {
      return
    }

    setErrorMessage(null)
    try {
      const persisted = await api.setSettings(next)
      setSettings(persisted)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save settings.')
    }
  }

  const handleOpenDirectory = async () => {
    if (!api) {
      return
    }

    setErrorMessage(null)
    try {
      const selected = await api.openDirectory()
      if (selected) {
        await handleSettingsChange({ downloadDir: selected })
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to select directory.')
    }
  }

  return (
    <main className="app-shell">
      <header>
        <h1>Download Video Tools</h1>
        <p>Electron + React MVP scaffold for yt-dlp / ffmpeg integration.</p>
        {!isElectronAvailable && (
          <p className="notice">Electron bridge unavailable (running in browser-only mode).</p>
        )}
        {diagnostics && !diagnostics.ytDlp.available && (
          <p className="notice">
            yt-dlp unavailable: {diagnostics.ytDlp.command} ({diagnostics.ytDlp.error ?? 'unknown'})
          </p>
        )}
        {diagnostics && !diagnostics.ffmpeg.available && (
          <p className="notice">
            ffmpeg unavailable: {diagnostics.ffmpeg.command} ({diagnostics.ffmpeg.error ?? 'unknown'}) —
            remux/audio-extract may be unavailable.
          </p>
        )}
        {errorMessage && <p className="notice">{errorMessage}</p>}
      </header>

      <UrlInput
        url={url}
        setUrl={setUrl}
        onProbe={handleProbe}
        onStart={handleStart}
        disabled={!isElectronAvailable}
      />
      <VideoInfoCard
        videoInfo={videoInfo}
        selectedFormatId={selectedFormatId}
        onFormatChange={setSelectedFormatId}
      />
      <DownloadTaskList tasks={tasks} />
      <SettingsPanel
        settings={settings}
        onChange={handleSettingsChange}
        onOpenDirectory={handleOpenDirectory}
      />
    </main>
  )
}

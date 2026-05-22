import { useEffect, useMemo, useState } from 'react'

import type { AppSettings, DownloadProgress, VideoInfo } from '../shared/models'
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

  const api = window.electronAPI
  const isElectronAvailable = useMemo(() => Boolean(api), [api])

  useEffect(() => {
    if (!api) {
      return
    }

    void api.getSettings().then(setSettings)
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

    const probed = await api.probeUrl(url.trim())
    setVideoInfo(probed)
    setSelectedFormatId(probed.formats[0]?.id ?? 'best')
  }

  const handleStart = async () => {
    if (!api || !url.trim()) {
      return
    }

    await api.startDownload({
      url: url.trim(),
      outputDir: settings.downloadDir,
      formatId: selectedFormatId,
    })
  }

  const handleSettingsChange = async (next: Partial<AppSettings>) => {
    const merged = { ...settings, ...next }
    setSettings(merged)
    if (!api) {
      return
    }

    const persisted = await api.setSettings(next)
    setSettings(persisted)
  }

  const handleOpenDirectory = async () => {
    if (!api) {
      return
    }

    const selected = await api.openDirectory()
    if (selected) {
      await handleSettingsChange({ downloadDir: selected })
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

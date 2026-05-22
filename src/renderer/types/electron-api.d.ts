import type { AppSettings, DownloadProgress, DownloadRequest, VideoInfo } from '../../shared/models'

declare global {
  interface Window {
    electronAPI?: {
      probeUrl: (url: string) => Promise<VideoInfo>
      startDownload: (request: DownloadRequest) => Promise<{ taskId: string }>
      openDirectory: (path?: string) => Promise<string | null>
      getSettings: () => Promise<AppSettings>
      setSettings: (next: Partial<AppSettings>) => Promise<AppSettings>
      onDownloadProgress: (listener: (progress: DownloadProgress) => void) => () => void
    }
  }
}

export {}

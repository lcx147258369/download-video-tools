export interface VideoFormat {
  id: string
  ext: string
  resolution?: string
  fps?: number
  filesize?: number
  vcodec?: string
  acodec?: string
  formatNote?: string
}

export interface VideoInfo {
  url: string
  title: string
  uploader?: string
  duration?: number
  thumbnail?: string
  formats: VideoFormat[]
}

export interface DownloadRequest {
  url: string
  outputDir: string
  formatId?: string
  fileName?: string
  audioOnly?: boolean
}

export type DownloadStatus =
  | 'queued'
  | 'probing'
  | 'downloading'
  | 'merging'
  | 'completed'
  | 'failed'
  | 'canceled'

export interface DownloadProgress {
  taskId: string
  status: DownloadStatus
  percent?: number
  downloadedBytes?: number
  totalBytes?: number
  speed?: string
  etaSeconds?: number
  message?: string
  outputPath?: string
}

export interface AppSettings {
  downloadDir: string
  maxConcurrent: number
  useProxy: boolean
  proxyUrl?: string
}

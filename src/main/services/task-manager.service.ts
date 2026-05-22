import type { DownloadProgress } from '../../shared/models.js'

const PROGRESS_REGEX =
  /\[download\]\s+(?<percent>\d{1,3}(?:\.\d+)?)%\s+of\s+(?<total>\S+)\s+at\s+(?<speed>\S+)\s+ETA\s+(?<eta>\S+)/

export class TaskManagerService {
  parseProgressLine(taskId: string, line: string): DownloadProgress | null {
    const match = PROGRESS_REGEX.exec(line)
    if (!match?.groups) {
      return null
    }

    return {
      taskId,
      status: 'downloading',
      percent: Number(match.groups.percent),
      totalBytes: this.parseHumanSize(match.groups.total),
      speed: match.groups.speed,
      etaSeconds: this.parseEta(match.groups.eta),
    }
  }

  emitQueued(taskId: string): DownloadProgress {
    return { taskId, status: 'queued', percent: 0 }
  }

  emitCompleted(taskId: string, outputPath: string): DownloadProgress {
    return {
      taskId,
      status: 'completed',
      percent: 100,
      outputPath,
      message: 'Download completed',
    }
  }

  private parseEta(eta: string): number | undefined {
    const parts = eta.split(':').map((value) => Number(value))
    if (parts.some((value) => Number.isNaN(value))) {
      return undefined
    }

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]
    }

    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    }

    return undefined
  }

  private parseHumanSize(input: string): number | undefined {
    const match = /^(?<value>[\d.]+)(?<unit>B|KiB|MiB|GiB)$/.exec(input)
    if (!match?.groups) {
      return undefined
    }

    const value = Number(match.groups.value)
    if (Number.isNaN(value)) {
      return undefined
    }

    const multipliers: Record<string, number> = {
      B: 1,
      KiB: 1024,
      MiB: 1024 ** 2,
      GiB: 1024 ** 3,
    }

    return Math.round(value * multipliers[match.groups.unit])
  }
}

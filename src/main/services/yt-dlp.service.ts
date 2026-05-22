import { randomUUID } from 'node:crypto'

import type { DownloadProgress, DownloadRequest, VideoInfo } from '../../shared/models.js'
import { TaskManagerService } from './task-manager.service.js'

export class YtDlpService {
  private readonly taskManager = new TaskManagerService()

  async probe(url: string): Promise<VideoInfo> {
    return {
      url,
      title: 'Scaffold Probe Result',
      uploader: 'Unknown',
      duration: 0,
      formats: [
        { id: 'bestvideo+bestaudio', ext: 'mp4', resolution: 'best', formatNote: 'Best quality' },
        { id: 'best', ext: 'mp4', resolution: 'auto', formatNote: 'Balanced default' },
      ],
    }
  }

  async startDownload(
    request: DownloadRequest,
    emitProgress: (progress: DownloadProgress) => void,
  ): Promise<{ taskId: string }> {
    const taskId = randomUUID()
    emitProgress(this.taskManager.emitQueued(taskId))

    const simulatedLines = [
      '[download] 15.0% of 20.00MiB at 2.00MiB/s ETA 00:09',
      '[download] 50.0% of 20.00MiB at 2.20MiB/s ETA 00:05',
      '[download] 90.0% of 20.00MiB at 2.10MiB/s ETA 00:01',
    ]

    for (const line of simulatedLines) {
      const progress = this.taskManager.parseProgressLine(taskId, line)
      if (progress) {
        emitProgress(progress)
      }
    }

    const outputPath = `${request.outputDir}/${request.fileName ?? 'video'}.mp4`
    emitProgress(this.taskManager.emitCompleted(taskId, outputPath))

    return { taskId }
  }
}

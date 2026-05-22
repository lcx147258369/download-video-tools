import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import type { BinaryStatus, RuntimeDiagnostics } from '../../shared/models.js'

const execFileAsync = promisify(execFile)

function extractVersion(output: string): string | undefined {
  const firstLine = output.split('\n')[0]?.trim()
  return firstLine || undefined
}

export class BinaryService {
  private readonly ytDlpPath = process.env.YT_DLP_PATH?.trim() || 'yt-dlp'
  private readonly ffmpegPath = process.env.FFMPEG_PATH?.trim() || 'ffmpeg'

  async getRuntimeDiagnostics(): Promise<RuntimeDiagnostics> {
    const ytDlp = await this.probeExecutable('yt-dlp', this.ytDlpPath, ['--version'])
    const ffmpeg = await this.probeExecutable('ffmpeg', this.ffmpegPath, ['-version'])

    return {
      ytDlp,
      ffmpeg,
      supportsRemux: ffmpeg.available,
      supportsAudioExtract: ffmpeg.available,
    }
  }

  private async probeExecutable(name: string, command: string, args: string[]): Promise<BinaryStatus> {
    try {
      const { stdout, stderr } = await execFileAsync(command, args, {
        timeout: 8000,
        windowsHide: true,
      })

      const version = extractVersion(`${stdout}\n${stderr}`)
      return {
        name,
        command,
        available: true,
        version,
      }
    } catch (error) {
      return {
        name,
        command,
        available: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}

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

  async getRuntimeDiagnostics(): Promise<RuntimeDiagnostics> {
    return {
      ytDlp: await this.probeExecutable('yt-dlp', this.ytDlpPath, ['--version']),
    }
  }

  private async probeExecutable(name: string, command: string, args: string[]): Promise<BinaryStatus> {
    try {
      const { stdout, stderr } = await execFileAsync(command, args, {
        timeout: 8_000,
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

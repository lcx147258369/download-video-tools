import { IPC_ERROR_PREFIX } from '../../shared/ipc.js'

interface IpcErrorInit {
  code: string
  message: string
  context: string
}

interface IpcErrorPayload extends IpcErrorInit {
  details?: string
}

function extractDetails(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return undefined
}

export function createIpcError(error: unknown, fallback: IpcErrorInit): Error {
  const payload: IpcErrorPayload = {
    ...fallback,
    details: extractDetails(error),
  }

  console.error(`[${payload.code}] ${payload.context}`, error)
  return new Error(`${IPC_ERROR_PREFIX}${JSON.stringify(payload)}`)
}

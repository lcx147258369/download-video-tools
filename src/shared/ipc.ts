export const IPC_CHANNELS = {
  PROBE_URL: 'video:probe-url',
  START_DOWNLOAD: 'download:start',
  OPEN_DIRECTORY: 'system:open-directory',
  GET_SETTINGS: 'settings:get',
  SET_SETTINGS: 'settings:set',
  GET_BINARY_STATUS: 'system:get-binary-status',
  DOWNLOAD_PROGRESS: 'download:progress',
} as const

export const IPC_ERROR_PREFIX = 'IPC_ERROR:'

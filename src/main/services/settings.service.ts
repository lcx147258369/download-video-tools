import Store from 'electron-store'

import type { AppSettings } from '../../shared/models.js'

interface SettingsStoreSchema {
  downloadDir: string
  maxConcurrent: number
  useProxy: boolean
  proxyUrl?: string
}

export class SettingsService {
  private readonly store: Store<SettingsStoreSchema>

  constructor(defaultDownloadDir: string) {
    this.store = new Store<SettingsStoreSchema>({
      name: 'download-video-tools',
      defaults: {
        downloadDir: defaultDownloadDir,
        maxConcurrent: 2,
        useProxy: false,
        proxyUrl: '',
      },
    })
  }

  getSettings(): AppSettings {
    return {
      downloadDir: this.store.get('downloadDir'),
      maxConcurrent: this.store.get('maxConcurrent'),
      useProxy: this.store.get('useProxy'),
      proxyUrl: this.store.get('proxyUrl'),
    }
  }

  setSettings(next: Partial<AppSettings>): AppSettings {
    if (typeof next.downloadDir === 'string') {
      this.store.set('downloadDir', next.downloadDir)
    }
    if (typeof next.maxConcurrent === 'number') {
      this.store.set('maxConcurrent', next.maxConcurrent)
    }
    if (typeof next.useProxy === 'boolean') {
      this.store.set('useProxy', next.useProxy)
    }
    if (typeof next.proxyUrl === 'string') {
      this.store.set('proxyUrl', next.proxyUrl)
    }

    return this.getSettings()
  }
}

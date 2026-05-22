import type { AppSettings } from '../../shared/models'

interface SettingsPanelProps {
  settings: AppSettings
  onChange: (next: Partial<AppSettings>) => void
  onOpenDirectory: () => void
}

export function SettingsPanel({ settings, onChange, onOpenDirectory }: SettingsPanelProps) {
  return (
    <section className="panel">
      <h2>Settings</h2>
      <label className="column">
        <span>Download directory</span>
        <div className="row">
          <input
            value={settings.downloadDir}
            onChange={(event) => onChange({ downloadDir: event.target.value })}
          />
          <button type="button" onClick={onOpenDirectory}>
            Browse
          </button>
        </div>
      </label>
      <label className="column">
        <span>Max concurrent tasks</span>
        <input
          type="number"
          min={1}
          max={8}
          value={settings.maxConcurrent}
          onChange={(event) => onChange({ maxConcurrent: Number(event.target.value) || 1 })}
        />
      </label>
    </section>
  )
}

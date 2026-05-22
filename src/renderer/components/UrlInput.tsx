interface UrlInputProps {
  url: string
  setUrl: (value: string) => void
  onProbe: () => void
  onStart: () => void
  disabled?: boolean
}

export function UrlInput({ url, setUrl, onProbe, onStart, disabled = false }: UrlInputProps) {
  return (
    <section className="panel">
      <h2>Video URL</h2>
      <div className="row">
        <input
          aria-label="Video URL"
          placeholder="Paste page URL..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button type="button" onClick={onProbe} disabled={disabled || !url.trim()}>
          Probe
        </button>
        <button type="button" onClick={onStart} disabled={disabled || !url.trim()}>
          Download
        </button>
      </div>
    </section>
  )
}

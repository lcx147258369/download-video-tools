import type { VideoInfo } from '../../shared/models'

interface VideoInfoCardProps {
  videoInfo: VideoInfo | null
  selectedFormatId: string
  onFormatChange: (value: string) => void
}

export function VideoInfoCard({ videoInfo, selectedFormatId, onFormatChange }: VideoInfoCardProps) {
  if (!videoInfo) {
    return (
      <section className="panel">
        <h2>Video Info</h2>
        <p>No video info yet.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2>{videoInfo.title}</h2>
      <p>{videoInfo.uploader ?? 'Unknown uploader'}</p>
      <label className="column">
        <span>Format</span>
        <select
          value={selectedFormatId}
          onChange={(event) => onFormatChange(event.target.value)}
        >
          {videoInfo.formats.map((format) => (
            <option key={format.id} value={format.id}>
              {format.id} · {format.ext} · {format.resolution ?? 'auto'}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}

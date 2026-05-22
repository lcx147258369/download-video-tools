import type { DownloadProgress } from '../../shared/models'

interface DownloadTaskListProps {
  tasks: DownloadProgress[]
}

export function DownloadTaskList({ tasks }: DownloadTaskListProps) {
  return (
    <section className="panel">
      <h2>Download Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.taskId}>
              <strong>{task.taskId.slice(0, 8)}</strong>
              <span>{task.status}</span>
              <span>{task.percent != null ? `${task.percent.toFixed(1)}%` : '-'}</span>
              <span>{task.speed ?? '-'}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

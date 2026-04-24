import type { RecentActivity } from '../types'

interface ActivityFeedProps {
  items: RecentActivity[]
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <aside className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]">
      <h2 className="text-lg font-semibold text-slate-950">Recent Activity</h2>
      <p className="mt-1 text-sm text-slate-500">Latest movement across enrollment, attendance, and fees.</p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={`${item.type}-${item.occurredAt}-${item.title}`} className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white">
                {item.type}
              </span>
              <span className="text-xs font-medium text-slate-500">{formatTimestamp(item.occurredAt)}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </aside>
  )
}

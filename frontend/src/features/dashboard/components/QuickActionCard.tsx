import { Link } from 'react-router-dom'

interface QuickActionCardProps {
  title: string
  subtitle: string
  to: string
  accent: string
}

export function QuickActionCard({ title, subtitle, to, accent }: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_36px_-24px_rgba(15,23,42,0.35)]"
    >
      <div
        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        Action
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </Link>
  )
}

interface DashboardKpiCardProps {
  title: string
  value: string
  hint: string
  accent: string
}

export function DashboardKpiCard({ title, value, hint, accent }: DashboardKpiCardProps) {
  return (
    <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]">
      <div
        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        {title}
      </div>
      <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </article>
  )
}

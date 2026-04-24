import type { PropsWithChildren } from 'react'

interface DashboardChartCardProps extends PropsWithChildren {
  title: string
  subtitle: string
}

export function DashboardChartCard({
  title,
  subtitle,
  children,
}: DashboardChartCardProps) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

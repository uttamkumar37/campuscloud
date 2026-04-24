import type { MetricPoint } from '../types'

interface MonthlyBarChartProps {
  data: MetricPoint[]
  barColor: string
}

export function MonthlyBarChart({ data, barColor }: MonthlyBarChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1)

  return (
    <div className="flex h-72 items-end gap-4 rounded-[24px] bg-slate-50 p-5">
      {data.map((point) => {
        const height = Math.max((point.value / maxValue) * 100, 6)

        return (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              ₹{Math.round(point.value).toLocaleString()}
            </span>
            <div className="flex h-44 w-full items-end rounded-full bg-white px-2 py-2 shadow-inner">
              <div
                className="w-full rounded-full transition-all duration-300"
                style={{ height: `${height}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {point.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

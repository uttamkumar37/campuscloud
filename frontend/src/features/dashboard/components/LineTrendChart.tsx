import type { MetricPoint } from '../types'

interface LineTrendChartProps {
  data: MetricPoint[]
  strokeColor: string
}

export function LineTrendChart({ data, strokeColor }: LineTrendChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 100)
  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100
      const y = 100 - (point.value / maxValue) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible rounded-[24px] bg-slate-50 p-4">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {data.map((point, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100
          const y = 100 - (point.value / maxValue) * 100

          return <circle key={point.label} cx={x} cy={y} r="2.8" fill={strokeColor} />
        })}
      </svg>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        {data.map((point) => (
          <div key={point.label} className="rounded-2xl bg-slate-100 px-2 py-2">
            <span>{point.label}</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{point.value.toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

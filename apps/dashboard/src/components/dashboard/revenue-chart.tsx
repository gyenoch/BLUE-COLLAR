'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { type DayMetric } from '@/hooks/use-analytics'
import { formatDate } from '@/lib/utils'

interface RevenueChartProps {
  data: DayMetric[]
  color?: string
  label?: string
  formatValue?: (value: number) => string
}

function CustomTooltip({ active, payload, label, formatValue }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card px-3 py-2 shadow-sm text-sm">
        <p className="text-muted-foreground text-xs mb-1">{label}</p>
        <p className="font-semibold">
          {formatValue ? formatValue(payload[0].value) : payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export function RevenueChart({
  data,
  color = '#3b82f6',
  label = 'Revenue',
  formatValue,
}: RevenueChartProps) {
  const chartData = data.map((d) => ({
    date: formatDate(d.date, 'MMM d'),
    value: d.value,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatValue}
        />
        <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#colorValue)"
          name={label}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function CallsChart({ data }: { data: DayMetric[] }) {
  return <RevenueChart data={data} color="#6366f1" label="Calls" />
}

import { useMemo, useState } from 'react'
import {
  Brush,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFinance } from '../context/useFinance'
import type { BalancePoint, CategorySlice } from '../utils/aggregations'
import { formatCurrency } from '../utils/formatCurrency'

const PIE_LIGHT = ['#0ea5e9', '#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b']
const PIE_DARK = ['#38bdf8', '#818cf8', '#2dd4bf', '#fbbf24', '#f472b6', '#a78bfa', '#94a3b8']

interface DashboardChartsProps {
  lineData: BalancePoint[]
  pieData: CategorySlice[]
  minBalance: number
  maxBalance: number
}

export function DashboardCharts({ lineData, pieData, minBalance, maxBalance }: DashboardChartsProps) {
  const { isDark } = useFinance()
  const colors = isDark ? PIE_DARK : PIE_LIGHT
  const gridStroke = isDark ? '#2a3038' : '#e5e7eb'
  const tickFill = isDark ? '#94a3b8' : '#6b7280'
  const lineStroke = isDark ? '#38bdf8' : '#0284c7'
  const brushFill = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.85)'

  const [hoveredPie, setHoveredPie] = useState<number | null>(null)
  const [lockedPie, setLockedPie] = useState<number | null>(null)

  const activePie = lockedPie ?? hoveredPie

  const pieTotal = useMemo(
    () => pieData.reduce((s, p) => s + p.value, 0),
    [pieData],
  )

  const selectedSlice = activePie !== null ? pieData[activePie] : null
  const selectedPct =
    selectedSlice && pieTotal > 0 ? Math.round((selectedSlice.value / pieTotal) * 100) : null

  const showZeroLine = minBalance < 0 && maxBalance > 0

  if (lineData.length === 0 && pieData.length === 0) {
    return null
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {lineData.length > 0 && (
        <div className="animate-enter rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">Balance over time</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Cumulative balance by day — hover points, drag the range slider to zoom.
          </p>
          <div className="mt-4 h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                {showZeroLine && (
                  <ReferenceLine y={0} stroke={tickFill} strokeDasharray="4 4" />
                )}
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: tickFill }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: tickFill }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(Number(v))}
                  width={72}
                />
                <Tooltip
                  animationDuration={200}
                  cursor={{ stroke: lineStroke, strokeWidth: 1, strokeDasharray: '5 5' }}
                  formatter={(value) => {
                    const n = typeof value === 'number' ? value : Number(value)
                    return [formatCurrency(Number.isFinite(n) ? n : 0), 'Balance']
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { date?: string } | undefined
                    return p?.date ? `Date: ${p.date}` : ''
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-card-hover)',
                    background: 'var(--color-elevated)',
                    color: 'var(--color-ink)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke={lineStroke}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: lineStroke, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: 'var(--color-elevated)', strokeWidth: 2 }}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Brush
                  dataKey="label"
                  height={28}
                  travellerWidth={10}
                  stroke={lineStroke}
                  fill={brushFill}
                  tickFormatter={() => ''}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {pieData.length > 0 && (
        <div className="animate-enter rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] [animation-delay:80ms]">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">Spending by category</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Hover or click a slice to highlight; click again to clear.
          </p>
          <div className="mt-4 h-64 w-full min-w-0 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="48%"
                  outerRadius="78%"
                  paddingAngle={2}
                  animationDuration={700}
                  animationEasing="ease-out"
                  onMouseEnter={(_, i) => setHoveredPie(i)}
                  onMouseLeave={() => setHoveredPie(null)}
                  onClick={(_, i) => {
                    setLockedPie((prev) => (prev === i ? null : i))
                  }}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={colors[i % colors.length]}
                      opacity={activePie === null || activePie === i ? 1 : 0.35}
                      stroke={activePie === i ? 'var(--color-elevated)' : 'transparent'}
                      strokeWidth={activePie === i ? 3 : 0}
                      className="cursor-pointer outline-none transition-[opacity,stroke-width] duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip
                  animationDuration={150}
                  formatter={(value, name) => {
                    const n = typeof value === 'number' ? value : Number(value)
                    const amt = formatCurrency(Number.isFinite(n) ? n : 0)
                    return [`${amt}`, String(name)]
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-card-hover)',
                    background: 'var(--color-elevated)',
                    color: 'var(--color-ink)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {pieData.map((entry, i) => {
              const on = activePie === i
              return (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => setLockedPie((prev) => (prev === i ? null : i))}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    on
                      ? 'border-sky-500 bg-sky-500/10 text-[var(--color-ink)] shadow-sm'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: colors[i % colors.length] }}
                    aria-hidden
                  />
                  {entry.name}
                </button>
              )
            })}
          </div>

          {selectedSlice && selectedPct !== null && (
            <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] transition-all duration-300">
              <span className="font-medium">{selectedSlice.name}</span>
              <span className="text-[var(--color-muted)]"> — </span>
              {formatCurrency(selectedSlice.value)}
              <span className="text-[var(--color-muted)]"> ({selectedPct}% of expenses)</span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

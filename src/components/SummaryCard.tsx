interface SummaryCardProps {
  label: string
  value: string
  hint?: string
  trend?: 'positive' | 'negative' | 'neutral'
}

export function SummaryCard({ label, value, hint, trend = 'neutral' }: SummaryCardProps) {
  const trendClass =
    trend === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'negative'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-[var(--color-muted)]'

  return (
    <div
      className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-6 shadow-[var(--shadow-card)] ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/20 hover:shadow-[var(--shadow-card-hover)] hover:ring-sky-500/10 dark:ring-white/[0.04] dark:hover:border-sky-400/25"
      role="region"
      aria-label={label}
    >
      <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)] md:text-3xl">
        {value}
      </p>
      {hint && <p className={`mt-2 text-sm ${trendClass}`}>{hint}</p>}
    </div>
  )
}

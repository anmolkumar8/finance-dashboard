import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DashboardCharts } from '../components/DashboardCharts'
import { EmptyState } from '../components/EmptyState'
import { SummaryCard } from '../components/SummaryCard'
import { useFinance } from '../context/useFinance'
import { buildDashboardInsights } from '../utils/dashboardInsights'
import {
  balanceOverTime,
  categoryExpenseTotals,
  currentBalance,
  totalExpenses,
  totalIncome,
} from '../utils/aggregations'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDisplayDate, formatMonthLabel } from '../utils/formatDate'
import { displayGreetingName, greetingForTime } from '../utils/greeting'

function toneClasses(tone: 'highlight' | 'neutral' | 'soft'): string {
  switch (tone) {
    case 'highlight':
      return 'border-teal-500/25 bg-teal-500/[0.07] dark:border-teal-400/30 dark:bg-teal-400/[0.08]'
    case 'soft':
      return 'border-amber-500/20 bg-amber-500/[0.06] dark:border-amber-400/25 dark:bg-amber-400/[0.07]'
    default:
      return 'border-[var(--color-border)] bg-[var(--color-surface)]'
  }
}

function toneDot(tone: 'highlight' | 'neutral' | 'soft'): string {
  switch (tone) {
    case 'highlight':
      return 'bg-teal-500 dark:bg-teal-400'
    case 'soft':
      return 'bg-amber-500 dark:bg-amber-400'
    default:
      return 'bg-slate-400 dark:bg-slate-500'
  }
}

export function DashboardPage() {
  const { transactions, isAdmin, profile } = useFinance()

  const balance = currentBalance(transactions)
  const income = totalIncome(transactions)
  const expenses = totalExpenses(transactions)
  const lineData = balanceOverTime(transactions)
  const pieData = categoryExpenseTotals(transactions)

  const insights = useMemo(
    () => buildDashboardInsights(transactions, isAdmin, formatMonthLabel),
    [transactions, isAdmin],
  )

  const firstName = displayGreetingName(profile.displayName)
  const greet = greetingForTime()

  const { minBalance, maxBalance } = useMemo(() => {
    const balances = lineData.map((d) => d.balance)
    if (balances.length === 0) return { minBalance: 0, maxBalance: 0 }
    return { minBalance: Math.min(...balances), maxBalance: Math.max(...balances) }
  }, [lineData])

  /** Full data fingerprint — insights block remounts when any transaction field changes */
  const insightsDataKey = useMemo(() => {
    if (transactions.length === 0) return 'empty'
    return transactions
      .map((t) => `${t.id}:${t.date}:${t.amount}:${t.type}:${t.category}`)
      .sort()
      .join('|')
  }, [transactions])

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        {isAdmin ? (
          <>
            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
              {greet}
              {profile.displayName.trim() ? `, ${firstName}` : ''}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] md:text-3xl">
                  {profile.workspaceLabel.trim() || 'Workspace overview'}
                </h1>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
                  Balances, trends, and categories — edit entries any time from Activity.
                </p>
              </div>
              <Link
                to="/transactions"
                className="interactive-press inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-sky-500/30 dark:from-sky-500 dark:to-indigo-500"
              >
                Add or edit transactions
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {greet}, {firstName}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] md:text-3xl">
              Your financial snapshot
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
              This is a calm, read-only view of balances and spending. Names you save in the sidebar
              stay on this device only.
            </p>
          </>
        )}
      </header>

      {transactions.length === 0 ? (
        <EmptyState
          title={isAdmin ? 'No activity yet' : 'Nothing to show yet'}
          description={
            isAdmin
              ? 'Add a transaction from Activity, or use Sync if you are restoring saved data.'
              : 'When an administrator adds transactions, charts and totals will show up here for you automatically.'
          }
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="animate-enter" style={{ animationDelay: '0ms' }}>
              <SummaryCard
                label="Total balance"
                value={formatCurrency(balance)}
                hint={balance >= 0 ? 'Net positive' : 'Below zero'}
                trend={balance >= 0 ? 'positive' : 'negative'}
              />
            </div>
            <div className="animate-enter" style={{ animationDelay: '60ms' }}>
              <SummaryCard
                label="Total income"
                value={formatCurrency(income)}
                hint={isAdmin ? 'Recorded inflows' : 'Money in'}
                trend="positive"
              />
            </div>
            <div className="animate-enter sm:col-span-2 lg:col-span-1" style={{ animationDelay: '120ms' }}>
              <SummaryCard
                label="Total expenses"
                value={formatCurrency(expenses)}
                hint={isAdmin ? 'Recorded outflows' : 'Money out'}
                trend="negative"
              />
            </div>
          </section>

          <DashboardCharts
            lineData={lineData}
            pieData={pieData}
            minBalance={minBalance}
            maxBalance={maxBalance}
          />

          <section
            key={insightsDataKey}
            className="animate-enter rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-6 shadow-[var(--shadow-card)] ring-1 ring-black/[0.02] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] dark:ring-white/[0.04]"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-ink)]">
                  {isAdmin ? 'Insights' : 'What we notice'}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {isAdmin
                    ? 'Plain-language takeaways from your current data'
                    : 'Short observations based on the numbers — viewing only'}
                </p>
              </div>
              {insights.asOfDate && (
                <p className="text-xs font-medium tabular-nums text-[var(--color-muted)] sm:text-right">
                  As of {formatDisplayDate(insights.asOfDate)}
                  <span className="mx-1.5 text-[var(--color-border)]">·</span>
                  {transactions.length} transaction{transactions.length === 1 ? '' : 's'}
                </p>
              )}
            </div>

            <ul className="mt-6 space-y-3">
              {insights.topCategory && (
                <li
                  key={`cat-${insights.topCategory.name}-${insights.topCategory.amount}`}
                  className={`flex gap-3 rounded-xl border px-4 py-3 text-sm text-[var(--color-ink)] transition-all duration-300 ${toneClasses('highlight')}`}
                >
                  <span
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${toneDot('highlight')}`}
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium">Highest spending category:</span>{' '}
                    {insights.topCategory.name} ({formatCurrency(insights.topCategory.amount)})
                  </span>
                </li>
              )}

              {insights.showMonthCompare && (
                <li
                  key={`month-${insights.currentSpend}-${insights.previousSpend}-${insights.monthLabelCurrent}`}
                  className={`flex gap-3 rounded-xl border px-4 py-3 text-sm text-[var(--color-ink)] transition-all duration-300 ${toneClasses('neutral')}`}
                >
                  <span
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium">Monthly comparison:</span>{' '}
                    {insights.monthLabelCurrent} spent {formatCurrency(insights.currentSpend)} vs{' '}
                    {insights.monthLabelPrevious} {formatCurrency(insights.previousSpend)}.
                  </span>
                </li>
              )}

              {insights.lines.map((line) => (
                <li
                  key={line.id}
                  className={`flex gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300 ${toneClasses(line.tone)} ${
                    line.tone === 'neutral' ? 'text-[var(--color-muted)]' : 'text-[var(--color-ink)]'
                  }`}
                >
                  <span
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${toneDot(line.tone)}`}
                    aria-hidden
                  />
                  <span>{line.body}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}

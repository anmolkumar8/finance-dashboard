import type { Transaction } from '../types'
import {
  currentBalance,
  highestSpendingCategory,
  monthlyExpenseComparison,
  totalExpenses,
  totalIncome,
} from './aggregations'

export type InsightTone = 'highlight' | 'neutral' | 'soft'

export interface InsightLine {
  /** Stable key so list updates correctly when amounts change */
  id: string
  tone: InsightTone
  body: string
}

export interface BuiltInsights {
  /** ISO date of newest transaction — surfaces “as of” freshness */
  asOfDate: string | null
  topCategory: { name: string; amount: number } | null
  showMonthCompare: boolean
  monthLabelCurrent: string
  monthLabelPrevious: string
  currentSpend: number
  previousSpend: number
  lines: InsightLine[]
}

function monthSpendHasActivity(current: number, previous: number): boolean {
  return current > 0 || previous > 0
}

/**
 * All insights derived only from `transactions` (+ role for copy). Recomputes whenever data changes.
 */
export function buildDashboardInsights(
  transactions: Transaction[],
  isAdmin: boolean,
  formatMonth: (ym: string) => string,
): BuiltInsights {
  const balance = currentBalance(transactions)
  const income = totalIncome(transactions)
  const expenses = totalExpenses(transactions)
  const topCategory = highestSpendingCategory(transactions)
  const monthCmp = monthlyExpenseComparison(transactions)

  const asOfDate =
    transactions.length === 0
      ? null
      : transactions.reduce((acc, t) => (t.date > acc ? t.date : acc), transactions[0].date)

  const showMonthCompare =
    monthCmp !== null &&
    monthSpendHasActivity(monthCmp.currentSpend, monthCmp.previousSpend)

  const monthLabelCurrent = monthCmp ? formatMonth(monthCmp.currentMonth) : ''
  const monthLabelPrevious = monthCmp ? formatMonth(monthCmp.previousMonth) : ''

  const lines: InsightLine[] = []

  if (monthCmp && showMonthCompare && monthCmp.deltaPercent !== null) {
    const pct = Math.abs(Math.round(monthCmp.deltaPercent))
    if (monthCmp.deltaPercent < 0) {
      lines.push({
        id: 'mom-spend-down',
        tone: 'highlight',
        body: `${monthLabelCurrent} spending is down about ${pct}% vs ${monthLabelPrevious} — nice momentum.`,
      })
    } else if (monthCmp.deltaPercent > 0) {
      lines.push({
        id: 'mom-spend-up',
        tone: 'soft',
        body: `${monthLabelCurrent} spending is up about ${pct}% vs ${monthLabelPrevious} — worth a quick look at categories.`,
      })
    } else {
      lines.push({
        id: 'mom-spend-flat',
        tone: 'neutral',
        body: `Spending in ${monthLabelCurrent} is about the same as ${monthLabelPrevious} (within rounding).`,
      })
    }
  }

  if (balance < 0) {
    lines.push({
      id: 'balance-negative',
      tone: 'soft',
      body: 'Balance is below zero — trimming discretionary spend or shifting bill timing could help.',
    })
  } else if (income > 0 && expenses / income < 0.5) {
    lines.push({
      id: 'buffer-strong',
      tone: 'highlight',
      body: 'Expenses are well under half of income — you have a comfortable buffer for savings or goals.',
    })
  }

  if (!topCategory && transactions.length > 0 && isAdmin) {
    lines.push({
      id: 'need-expenses-admin',
      tone: 'neutral',
      body: 'Add a few expense entries across categories to unlock richer comparisons and pie breakdowns.',
    })
  }

  if (!topCategory && transactions.length > 0 && !isAdmin) {
    lines.push({
      id: 'need-expenses-member',
      tone: 'neutral',
      body: 'When your team records expenses, category insights will populate here automatically.',
    })
  }

  if (
    topCategory &&
    expenses > 0 &&
    showMonthCompare &&
    monthCmp &&
    monthCmp.currentSpend > 0
  ) {
    const share = Math.round((topCategory.amount / expenses) * 100)
    if (share >= 35) {
      lines.push({
        id: 'category-concentration',
        tone: 'neutral',
        body: `${topCategory.name} represents a large share of all spending (${share}%) — diversification or planning there may matter most.`,
      })
    }
  }

  return {
    asOfDate,
    topCategory,
    showMonthCompare,
    monthLabelCurrent,
    monthLabelPrevious,
    currentSpend: monthCmp?.currentSpend ?? 0,
    previousSpend: monthCmp?.previousSpend ?? 0,
    lines,
  }
}

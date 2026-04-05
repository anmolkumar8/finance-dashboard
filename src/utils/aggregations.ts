import type { Transaction } from '../types'

export interface BalancePoint {
  date: string
  label: string
  balance: number
}

export interface CategorySlice {
  name: string
  value: number
}

function signedAmount(t: Transaction): number {
  return t.type === 'income' ? t.amount : -t.amount
}

/** Cumulative balance after each transaction day (sorted ascending). */
export function balanceOverTime(transactions: Transaction[]): BalancePoint[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  let balance = 0
  const byDay = new Map<string, number>()
  for (const t of sorted) {
    balance += signedAmount(t)
    byDay.set(t.date, balance)
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, bal]) => ({
      date,
      label: date.slice(5),
      balance: bal,
    }))
}

export function categoryExpenseTotals(transactions: Transaction[]): CategorySlice[] {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function totalIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
}

export function totalExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
}

export function currentBalance(transactions: Transaction[]): number {
  return transactions.reduce((s, t) => s + signedAmount(t), 0)
}

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7)
}

export function expenseByMonth(transactions: Transaction[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const k = monthKey(t.date)
    m.set(k, (m.get(k) ?? 0) + t.amount)
  }
  return m
}

export interface MonthlyComparison {
  currentMonth: string
  previousMonth: string
  currentSpend: number
  previousSpend: number
  deltaPercent: number | null
}

/** Uses latest transaction date as "today" anchor for demo-friendly comparison. */
export function monthlyExpenseComparison(transactions: Transaction[]): MonthlyComparison | null {
  if (transactions.length === 0) return null
  const max = transactions.reduce(
    (acc, t) => (t.date > acc ? t.date : acc),
    transactions[0].date,
  )
  const anchor = new Date(max + 'T12:00:00')
  const cur = `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, '0')}`
  const prevDate = new Date(anchor)
  prevDate.setMonth(prevDate.getMonth() - 1)
  const prev = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`

  const byMonth = expenseByMonth(transactions)
  const currentSpend = byMonth.get(cur) ?? 0
  const previousSpend = byMonth.get(prev) ?? 0
  let deltaPercent: number | null = null
  if (previousSpend > 0) {
    deltaPercent = ((currentSpend - previousSpend) / previousSpend) * 100
  } else if (currentSpend > 0) {
    deltaPercent = 100
  }
  return {
    currentMonth: cur,
    previousMonth: prev,
    currentSpend,
    previousSpend,
    deltaPercent,
  }
}

export function highestSpendingCategory(
  transactions: Transaction[],
): { name: string; amount: number } | null {
  const slices = categoryExpenseTotals(transactions)
  if (slices.length === 0) return null
  return { name: slices[0].name, amount: slices[0].value }
}

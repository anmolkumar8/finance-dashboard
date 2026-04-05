import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { TransactionModal } from '../components/TransactionModal'
import { useFinance } from '../context/useFinance'
import type { SortKey, Transaction } from '../types'
import { exportTransactionsCsv, exportTransactionsJson } from '../utils/exportData'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDisplayDate, formatMonthLabel } from '../utils/formatDate'

function sortTransactions(list: Transaction[], key: SortKey): Transaction[] {
  const copy = [...list]
  copy.sort((a, b) => {
    switch (key) {
      case 'date_desc':
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
      case 'date_asc':
        return a.date > b.date ? 1 : a.date < b.date ? -1 : 0
      case 'amount_desc':
        return b.amount - a.amount
      case 'amount_asc':
        return a.amount - b.amount
      default:
        return 0
    }
  })
  return copy
}

function TransactionTableRows({
  rows,
  isAdmin,
  onEdit,
  onDelete,
}: {
  rows: Transaction[]
  isAdmin: boolean
  onEdit: (t: Transaction) => void
  onDelete: (t: Transaction) => void
}) {
  return (
    <>
      {rows.map((t) => (
        <tr
          key={t.id}
          className="border-b border-[var(--color-border)]/80 transition-colors duration-200 last:border-0 hover:bg-[var(--color-surface)]/80"
        >
          <td className="whitespace-nowrap px-4 py-3 text-[var(--color-ink)]">
            {formatDisplayDate(t.date)}
          </td>
          <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-[var(--color-ink)]">
            {t.type === 'expense' ? '−' : '+'}
            {formatCurrency(t.amount)}
          </td>
          <td className="px-4 py-3 text-[var(--color-ink)]">{t.category}</td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                t.type === 'income'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
              }`}
            >
              {t.type === 'income' ? 'Income' : 'Expense'}
            </span>
          </td>
          {isAdmin && (
            <td className="whitespace-nowrap px-4 py-3 text-right">
              <button
                type="button"
                onClick={() => onEdit(t)}
                className="mr-2 rounded-lg px-2 py-1 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this transaction?')) onDelete(t)
                }}
                className="rounded-lg px-2 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
              >
                Delete
              </button>
            </td>
          )}
        </tr>
      ))}
    </>
  )
}

export function TransactionsPage() {
  const {
    transactions,
    isAdmin,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortKey,
    setSortKey,
    groupByMonth,
    setGroupByMonth,
  } = useFinance()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [modalSession, setModalSession] = useState(0)

  function bumpModalSession() {
    setModalSession((s) => s + 1)
  }

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const t of transactions) set.add(t.category)
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [transactions])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = transactions

    if (typeFilter === 'income') list = list.filter((t) => t.type === 'income')
    if (typeFilter === 'expense') list = list.filter((t) => t.type === 'expense')

    const effectiveCategory = isAdmin ? categoryFilter : 'all'
    if (effectiveCategory !== 'all') {
      list = list.filter((t) => t.category === effectiveCategory)
    }

    if (q) {
      list = list.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q) ||
          t.amount.toString().includes(q) ||
          t.date.includes(q),
      )
    }

    const effectiveSort = isAdmin ? sortKey : 'date_desc'
    return sortTransactions(list, effectiveSort)
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortKey, isAdmin])

  const groupedByMonth = useMemo(() => {
    if (!isAdmin || !groupByMonth) return null
    const map = new Map<string, Transaction[]>()
    for (const t of filtered) {
      const k = t.date.slice(0, 7)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(t)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered, groupByMonth, isAdmin])

  function openAdd() {
    bumpModalSession()
    setModalMode('add')
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(t: Transaction) {
    if (!isAdmin) return
    bumpModalSession()
    setModalMode('edit')
    setEditing(t)
    setModalOpen(true)
  }

  const tableHead = (
    <thead>
      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3">Amount</th>
        <th className="px-4 py-3">Category</th>
        <th className="px-4 py-3">Type</th>
        {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
      </tr>
    </thead>
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] md:text-3xl">
            {isAdmin ? 'Transaction ledger' : 'Activity'}
          </h1>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--color-muted)]">
            {isAdmin ? (
              <>
                Search, slice by category, sort, group by month, and export. Everything saves in your
                browser; Sync pulls the mock API snapshot.
              </>
            ) : (
              <>
                Browse what’s been recorded — search and filter by type. Editing, exports, and deep
                filters are reserved for admins.
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => exportTransactionsJson(filtered)}
                className="interactive-press min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition-all duration-200 hover:bg-[var(--color-elevated)] hover:shadow-md"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => exportTransactionsCsv(filtered)}
                className="interactive-press min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition-all duration-200 hover:bg-[var(--color-elevated)] hover:shadow-md"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={openAdd}
                className="interactive-press inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:shadow-xl dark:from-sky-500 dark:to-indigo-500"
              >
                Add transaction
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search category, note, amount, date…"
            className="min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-ink)] shadow-[var(--shadow-card)] outline-none ring-sky-500/20 transition-all placeholder:text-[var(--color-muted)] focus:ring-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="type-filter" className="text-sm font-medium text-[var(--color-muted)]">
              Type
            </label>
            <select
              id="type-filter"
              className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm outline-none ring-sky-500/20 transition-all focus:ring-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {isAdmin && (
            <>
              <div className="flex items-center gap-2">
                <label htmlFor="cat-filter" className="text-sm font-medium text-[var(--color-muted)]">
                  Category
                </label>
                <select
                  id="cat-filter"
                  className="max-w-[10rem] min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm outline-none ring-sky-500/20 transition-all focus:ring-2 sm:max-w-xs"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-key" className="text-sm font-medium text-[var(--color-muted)]">
                  Sort
                </label>
                <select
                  id="sort-key"
                  className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm outline-none ring-sky-500/20 transition-all focus:ring-2"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                >
                  <option value="date_desc">Date (newest)</option>
                  <option value="date_asc">Date (oldest)</option>
                  <option value="amount_desc">Amount (high)</option>
                  <option value="amount_asc">Amount (low)</option>
                </select>
              </div>

              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-transparent px-1 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--color-border)] text-sky-600 focus:ring-sky-500/30"
                  checked={groupByMonth}
                  onChange={(e) => setGroupByMonth(e.target.checked)}
                />
                Group by month
              </label>
            </>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={transactions.length === 0 ? 'No transactions' : 'No matches'}
          description={
            transactions.length === 0
              ? isAdmin
                ? 'Add your first transaction to populate this list.'
                : 'There is nothing to show yet. Switch to Admin to add data.'
              : isAdmin
                ? 'Try adjusting search, type, or category filters.'
                : 'Try a different search or type filter.'
          }
        />
      ) : groupByMonth && groupedByMonth ? (
        <div className="space-y-8">
          {groupedByMonth.map(([month, rows]) => (
            <div
              key={month}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
            >
              <h3 className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
                {formatMonthLabel(month)}
                <span className="ml-2 font-normal text-[var(--color-muted)]">({rows.length})</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  {tableHead}
                  <tbody>
                    <TransactionTableRows
                      rows={rows}
                      isAdmin={isAdmin}
                      onEdit={openEdit}
                      onDelete={(t) => deleteTransaction(t.id)}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              {tableHead}
              <tbody>
                <TransactionTableRows
                  rows={filtered}
                  isAdmin={isAdmin}
                  onEdit={openEdit}
                  onDelete={(t) => deleteTransaction(t.id)}
                />
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        sessionKey={modalSession}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => {
          if (modalMode === 'add') addTransaction(payload)
          else if (editing) updateTransaction(editing.id, payload)
        }}
      />
    </div>
  )
}

import { useState } from 'react'
import type { Transaction, TransactionType } from '../types'

export interface TransactionModalProps {
  open: boolean
  /** Changes when the modal opens so the form remounts with fresh defaults. */
  sessionKey: number
  mode: 'add' | 'edit'
  initial?: Transaction | null
  onClose: () => void
  onSave: (payload: {
    date: string
    amount: number
    category: string
    type: TransactionType
    note?: string
  }) => void
}

const baseEmpty = {
  amount: '',
  category: '',
  type: 'expense' as TransactionType,
  note: '',
}

function initialFormState(mode: 'add' | 'edit', initial?: Transaction | null) {
  if (mode === 'edit' && initial) {
    return {
      date: initial.date,
      amount: String(initial.amount),
      category: initial.category,
      type: initial.type,
      note: initial.note ?? '',
    }
  }
  return {
    date: new Date().toISOString().slice(0, 10),
    ...baseEmpty,
  }
}

function TransactionModalBody({
  mode,
  initial,
  onClose,
  onSave,
}: Omit<TransactionModalProps, 'open' | 'sessionKey'>) {
  const [form, setForm] = useState(() => initialFormState(mode, initial))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = Number.parseFloat(form.amount)
    if (!form.category.trim() || Number.isNaN(amount) || amount <= 0) return
    onSave({
      date: form.date,
      amount,
      category: form.category.trim(),
      type: form.type,
      note: form.note.trim() || undefined,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-6 shadow-[var(--shadow-card-hover)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="tx-modal-title" className="text-lg font-semibold text-[var(--color-ink)]">
          {mode === 'add' ? 'Add transaction' : 'Edit transaction'}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]" htmlFor="tx-date">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none ring-sky-500/30 transition-shadow focus:ring-2"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-[var(--color-muted)]"
              htmlFor="tx-amount"
            >
              Amount
            </label>
            <input
              id="tx-amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none ring-sky-500/30 transition-shadow focus:ring-2"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-[var(--color-muted)]"
              htmlFor="tx-category"
            >
              Category
            </label>
            <input
              id="tx-category"
              type="text"
              required
              placeholder="e.g. Groceries"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none ring-sky-500/30 transition-shadow focus:ring-2"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-[var(--color-muted)]">Type</span>
            <div className="mt-2 flex gap-2">
              {(['income', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-all ${
                    form.type === t
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]" htmlFor="tx-note">
              Note (optional)
            </label>
            <input
              id="tx-note"
              type="text"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none ring-sky-500/30 transition-shadow focus:ring-2"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function TransactionModal({ open, sessionKey, ...rest }: TransactionModalProps) {
  if (!open) return null
  return <TransactionModalBody key={sessionKey} {...rest} />
}

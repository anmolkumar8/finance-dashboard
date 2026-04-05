import { STORAGE_KEYS } from '../constants/storage'
import { seedTransactions } from '../data/seedTransactions'
import type { Transaction } from '../types'

function isTransaction(x: unknown): x is Transaction {
  if (x === null || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.date === 'string' &&
    typeof o.amount === 'number' &&
    typeof o.category === 'string' &&
    (o.type === 'income' || o.type === 'expense')
  )
}

/** Synchronous hydrate for first paint (no empty flash when data exists). */
export function readStoredTransactions(): Transaction[] | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.transactions)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data) || data.length === 0) return null
    const valid = data.filter(isTransaction)
    return valid.length > 0 ? valid : null
  } catch {
    return null
  }
}

export function getInitialTransactions(): Transaction[] {
  return readStoredTransactions() ?? [...seedTransactions]
}

import { seedTransactions } from '../data/seedTransactions'
import { STORAGE_KEYS } from '../constants/storage'
import type { Transaction } from '../types'

const DEFAULT_LATENCY_MS = 480

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function parseStored(): Transaction[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.transactions)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return null
    return data as Transaction[]
  } catch {
    return null
  }
}

/**
 * Simulates GET /transactions — delayed read from the same store the app persists to.
 */
export async function mockFetchTransactions(latencyMs = DEFAULT_LATENCY_MS): Promise<Transaction[]> {
  await delay(latencyMs)
  const stored = parseStored()
  if (stored && stored.length > 0) {
    return structuredClone(stored)
  }
  return structuredClone(seedTransactions)
}

import type { Transaction } from '../types'

/** Deterministic IDs for stable hydration in dev (StrictMode). */
function id(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return `tx-${Math.abs(h).toString(16)}`
}

/** Sample amounts in INR (whole rupees) for a realistic India demo. */
export const seedTransactions: Transaction[] = [
  {
    id: id('1'),
    date: '2026-03-02',
    amount: 485000,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: id('2'),
    date: '2026-03-05',
    amount: 165000,
    category: 'Rent',
    type: 'expense',
  },
  {
    id: id('3'),
    date: '2026-03-08',
    amount: 32000,
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: id('4'),
    date: '2026-03-12',
    amount: 7200,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: id('5'),
    date: '2026-03-15',
    amount: 92000,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: id('6'),
    date: '2026-03-18',
    amount: 18500,
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: id('7'),
    date: '2026-03-22',
    amount: 28500,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: id('8'),
    date: '2026-03-28',
    amount: 12500,
    category: 'Dining',
    type: 'expense',
  },
  {
    id: id('9'),
    date: '2026-04-01',
    amount: 485000,
    category: 'Salary',
    type: 'income',
  },
  {
    id: id('10'),
    date: '2026-04-03',
    amount: 165000,
    category: 'Rent',
    type: 'expense',
  },
  {
    id: id('11'),
    date: '2026-04-04',
    amount: 7800,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: id('12'),
    date: '2026-04-05',
    amount: 26000,
    category: 'Groceries',
    type: 'expense',
  },
]

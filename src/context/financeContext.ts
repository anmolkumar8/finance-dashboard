import { createContext } from 'react'
import type {
  SortKey,
  ThemeMode,
  Transaction,
  TransactionType,
  TypeFilter,
  UserProfile,
  UserRole,
} from '../types'

export interface TransactionInput {
  date: string
  amount: number
  category: string
  type: TransactionType
  note?: string
}

export interface FinanceContextValue {
  transactions: Transaction[]
  role: UserRole
  setRole: (role: UserRole) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  typeFilter: TypeFilter
  setTypeFilter: (f: TypeFilter) => void
  categoryFilter: string
  setCategoryFilter: (c: string) => void
  sortKey: SortKey
  setSortKey: (s: SortKey) => void
  groupByMonth: boolean
  setGroupByMonth: (v: boolean) => void
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  toggleTheme: () => void
  isDark: boolean
  isRefreshing: boolean
  refreshFromMockApi: () => Promise<void>
  addTransaction: (input: TransactionInput) => void
  updateTransaction: (id: string, input: TransactionInput) => void
  deleteTransaction: (id: string) => void
  isAdmin: boolean
  profile: UserProfile
  updateProfile: (patch: Partial<UserProfile>) => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)

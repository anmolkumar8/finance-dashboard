import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { mockFetchTransactions } from '../api/mockFinanceApi'
import { STORAGE_KEYS } from '../constants/storage'
import { readStoredProfile } from '../utils/readStoredProfile'
import { getInitialTransactions } from '../utils/readStoredTransactions'
import type { SortKey, ThemeMode, Transaction, UserProfile, UserRole } from '../types'
import { FinanceContext, type FinanceContextValue, type TransactionInput } from './financeContext'

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readThemeFromStorage(): ThemeMode {
  if (typeof localStorage === 'undefined') return 'light'
  return localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light'
}

function readRoleFromStorage(): UserRole {
  if (typeof localStorage === 'undefined') return 'admin'
  const r = localStorage.getItem(STORAGE_KEYS.role)
  return r === 'viewer' ? 'viewer' : 'admin'
}

function applyThemeClass(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => getInitialTransactions())
  const [role, setRoleState] = useState<UserRole>(() => readRoleFromStorage())
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<FinanceContextValue['typeFilter']>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date_desc')
  const [groupByMonth, setGroupByMonth] = useState(false)
  const [theme, setThemeState] = useState<ThemeMode>(() => readThemeFromStorage())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(() => readStoredProfile())

  useLayoutEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.role, role)
  }, [role])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
    } catch {
      /* quota or private mode */
    }
  }, [transactions])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
    } catch {
      /* ignore */
    }
  }, [profile])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r)
  }, [])

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const addTransaction = useCallback((input: TransactionInput) => {
    setTransactions((prev) => [
      {
        id: newId(),
        ...input,
      },
      ...prev,
    ])
  }, [])

  const updateTransaction = useCallback((id: string, input: TransactionInput) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...input } : t)),
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const refreshFromMockApi = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const next = await mockFetchTransactions()
      setTransactions(next)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      role,
      setRole,
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
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'dark',
      isRefreshing,
      refreshFromMockApi,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      isAdmin: role === 'admin',
      profile,
      updateProfile,
    }),
    [
      transactions,
      role,
      setRole,
      searchQuery,
      typeFilter,
      categoryFilter,
      sortKey,
      groupByMonth,
      theme,
      setTheme,
      toggleTheme,
      isRefreshing,
      refreshFromMockApi,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      profile,
      updateProfile,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

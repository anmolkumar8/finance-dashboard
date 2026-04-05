export type TransactionType = 'income' | 'expense'

export type UserRole = 'viewer' | 'admin'

export type TypeFilter = 'all' | 'income' | 'expense'

export type ThemeMode = 'light' | 'dark'

/** Transactions table ordering */
export type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'

/** Stored in localStorage — personalizes the app for this browser */
export interface UserProfile {
  displayName: string
  /** Optional label for admins (e.g. business or workspace name) */
  workspaceLabel: string
}

export const defaultUserProfile: UserProfile = {
  displayName: '',
  workspaceLabel: '',
}

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  note?: string
}

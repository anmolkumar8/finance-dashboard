/** Single source of truth for persisted keys (localStorage + mock API reads). */
export const STORAGE_KEYS = {
  transactions: 'atlas-finance-transactions-v1',
  theme: 'atlas-finance-theme',
  role: 'atlas-finance-role',
  profile: 'atlas-finance-profile-v1',
} as const

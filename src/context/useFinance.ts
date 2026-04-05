import { useContext } from 'react'
import { FinanceContext, type FinanceContextValue } from './financeContext'

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext)
  if (!ctx) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return ctx
}

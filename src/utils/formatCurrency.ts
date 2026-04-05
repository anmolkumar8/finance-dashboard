/** App default: Indian Rupees (amounts in data are stored as numbers in this currency). */
export const APP_CURRENCY = 'INR' as const
export const APP_LOCALE = 'en-IN' as const

export function formatCurrency(
  value: number,
  currency: string = APP_CURRENCY,
  locale: string = APP_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value)
}

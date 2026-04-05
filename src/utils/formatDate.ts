export function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00')
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/** `yyyy-mm` → "April 2026" */
export function formatMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  if (!y || !m) return yearMonth
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
    new Date(y, m - 1, 1),
  )
}

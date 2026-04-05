import type { Transaction } from '../types'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportTransactionsJson(transactions: Transaction[], filename = 'transactions.json') {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], {
    type: 'application/json',
  })
  triggerDownload(blob, filename)
}

function csvEscape(value: string | number | undefined): string {
  const s = value === undefined || value === null ? '' : String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function exportTransactionsCsv(transactions: Transaction[], filename = 'transactions.csv') {
  const headers = ['id', 'date', 'amount', 'category', 'type', 'note'] as const
  const lines = [
    headers.join(','),
    ...transactions.map((t) =>
      [
        csvEscape(t.id),
        csvEscape(t.date),
        csvEscape(t.amount),
        csvEscape(t.category),
        csvEscape(t.type),
        csvEscape(t.note ?? ''),
      ].join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  triggerDownload(blob, filename)
}

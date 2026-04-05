import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-elevated)] px-8 py-16 text-center transition-colors">
      {icon && <div className="mb-4 text-[var(--color-muted)]">{icon}</div>}
      <h3 className="text-lg font-medium text-[var(--color-ink)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">{description}</p>
    </div>
  )
}

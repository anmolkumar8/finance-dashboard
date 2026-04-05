import { useFinance } from '../context/useFinance'
import type { UserRole } from '../types'

const options: { value: UserRole; label: string; description: string }[] = [
  { value: 'viewer', label: 'Member', description: 'View balances and activity only' },
  { value: 'admin', label: 'Admin', description: 'Manage transactions, sync, and exports' },
]

export function RoleToggle() {
  const { role, setRole } = useFinance()

  return (
    <div
      className="flex w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-1 shadow-inner dark:bg-black/20"
      role="group"
      aria-label="Role"
    >
      {options.map((opt) => {
        const active = role === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setRole(opt.value)}
            className={`relative flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              active
                ? 'bg-[var(--color-elevated)] text-[var(--color-ink)] shadow-md ring-1 ring-sky-500/20 dark:ring-sky-400/25'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
            title={opt.description}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

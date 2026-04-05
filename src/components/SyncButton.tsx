import { useFinance } from '../context/useFinance'

type SyncButtonProps = {
  variant?: 'default' | 'icon'
}

export function SyncButton({ variant = 'default' }: SyncButtonProps) {
  const { refreshFromMockApi, isRefreshing } = useFinance()

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => void refreshFromMockApi()}
        disabled={isRefreshing}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-ink)] shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-md hover:shadow-emerald-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--color-border)] disabled:hover:bg-[var(--color-elevated)] disabled:hover:shadow-sm dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/10"
        title="Sync data (mock API)"
        aria-label={isRefreshing ? 'Syncing data' : 'Sync data from server'}
      >
        <svg
          className={`h-[18px] w-[18px] ${isRefreshing ? 'animate-spin' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => void refreshFromMockApi()}
      disabled={isRefreshing}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm font-medium text-[var(--color-ink)] shadow-sm transition-all duration-200 hover:border-emerald-500/35 hover:shadow-md enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      title="Simulated API: reloads transactions from mock server (localStorage)"
    >
      <svg
        className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>{isRefreshing ? 'Syncing…' : 'Sync'}</span>
    </button>
  )
}

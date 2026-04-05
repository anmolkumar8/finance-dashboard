import { NavLink, Outlet } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { ProfilePanel } from './ProfilePanel'
import { RoleToggle } from './RoleToggle'
import { SyncButton } from './SyncButton'
import { ThemeToggle } from './ThemeToggle'
import { useFinance } from '../context/useFinance'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.99] ${
    isActive
      ? 'bg-gradient-to-r from-sky-500/15 to-indigo-500/10 text-sky-800 shadow-sm ring-1 ring-sky-500/20 dark:from-sky-400/15 dark:to-indigo-400/10 dark:text-sky-100 dark:ring-sky-400/25'
      : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] dark:hover:bg-white/5'
  }`

function NavIcon({ to }: { to: 'home' | 'tx' }) {
  if (to === 'home') {
    return (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)] text-sky-600 transition-colors group-hover:bg-sky-500/10 dark:bg-white/5 dark:text-sky-400"
        aria-hidden
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </span>
    )
  }
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)] text-indigo-600 transition-colors group-hover:bg-indigo-500/10 dark:bg-white/5 dark:text-indigo-400"
      aria-hidden
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </span>
  )
}

function QuickActionsToolbar({
  isAdmin,
  className = '',
}: {
  isAdmin: boolean
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="toolbar"
      aria-label="Display and data"
    >
      <ThemeToggle variant="icon" />
      {isAdmin && <SyncButton variant="icon" />}
    </div>
  )
}

function LayoutShell() {
  const { isAdmin, profile } = useFinance()

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="pt-safe-top sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo size={40} />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-[0.12em] text-sky-600 dark:text-sky-400">
              Atlas
            </p>
            <p className="truncate text-base font-bold text-[var(--color-ink)]">Finance</p>
          </div>
        </div>
        <QuickActionsToolbar isAdmin={isAdmin} />
      </header>

      <aside className="relative flex w-full flex-col border-b border-[var(--color-border)] bg-[var(--color-elevated)] md:min-h-svh md:w-[17.5rem] md:shrink-0 md:border-b-0 md:border-r md:px-5 md:py-8">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/[0.06] via-transparent to-indigo-500/[0.04] dark:from-sky-400/[0.07] dark:to-indigo-500/[0.05]"
          aria-hidden
        />

        <div className="relative flex flex-1 flex-col gap-6 md:gap-8">
          {/* Desktop brand */}
          <div className="hidden px-0 md:block">
            <div className="flex items-start gap-3">
              <BrandLogo size={44} title="Atlas Finance logo" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400">
                    Atlas
                  </p>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      isAdmin
                        ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-200'
                        : 'bg-slate-500/12 text-slate-600 dark:bg-slate-400/20 dark:text-slate-300'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Member'}
                  </span>
                </div>
                <p className="text-xl font-bold tracking-tight text-[var(--color-ink)]">Finance</p>
                {isAdmin && profile.workspaceLabel.trim() ? (
                  <p className="mt-1 truncate text-xs font-medium text-[var(--color-muted)]">
                    {profile.workspaceLabel.trim()}
                  </p>
                ) : (
                  <p className="mt-1 text-xs leading-snug text-[var(--color-muted)]">
                    {isAdmin ? 'Manage books & entries' : 'Read-only snapshot'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <nav
            className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Main"
          >
            <NavLink to="/" end className={navLinkClass}>
              <NavIcon to="home" />
              {isAdmin ? 'Overview' : 'Home'}
            </NavLink>
            <NavLink to="/transactions" className={navLinkClass}>
              <NavIcon to="tx" />
              {isAdmin ? 'Transactions' : 'Activity'}
            </NavLink>
          </nav>

          <div className="hidden flex-1 md:block" aria-hidden />

          <div className="flex flex-col gap-5 border-t border-[var(--color-border)]/80 bg-[var(--color-surface)]/50 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:bg-black/15 md:mt-0 md:border-t-0 md:bg-transparent md:px-0 md:py-0 md:pb-0 dark:md:bg-transparent">
            <ProfilePanel />

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                Switch role
              </p>
              <RoleToggle />
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-muted)]">
                {isAdmin
                  ? 'Full edit access, sync, and exports on the ledger.'
                  : 'Read balances and activity — no edits or exports.'}
              </p>
            </div>

            <div className="hidden md:block">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                {isAdmin ? 'Appearance & sync' : 'Appearance'}
              </p>
              <QuickActionsToolbar isAdmin={isAdmin} />
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                {isAdmin
                  ? 'Theme · Sync reloads data (mock API).'
                  : 'Theme only — sync is available to admins.'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-sheen relative flex-1 overflow-x-hidden px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-10 md:py-10 lg:px-14">
        <div className="relative mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function Layout() {
  return <LayoutShell />
}

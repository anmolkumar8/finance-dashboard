import { useRef, useState } from 'react'
import { useFinance } from '../context/useFinance'

/**
 * Captures display name (+ workspace for admins), persists via FinanceProvider → localStorage.
 */
export function ProfilePanel() {
  const { profile, updateProfile, isAdmin } = useFinance()
  const [name, setName] = useState(profile.displayName)
  const [workspace, setWorkspace] = useState(profile.workspaceLabel)
  const [saved, setSaved] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function flashSaved() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSaved(true)
    timerRef.current = setTimeout(() => setSaved(false), 2200)
  }

  function commitName() {
    const next = name.trim().slice(0, 80)
    if (next !== profile.displayName) {
      updateProfile({ displayName: next })
      flashSaved()
    }
  }

  function commitWorkspace() {
    const next = workspace.trim().slice(0, 80)
    if (next !== profile.workspaceLabel) {
      updateProfile({ workspaceLabel: next })
      flashSaved()
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)]/90 p-4 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm transition-shadow duration-300 focus-within:shadow-md focus-within:ring-sky-500/15 dark:bg-[var(--color-elevated)]/80 dark:ring-white/[0.06]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {isAdmin ? 'Your workspace' : 'Your profile'}
        </p>
        {saved && (
          <span className="animate-enter text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Saved locally
          </span>
        )}
      </div>

      <label className="block text-xs font-medium text-[var(--color-muted)]" htmlFor="profile-display-name">
        {isAdmin ? 'Name (shown on dashboard)' : 'Preferred name'}
      </label>
      <input
        id="profile-display-name"
        type="text"
        autoComplete="name"
        placeholder={isAdmin ? 'e.g. Jordan Lee' : 'e.g. Sam'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        className="mt-1.5 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] shadow-inner outline-none transition-all duration-200 placeholder:text-[var(--color-muted)] focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:focus:border-sky-400/40"
      />

      {isAdmin && (
        <>
          <label
            className="mt-3 block text-xs font-medium text-[var(--color-muted)]"
            htmlFor="profile-workspace"
          >
            Workspace or business label
          </label>
          <input
            id="profile-workspace"
            type="text"
            autoComplete="organization"
            placeholder="e.g. Studio North LLC"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            onBlur={commitWorkspace}
            className="mt-1.5 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] shadow-inner outline-none transition-all duration-200 placeholder:text-[var(--color-muted)] focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:border-indigo-400/40"
          />
        </>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-muted)]">
        Stored in your browser only — not sent to a server.
      </p>
    </div>
  )
}

import { STORAGE_KEYS } from '../constants/storage'
import { defaultUserProfile, type UserProfile } from '../types'

export function readStoredProfile(): UserProfile {
  if (typeof localStorage === 'undefined') return { ...defaultUserProfile }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profile)
    if (!raw) return { ...defaultUserProfile }
    const p = JSON.parse(raw) as Record<string, unknown>
    return {
      displayName: typeof p.displayName === 'string' ? p.displayName.slice(0, 80) : '',
      workspaceLabel:
        typeof p.workspaceLabel === 'string' ? p.workspaceLabel.slice(0, 80) : '',
    }
  } catch {
    return { ...defaultUserProfile }
  }
}

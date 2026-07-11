import { useEffect, useMemo, useState } from 'react'
import type { AppState, HeaderDirection, HeaderRule, Profile, RedirectRule } from '../../shared/types'
import { loadState, saveState } from '../../shared/storage'
import { createDefaultProfile } from '../../shared/defaults'
import { uniqueProfileName } from '../../shared/transfer'

export type AppActions = {
  toggleGlobal: (on: boolean) => void
  selectProfile: (id: string) => void
  addProfile: () => void
  renameProfile: (id: string, name: string) => void
  removeProfile: (id: string) => void
  importProfile: (profile: Profile) => void
  addHeaderRule: (direction: HeaderDirection) => string
  updateHeaderRule: (id: string, patch: Partial<Omit<HeaderRule, 'id'>>) => void
  removeHeaderRule: (id: string) => void
  addRedirectRule: () => string
  updateRedirectRule: (id: string, patch: Partial<Omit<RedirectRule, 'id'>>) => void
  removeRedirectRule: (id: string) => void
}

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null)

  useEffect(() => {
    void loadState().then(setState)
  }, [])

  // 낙관적 업데이트: 로컬 상태 즉시 반영 후 storage에 저장.
  // 팝업은 수명이 짧아 외부 변경 경합이 없으므로 state 재구독은 하지 않는다 (스펙 §useAppState).
  const actions = useMemo<AppActions>(() => {
    const update = (updater: (prev: AppState) => AppState) => {
      setState((prev) => {
        if (!prev) return prev
        const next = updater(prev)
        void saveState(next)
        return next
      })
    }

    const mutateActive = (fn: (p: Profile) => Profile) => {
      update((prev) => ({
        ...prev,
        profiles: prev.profiles.map((p) => (p.id === prev.activeProfileId ? fn(p) : p)),
      }))
    }

    return {
      toggleGlobal: (on) => update((prev) => ({ ...prev, globalEnabled: on })),

      selectProfile: (id) => update((prev) => ({ ...prev, activeProfileId: id })),

      addProfile: () =>
        update((prev) => {
          const profile = createDefaultProfile(`Profile ${prev.profiles.length + 1}`)
          return { ...prev, profiles: [...prev.profiles, profile], activeProfileId: profile.id }
        }),

      renameProfile: (id, name) =>
        update((prev) => ({
          ...prev,
          profiles: prev.profiles.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      removeProfile: (id) =>
        update((prev) => {
          if (prev.profiles.length <= 1) return prev
          const profiles = prev.profiles.filter((p) => p.id !== id)
          return {
            ...prev,
            profiles,
            activeProfileId: prev.activeProfileId === id ? profiles[0].id : prev.activeProfileId,
          }
        }),

      importProfile: (profile) =>
        update((prev) => {
          const named = {
            ...profile,
            name: uniqueProfileName(profile.name, prev.profiles.map((p) => p.name)),
          }
          return { ...prev, profiles: [...prev.profiles, named], activeProfileId: named.id }
        }),

      addHeaderRule: (direction) => {
        const id = crypto.randomUUID()
        mutateActive((p) => ({
          ...p,
          headerRules: [...p.headerRules, { id, enabled: true, direction, name: '', value: '' }],
        }))
        return id
      },

      updateHeaderRule: (id, patch) =>
        mutateActive((p) => ({
          ...p,
          headerRules: p.headerRules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      removeHeaderRule: (id) =>
        mutateActive((p) => ({ ...p, headerRules: p.headerRules.filter((r) => r.id !== id) })),

      addRedirectRule: () => {
        const id = crypto.randomUUID()
        mutateActive((p) => ({
          ...p,
          redirectRules: [...p.redirectRules, { id, enabled: true, match: '', target: '' }],
        }))
        return id
      },

      updateRedirectRule: (id, patch) =>
        mutateActive((p) => ({
          ...p,
          redirectRules: p.redirectRules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      removeRedirectRule: (id) =>
        mutateActive((p) => ({ ...p, redirectRules: p.redirectRules.filter((r) => r.id !== id) })),
    }
  }, [])

  const activeProfile = state?.profiles.find((p) => p.id === state.activeProfileId) ?? null

  return { state, activeProfile, actions }
}

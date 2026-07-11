import { beforeEach, describe, expect, it } from 'vitest'
import {
  STATE_KEY,
  loadState,
  saveState,
  loadCompileError,
  saveCompileError,
  onCompileErrorChanged,
} from './storage'
import { createDefaultState } from './defaults'

type Changes = Record<string, { newValue?: unknown }>
type Listener = (changes: Changes, area: string) => void

function installFakeChrome() {
  const store: Record<string, unknown> = {}
  const listeners: Listener[] = []
  ;(globalThis as { chrome?: unknown }).chrome = {
    storage: {
      local: {
        get: async (key: string) => ({ [key]: store[key] }),
        set: async (items: Record<string, unknown>) => {
          Object.assign(store, items)
          const changes: Changes = Object.fromEntries(
            Object.entries(items).map(([k, v]) => [k, { newValue: v }]),
          )
          listeners.forEach((l) => l(changes, 'local'))
        },
      },
      onChanged: { addListener: (l: Listener) => listeners.push(l) },
    },
  }
  return { store }
}

describe('storage', () => {
  let store: Record<string, unknown>

  beforeEach(() => {
    store = installFakeChrome().store
  })

  it('빈 storage에서 loadState는 기본 상태를 생성해 저장한다', async () => {
    const state = await loadState()
    expect(state.version).toBe(1)
    expect(state.globalEnabled).toBe(true)
    expect(state.profiles).toHaveLength(1)
    expect(state.profiles[0].name).toBe('Local Dev')
    expect(state.activeProfileId).toBe(state.profiles[0].id)
    expect(store[STATE_KEY]).toEqual(state)
  })

  it('saveState 후 loadState는 저장된 상태를 돌려준다', async () => {
    const state = createDefaultState()
    state.globalEnabled = false
    await saveState(state)
    expect(await loadState()).toEqual(state)
  })

  it('compileError를 저장·조회하고 변경 콜백을 발화한다', async () => {
    const seen: Array<string | null> = []
    onCompileErrorChanged((e) => seen.push(e))
    expect(await loadCompileError()).toBeNull()
    await saveCompileError('boom')
    expect(await loadCompileError()).toBe('boom')
    await saveCompileError(null)
    expect(seen).toEqual(['boom', null])
  })
})

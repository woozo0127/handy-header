import type { AppState } from '../shared/types'
import type { AppActions } from './hooks/useAppState'
import { Toggle } from './components/Toggle'

export function TitleBar({ state, actions }: { state: AppState; actions: AppActions }) {
  const active = state.profiles.find((p) => p.id === state.activeProfileId)
  return (
    <div className="titlebar">
      <div className="titlebar-brand">
        <div className="logo">
          <div className="logo-bar" />
          <div className="logo-bar" />
          <div className="logo-bar" />
        </div>
        <span className="titlebar-name">handy-header</span>
      </div>
      <div className="titlebar-controls">
        <button type="button" className="profile-btn">
          <span className="profile-dot" />
          <span>{active?.name}</span>
          <span className="profile-caret">▾</span>
        </button>
        <Toggle
          on={state.globalEnabled}
          onChange={actions.toggleGlobal}
          size="md"
          title="Enable / disable all rules"
        />
      </div>
    </div>
  )
}

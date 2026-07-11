import type { AppState } from '../shared/types'
import type { AppActions } from './hooks/useAppState'
import { ProfileSelector } from './components/ProfileSelector'
import { Toggle } from './components/Toggle'

export function TitleBar({ state, actions }: { state: AppState; actions: AppActions }) {
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
        <ProfileSelector profiles={state.profiles} activeProfileId={state.activeProfileId} actions={actions} />
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

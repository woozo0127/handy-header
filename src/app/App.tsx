import { useState } from 'react'
import { useAppState } from './hooks/useAppState'
import { TitleBar } from './TitleBar'
import { Tabs, type TabId } from './Tabs'
import { ErrorBanner } from './components/ErrorBanner'
import { HeadersScreen } from './screens/headers/HeadersScreen'

export function App() {
  const { state, activeProfile, actions } = useAppState()
  const [tab, setTab] = useState<TabId>('headers')

  if (!state || !activeProfile) return null

  return (
    <>
      <TitleBar state={state} actions={actions} />
      <Tabs tab={tab} onChange={setTab} />
      <ErrorBanner />
      <main className="panel rl-scroll">
        {tab === 'headers' ? (
          <HeadersScreen profile={activeProfile} actions={actions} />
        ) : (
          <div style={{ padding: 14 }}>Redirect screen (Task 9)</div>
        )}
      </main>
    </>
  )
}

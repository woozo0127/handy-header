import { useState } from 'react';
import { ErrorBanner } from './components/ErrorBanner';
import { type TabId, Tabs } from './components/Tabs';
import { TitleBar } from './components/TitleBar';
import { useAppState } from './hooks/useAppState';
import { HeadersScreen } from './screens/headers/HeadersScreen';
import { RedirectScreen } from './screens/redirect/RedirectScreen';

export function App() {
  const { state, activeProfile, actions } = useAppState();
  const [tab, setTab] = useState<TabId>('headers');

  if (!state || !activeProfile) return null;

  return (
    <>
      <TitleBar state={state} actions={actions} />
      <Tabs tab={tab} onChange={setTab} />
      <ErrorBanner />
      <main className="panel rl-scroll">
        {tab === 'headers' ? (
          <HeadersScreen profile={activeProfile} actions={actions} />
        ) : (
          <RedirectScreen profile={activeProfile} actions={actions} />
        )}
      </main>
    </>
  );
}

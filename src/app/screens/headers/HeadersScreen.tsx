import { useState } from 'react';
import type { Profile } from '../../../shared/types';
import type { AppActions } from '../../hooks/useAppState';
import { HeaderRuleGroup } from './HeaderRuleGroup';

export function HeadersScreen({
  profile,
  actions,
}: {
  profile: Profile;
  actions: AppActions;
}) {
  const [focusId, setFocusId] = useState<string | null>(null);
  return (
    <>
      <HeaderRuleGroup
        label="Request"
        tone="blue"
        rules={profile.headerRules.filter((r) => r.direction === 'request')}
        focusId={focusId}
        actions={actions}
        onAdd={() => setFocusId(actions.addHeaderRule('request'))}
      />
      <HeaderRuleGroup
        label="Response"
        tone="purple"
        rules={profile.headerRules.filter((r) => r.direction === 'response')}
        focusId={focusId}
        actions={actions}
        onAdd={() => setFocusId(actions.addHeaderRule('response'))}
      />
    </>
  );
}

import { useState } from 'react'
import type { Profile } from '../../../shared/types'
import type { AppActions } from '../../hooks/useAppState'
import { RedirectRuleList } from './RedirectRuleList'

export function RedirectScreen({ profile, actions }: { profile: Profile; actions: AppActions }) {
  const [focusId, setFocusId] = useState<string | null>(null)
  return (
    <RedirectRuleList
      rules={profile.redirectRules}
      focusId={focusId}
      actions={actions}
      onAdd={() => setFocusId(actions.addRedirectRule())}
    />
  )
}

import type { RedirectRule } from '../../../shared/types'
import type { AppActions } from '../../hooks/useAppState'
import { RedirectRuleRow } from './RedirectRuleRow'

type Props = { rules: RedirectRule[]; focusId: string | null; actions: AppActions; onAdd: () => void }

export function RedirectRuleList({ rules, focusId, actions, onAdd }: Props) {
  return (
    <>
      {rules.map((rule) => (
        <RedirectRuleRow key={rule.id} rule={rule} autoFocus={rule.id === focusId} actions={actions} />
      ))}
      <button type="button" className="addrow" onClick={onAdd}>
        <span className="addrow-plus">+</span>
        Add redirect
      </button>
    </>
  )
}

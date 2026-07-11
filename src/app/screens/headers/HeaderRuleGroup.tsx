import type { HeaderRule } from '../../../shared/types'
import type { AppActions } from '../../hooks/useAppState'
import { HeaderRuleRow } from './HeaderRuleRow'

type Props = {
  label: 'Request' | 'Response'
  tone: 'blue' | 'purple'
  rules: HeaderRule[]
  focusId: string | null
  actions: AppActions
  onAdd: () => void
}

export function HeaderRuleGroup({ label, tone, rules, focusId, actions, onAdd }: Props) {
  return (
    <div data-sec={label}>
      <div className="sec-head">
        <span className={`sec-label is-${tone}`}>{label}</span>
        <div className="sec-line" />
      </div>
      {rules.map((rule) => (
        <HeaderRuleRow key={rule.id} rule={rule} autoFocus={rule.id === focusId} actions={actions} />
      ))}
      <button type="button" className="addrow" onClick={onAdd}>
        <span className="addrow-plus">+</span>
        Add {label.toLowerCase()} header
      </button>
    </div>
  )
}

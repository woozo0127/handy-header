import type { HeaderRule } from '../../../shared/types';
import { EditableField } from '../../components/EditableField';
import { Toggle } from '../../components/Toggle';
import type { AppActions } from '../../hooks/useAppState';

type Props = { rule: HeaderRule; autoFocus: boolean; actions: AppActions };

export function HeaderRuleRow({ rule, autoFocus, actions }: Props) {
  return (
    <div className={`rule-row${rule.enabled ? '' : ' is-off'}`}>
      <Toggle
        on={rule.enabled}
        onChange={(on) => actions.updateHeaderRule(rule.id, { enabled: on })}
      />
      <EditableField
        className="rule-name mono"
        value={rule.name}
        placeholder="Header-Name"
        autoFocus={autoFocus}
        onCommit={(name) => actions.updateHeaderRule(rule.id, { name })}
      />
      <span className="rule-colon">:</span>
      <EditableField
        className="rule-value mono"
        value={rule.value}
        placeholder="value"
        onCommit={(value) => actions.updateHeaderRule(rule.id, { value })}
      />
      <button
        type="button"
        className="remove"
        title="Remove rule"
        onClick={() => actions.removeHeaderRule(rule.id)}
      >
        ×
      </button>
    </div>
  );
}

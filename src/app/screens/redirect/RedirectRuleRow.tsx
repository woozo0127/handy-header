import type { RedirectRule } from '../../../shared/types';
import { EditableField } from '../../components/EditableField';
import { Toggle } from '../../components/Toggle';
import type { AppActions } from '../../hooks/useAppState';

type Props = { rule: RedirectRule; autoFocus: boolean; actions: AppActions };

export function RedirectRuleRow({ rule, autoFocus, actions }: Props) {
  return (
    <div className={`rule-row redirect-row${rule.enabled ? '' : ' is-off'}`}>
      <Toggle
        on={rule.enabled}
        onChange={(on) => actions.updateRedirectRule(rule.id, { enabled: on })}
      />
      <div className="redirect-fields">
        <EditableField
          className="redirect-match mono"
          value={rule.match}
          placeholder="https://…/*"
          autoFocus={autoFocus}
          onCommit={(match) => actions.updateRedirectRule(rule.id, { match })}
        />
        <div className="redirect-arrow-line">
          <span className="redirect-arrow">→</span>
          <EditableField
            className="redirect-target mono"
            value={rule.target}
            placeholder="http://localhost/*"
            onCommit={(target) =>
              actions.updateRedirectRule(rule.id, { target })
            }
          />
        </div>
      </div>
      <button
        type="button"
        className="remove"
        title="Remove rule"
        onClick={() => actions.removeRedirectRule(rule.id)}
      >
        ×
      </button>
    </div>
  );
}

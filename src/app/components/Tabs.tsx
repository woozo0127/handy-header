export type TabId = 'headers' | 'redirect';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'headers', label: 'Headers' },
  { id: 'redirect', label: 'Redirect' },
];

export function Tabs({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <div className="tabs">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`tab${tab === id ? ' is-active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

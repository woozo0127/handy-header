type ToggleProps = {
  on: boolean;
  onChange: (on: boolean) => void;
  size?: 'md' | 'sm';
  title?: string;
};

export function Toggle({ on, onChange, size = 'sm', title }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      title={title}
      className={`toggle toggle-${size}${on ? ' is-on' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!on);
      }}
    >
      <span className="toggle-knob" />
    </button>
  );
}

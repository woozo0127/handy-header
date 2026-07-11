import { useEffect, useRef } from 'react';

type EditableFieldProps = {
  value: string;
  placeholder: string;
  onCommit: (next: string) => void;
  className?: string;
  autoFocus?: boolean;
};

// contenteditable은 uncontrolled로 다룬다: React가 리렌더로 innerText를 덮으면
// 캐럿이 튀므로, 외부 value가 실제로 달라졌을 때만 ref로 동기화한다 (스펙 §핵심 컴포넌트 계약).
export function EditableField({
  value,
  placeholder,
  onCommit,
  className,
  autoFocus,
}: EditableFieldProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (el && el.textContent !== value) el.textContent = value;
  }, [value]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-ph={placeholder}
      className={className ? `editable ${className}` : 'editable'}
      onBlur={() => {
        if (cancelled.current) {
          cancelled.current = false;
          return;
        }
        onCommit((ref.current?.textContent ?? '').trim());
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          ref.current?.blur();
        }
        if (e.key === 'Escape') {
          cancelled.current = true;
          if (ref.current) ref.current.textContent = value;
          ref.current?.blur();
        }
      }}
    />
  );
}

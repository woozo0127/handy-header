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
    // biome-ignore lint/a11y/useSemanticElements: 내용 길이에 맞춰 폭이 정해져야 해서 <input> 대신 contenteditable을 쓴다
    <span
      ref={ref}
      role="textbox"
      tabIndex={0}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-ph={placeholder}
      className={className ? `editable ${className}` : 'editable'}
      onBlur={() => {
        // overflow가 hidden으로 돌아가도 스크롤 위치는 남아 앞부분이 가려지므로 되돌린다
        if (ref.current) ref.current.scrollLeft = 0;
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

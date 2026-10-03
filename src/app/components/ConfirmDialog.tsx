import { useEffect, useId, useRef } from 'react';

type Props = {
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props) {
  const messageId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // 열리면 포커스를 다이얼로그 안으로 옮겨 Escape가 오버레이에 닿게 한다 — 파괴적 동작이라 Cancel에 둔다
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={messageId}
      tabIndex={-1}
      onClick={(e) => {
        // 오버레이 클릭은 취소 — 전파를 막아 메뉴 닫기 리스너에 닿지 않게 한다
        e.stopPropagation();
        if (e.target === e.currentTarget) onCancel();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <div className="confirm-card">
        <div id={messageId} className="confirm-message">
          {message}
        </div>
        <div className="confirm-actions">
          <button
            ref={cancelRef}
            type="button"
            className="confirm-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-btn confirm-btn-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react'

type Props = {
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ message, confirmLabel, onConfirm, onCancel }: Props) {
  // Escape로 취소 — 다이얼로그가 떠 있는 동안만 리스닝
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="confirm-overlay"
      onClick={(e) => {
        // 오버레이 클릭은 취소 — 전파를 막아 메뉴 닫기 리스너에 닿지 않게 한다
        e.stopPropagation()
        onCancel()
      }}
    >
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-message">{message}</div>
        <div className="confirm-actions">
          <button type="button" className="confirm-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="confirm-btn confirm-btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { loadCompileError, onCompileErrorChanged } from '../../shared/storage'

export function ErrorBanner() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void loadCompileError().then(setError)
    onCompileErrorChanged(setError)
  }, [])

  if (!error) return null
  return <div className="error-banner">규칙 적용 실패: {error}</div>
}

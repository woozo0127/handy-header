import { useState } from 'react'
import { Toggle } from './components/Toggle'
import { EditableField } from './components/EditableField'

export function App() {
  const [on, setOn] = useState(true)
  const [text, setText] = useState('')
  return (
    <div style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Toggle on={on} onChange={setOn} size="md" />
      <Toggle on={on} onChange={setOn} size="sm" />
      <EditableField value={text} placeholder="Header-Name" onCommit={setText} className="mono" />
    </div>
  )
}

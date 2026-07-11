import { useEffect, useRef, useState } from 'react'
import type { Profile } from '../../shared/types'
import type { AppActions } from '../hooks/useAppState'
import { parseProfileFile, serializeProfile } from '../../shared/transfer'
import { EditableField } from './EditableField'
import { ConfirmDialog } from './ConfirmDialog'

type Props = { profiles: Profile[]; activeProfileId: string; actions: AppActions }

export function ProfileSelector({ profiles, activeProfileId, actions }: Props) {
  const [open, setOpen] = useState(false)
  const active = profiles.find((p) => p.id === activeProfileId)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Profile | null>(null)

  // 메뉴가 닫히면 import 에러 표시를 리셋한다
  useEffect(() => {
    if (!open) setImportError(null)
  }, [open])

  const exportActive = () => {
    if (!active) return
    const url = URL.createObjectURL(new Blob([serializeProfile(active)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `HandyHeader-${active.name.replace(/[\\/:*?"<>|]/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const importFile = async (file: File) => {
    try {
      actions.importProfile(parseProfileFile(await file.text()))
      setOpen(false)
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import failed')
    }
  }

  // 바깥 클릭 시 닫기 — 트리거/메뉴 내부 클릭은 stopPropagation으로 여기 도달하지 않는다
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="profile-btn"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        <span>{active?.name}</span>
        <span className="profile-caret">▾</span>
      </button>

      {open && (
        <div className="profmenu" onClick={(e) => e.stopPropagation()}>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`profmenu-item${profile.id === activeProfileId ? ' is-active' : ''}`}
              onClick={() => {
                actions.selectProfile(profile.id)
                setOpen(false)
              }}
            >
              <span className="profmenu-item-label">
                {/* 이름 클릭은 편집이지 선택이 아니므로 항목 onClick으로 전파를 막는다 */}
                <span onClick={(e) => e.stopPropagation()}>
                  <EditableField
                    value={profile.name}
                    placeholder="Profile name"
                    onCommit={(name) => {
                      if (name) actions.renameProfile(profile.id, name)
                    }}
                  />
                </span>
              </span>
              {profiles.length > 1 && (
                <button
                  type="button"
                  className="remove"
                  title="Remove profile"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPendingDelete(profile)
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <div className="profmenu-divider" />
          <button
            type="button"
            className="profmenu-new"
            onClick={() => {
              actions.addProfile()
              setOpen(false)
            }}
          >
            + New profile
          </button>
          <div className="profmenu-divider" />
          <button type="button" className="profmenu-new" onClick={exportActive}>
            ↑ Export profile
          </button>
          <button type="button" className="profmenu-new" onClick={() => fileInputRef.current?.click()}>
            ↓ Import profile
          </button>
          {importError && <div className="profmenu-error">{importError}</div>}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) void importFile(file)
            }}
          />
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={`Delete "${pendingDelete.name}"?`}
          confirmLabel="Delete"
          onConfirm={() => {
            actions.removeProfile(pendingDelete.id)
            setPendingDelete(null)
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  )
}

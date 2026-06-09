import { useState } from 'react'
import { addNoteToClient } from '@/firebase/firestore'
import useClientStore      from '@/store/clientStore'
import Button              from '@/components/ui/Button'

const selectUpdateLocally = (s) => s.updateClientLocally

/**
 * Formats a timestamp string into a human-readable relative time.
 * Examples: "just now", "2 hours ago", "3 days ago"
 */
function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)

  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30)  return `${days}d ago`
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Notes panel for the Client Detail page.
 *
 * Behavior:
 * 1. Matchmaker types a note and clicks Save.
 * 2. Note is added to the local Zustand store immediately (optimistic update).
 * 3. The note is then persisted to Firestore in the background.
 * 4. If the Firestore write fails, a non-blocking error message is shown.
 *
 * Notes are displayed chronologically, most recent first.
 */
export default function NotesPanel({ client }) {
  const updateLocally = useClientStore(selectUpdateLocally)

  const [text,    setText]    = useState('')
  const [saving,  setSaving]  = useState(false)
  const [saveErr, setSaveErr] = useState(null)

  const notes = [...(client.notes ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  async function handleSave() {
    const trimmed = text.trim()
    if (!trimmed) return

    const newNote = {
      id:        `note_${Date.now()}`,
      text:      trimmed,
      createdAt: new Date().toISOString(),
      createdBy: 'matchmaker',
    }

    // Optimistic update — UI updates before Firestore confirms
    updateLocally(client.id, {
      notes: [...(client.notes ?? []), newNote],
    })
    setText('')
    setSaveErr(null)
    setSaving(true)

    try {
      await addNoteToClient(client.id, newNote)
    } catch {
      setSaveErr('Note saved locally but failed to sync. It may not persist after refresh.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h3
        className="mb-4"
        style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#f5eddc', fontWeight: 500 }}
      >
        Notes
      </h3>

      {/* Input area */}
      <div
        className="rounded-xl p-4 mb-5"
        style={{ background: '#1a1814', border: '1px solid rgba(220,158,74,0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note from your last call or meeting…"
          rows={3}
          className="w-full resize-none outline-none text-sm"
          style={{
            fontFamily:  'var(--font-body)',
            fontSize:    '13px',
            color:       '#f5eddc',
            background:  'transparent',
            lineHeight:  1.6,
          }}
          onKeyDown={(e) => {
            // Cmd/Ctrl+Enter saves the note
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSave()
          }}
          aria-label="Add a note"
        />
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(220,158,74,0.2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(220,158,74,0.5)' }}>
            ⌘ + Enter to save
          </span>
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            disabled={!text.trim()}
            onClick={handleSave}
          >
            Save note
          </Button>
        </div>
      </div>

      {/* Sync error */}
      {saveErr && (
        <p className="text-xs mb-4" style={{ color: '#be123c', fontFamily: 'var(--font-body)' }}>
          ⚠ {saveErr}
        </p>
      )}

      {/* Notes list */}
      {notes.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(220,158,74,0.6)', fontStyle: 'italic' }}>
          No notes yet. Record key insights from your calls and meetings.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg px-4 py-3"
              style={{ background: 'rgba(220,158,74,0.05)', border: '1px solid rgba(220,158,74,0.2)' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#f5eddc', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {note.text}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(220,158,74,0.6)', marginTop: '6px' }}>
                {relativeTime(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
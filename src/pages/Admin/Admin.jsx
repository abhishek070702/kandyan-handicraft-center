import { useEffect, useState } from 'react'
import './Admin.css'

function formatWhen(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Admin() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [messages, setMessages] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const selected = messages.find((item) => item.id === selectedId) || null

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const loadMessages = async () => {
    const response = await fetch('/.netlify/functions/admin-messages', { credentials: 'include' })
    const payload = await response.json().catch(() => null)
    if (response.status === 401 || !payload) {
      setAuthed(false)
      setMessages([])
      return
    }
    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || 'Could not load messages.')
    }
    setAuthed(true)
    setMessages(payload.messages || [])
    setSelectedId((current) => current || payload.messages?.[0]?.id || '')
  }

  useEffect(() => {
    loadMessages()
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Could not load messages.')
      })
      .finally(() => setReady(true))
  }, [])

  const signIn = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')
    const body = new FormData()
    body.append('code', event.currentTarget.code.value)
    try {
      const response = await fetch('/.netlify/functions/admin-login', {
        method: 'POST',
        body,
        credentials: 'include',
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'Could not sign in.')
      }
      event.currentTarget.reset()
      await loadMessages()
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in.')
    }
  }

  const signOut = async () => {
    await fetch('/.netlify/functions/admin-logout', { method: 'POST', credentials: 'include' })
    setAuthed(false)
    setMessages([])
    setSelectedId('')
    setReply('')
  }

  const sendReply = async (event) => {
    event.preventDefault()
    if (!selected) return
    setStatus('sending')
    setErrorMessage('')
    const body = new FormData()
    body.append('id', selected.id)
    body.append('reply', reply.trim())
    try {
      const response = await fetch('/.netlify/functions/send-reply', {
        method: 'POST',
        body,
        credentials: 'include',
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'The reply could not be sent.')
      }
      setReply('')
      setMessages((current) =>
        current.map((item) => (item.id === payload.message.id ? payload.message : item)),
      )
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'The reply could not be sent.')
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-top">
        <p>Kandyan Handicraft Center</p>
        <h1>Messages</h1>
        {authed && (
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        )}
      </header>

      {!ready && <p className="admin-note">Loading…</p>}

      {ready && !authed && (
        <form className="admin-login" onSubmit={signIn}>
          <label>
            Admin code
            <input type="password" name="code" required autoComplete="current-password" />
          </label>
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Signing in…' : 'Sign in'}
          </button>
          {errorMessage && <p className="admin-error">{errorMessage}</p>}
        </form>
      )}

      {ready && authed && (
        <div className="admin-layout">
          <ul className="admin-list">
            {messages.length === 0 && <li className="admin-empty">No messages yet.</li>}
            {messages.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={item.id === selectedId ? 'is-active' : ''}
                  onClick={() => {
                    setSelectedId(item.id)
                    setReply('')
                    setStatus('idle')
                    setErrorMessage('')
                  }}
                >
                  <strong>{item.name}</strong>
                  <span>{item.subject}</span>
                  <small>{formatWhen(item.createdAt)}</small>
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <article className="admin-read">
              <p className="admin-read__meta">
                {selected.email}
                <br />
                {formatWhen(selected.createdAt)}
              </p>
              <h2>{selected.subject}</h2>
              <p className="admin-read__message">{selected.message}</p>
              {selected.photoCount > 0 && (
                <div className="admin-photos">
                  {Array.from({ length: selected.photoCount }, (_, index) => (
                    <img
                      key={index}
                      src={`/.netlify/functions/admin-photo?id=${selected.id}&n=${index}`}
                      alt=""
                    />
                  ))}
                </div>
              )}
              {selected.replies?.length > 0 && (
                <div className="admin-sent">
                  {selected.replies.map((item) => (
                    <p key={item.sentAt}>
                      <small>Sent {formatWhen(item.sentAt)}</small>
                      {item.text}
                    </p>
                  ))}
                </div>
              )}
              <form onSubmit={sendReply}>
                <label>
                  Reply
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    rows="6"
                    required
                  />
                </label>
                <button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send to customer'}
                </button>
                {status === 'sent' && <p className="admin-ok">The reply has been sent.</p>}
                {status === 'error' && errorMessage && <p className="admin-error">{errorMessage}</p>}
              </form>
            </article>
          )}
        </div>
      )}
    </main>
  )
}

export default Admin

import { useEffect, useRef, useState } from 'react'
import './Admin.css'

const MAX_PHOTOS = 3
const MAX_PHOTO_BYTES = 2 * 1024 * 1024

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
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const photoUrlsRef = useRef([])

  const selected = messages.find((item) => item.id === selectedId) || null

  const clearPhotos = () => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    photoUrlsRef.current = []
    setPhotos([])
  }

  useEffect(() => {
    return () => {
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const addPhotos = (event) => {
    const selected = Array.from(event.target.files || [])
    const next = [...photos]
    let problem = ''
    for (const file of selected) {
      if (next.length >= MAX_PHOTOS) {
        problem = 'You can add up to 3 photos.'
        break
      }
      if (!file.type.startsWith('image/')) {
        problem = 'Only photos can be added.'
        continue
      }
      if (file.size > MAX_PHOTO_BYTES) {
        problem = 'Each photo must be 2 MB or smaller.'
        continue
      }
      const previewUrl = URL.createObjectURL(file)
      photoUrlsRef.current.push(previewUrl)
      next.push({ file, previewUrl, id: `${file.name}-${file.size}-${file.lastModified}` })
    }
    setPhotos(next)
    setErrorMessage(problem)
    setStatus(problem ? 'error' : 'idle')
    event.target.value = ''
  }

  const removePhoto = (id) => {
    setPhotos((current) => {
      const target = current.find((item) => item.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        photoUrlsRef.current = photoUrlsRef.current.filter((url) => url !== target.previewUrl)
      }
      return current.filter((item) => item.id !== id)
    })
  }

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
    const form = event.currentTarget
    setStatus('sending')
    setErrorMessage('')
    const body = new FormData()
    body.append('code', form.code.value)
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
      form.reset()
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
    clearPhotos()
  }

  const sendReply = async (event) => {
    event.preventDefault()
    if (!selected) return
    setStatus('sending')
    setErrorMessage('')
    const body = new FormData()
    body.append('id', selected.id)
    body.append('reply', reply.trim())
    photos.forEach((item, index) => {
      body.append(`photo-${index + 1}`, item.file, item.file.name)
    })
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
      clearPhotos()
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
      {!ready && <p className="admin-note">Loading…</p>}

      {ready && !authed && (
        <section className="admin-gate">
          <form className="admin-gate__card" onSubmit={signIn}>
            <img src="/images/logo-elephant.png" alt="" width="92" height="92" />
            <p>Kandyan Handicraft Center</p>
            <h1>Messages</h1>
            <span className="admin-gate__line" />
            <label>
              Password
              <input type="password" name="code" required autoComplete="current-password" />
            </label>
            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Opening…' : 'Open messages'}
            </button>
            {errorMessage && <p className="admin-error">{errorMessage}</p>}
          </form>
        </section>
      )}

      {ready && authed && (
        <>
          <header className="admin-top">
            <img src="/images/logo-elephant.png" alt="" width="52" height="52" />
            <div>
              <p>Kandyan Handicraft Center</p>
              <h1>Messages</h1>
            </div>
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </header>

          <div className="admin-layout">
            <ul className="admin-list">
              {messages.length === 0 && (
                <li className="admin-empty">No messages yet. New customer messages will appear here.</li>
              )}
              {messages.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={item.id === selectedId ? 'is-active' : ''}
                    onClick={() => {
                      setSelectedId(item.id)
                      setReply('')
                      clearPhotos()
                      setStatus('idle')
                      setErrorMessage('')
                    }}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.subject}</span>
                    <small>
                      {formatWhen(item.createdAt)}
                      {item.photoCount > 0 ? ' · Photo' : ''}
                    </small>
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
                  <>
                    <p className="admin-label">Customer photos</p>
                    <div className="admin-photos">
                      {Array.from({ length: selected.photoCount }, (_, index) => (
                        <img
                          key={index}
                          src={`/.netlify/functions/admin-photo?id=${selected.id}&n=${index}`}
                          alt=""
                        />
                      ))}
                    </div>
                  </>
                )}
                {selected.replies?.length > 0 && (
                  <div className="admin-sent">
                    {selected.replies.map((item, replyIndex) => (
                      <div key={item.sentAt}>
                        <small>Sent {formatWhen(item.sentAt)}</small>
                        <p>{item.text}</p>
                        {item.photoCount > 0 && (
                          <div className="admin-photos">
                            {Array.from({ length: item.photoCount }, (_, index) => (
                              <img
                                key={index}
                                src={`/.netlify/functions/admin-photo?id=${selected.id}&reply=${replyIndex}&n=${index}`}
                                alt=""
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={sendReply}>
                  <label>
                    Your reply
                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      rows="6"
                      placeholder="Write a reply to the customer"
                    />
                  </label>
                  <div className="admin-attach">
                    <label className="admin-attach__pick">
                      <input type="file" accept="image/*" multiple onChange={addPhotos} />
                      Add photos
                    </label>
                    <span>
                      {photos.length}/{MAX_PHOTOS}
                    </span>
                  </div>
                  {photos.length > 0 && (
                    <div className="admin-photos">
                      {photos.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="admin-photos__remove"
                          onClick={() => removePhoto(item.id)}
                        >
                          <img src={item.previewUrl} alt="" />
                          <span>Remove</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button type="submit" disabled={status === 'sending' || (!reply.trim() && photos.length === 0)}>
                    {status === 'sending' ? 'Sending…' : 'Send to customer'}
                  </button>
                  {status === 'sent' && <p className="admin-ok">The reply has been sent.</p>}
                  {status === 'error' && errorMessage && <p className="admin-error">{errorMessage}</p>}
                </form>
              </article>
            )}
          </div>
        </>
      )}
    </main>
  )
}

export default Admin

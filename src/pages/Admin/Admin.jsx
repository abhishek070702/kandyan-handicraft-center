import { useEffect, useMemo, useRef, useState } from 'react'
import { ENQUIRY_CATEGORIES } from '../../data/enquiryCategories'
import './Admin.css'

const FUNCTIONS_BASE = 'https://ukdgyytjeeouctqzktxy.supabase.co/functions/v1'
const SESSION_KEY = 'khc-owner-session'
const MAX_PHOTOS = 3
const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const MAX_VIDEO_BYTES = 4 * 1024 * 1024

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

function getSessionToken() {
  return window.sessionStorage.getItem(SESSION_KEY) || ''
}

function Admin() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [messages, setMessages] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [reply, setReply] = useState('')
  const [photos, setPhotos] = useState([])
  const [video, setVideo] = useState(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const photoUrlsRef = useRef([])
  const videoUrlRef = useRef('')

  const pendingMessages = useMemo(
    () => messages.filter((item) => item.status !== 'replied' && item.status !== 'archived'),
    [messages],
  )

  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase()
    return pendingMessages.filter((item) => {
      const category = item.category || ''
      if (categoryFilter !== 'All' && category.toLowerCase() !== categoryFilter.toLowerCase()) return false
      if (!words) return true
      return [item.name, item.email, item.category, item.product, item.subject, item.message]
        .join(' ')
        .toLowerCase()
        .includes(words)
    })
  }, [pendingMessages, query, categoryFilter])

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null

  const clearAttachments = () => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    photoUrlsRef.current = []
    setPhotos([])
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
    videoUrlRef.current = ''
    setVideo(null)
  }

  useEffect(() => {
    return () => {
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
    }
  }, [])

  useEffect(() => {
    document.title = 'Owner Messages | Kandyan Handicraft Centre'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow, noarchive'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const addPhotos = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    const next = [...photos]
    let problem = ''

    for (const file of selectedFiles) {
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

  const addVideo = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setStatus('error')
      setErrorMessage('Please choose a video file.')
      return
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setStatus('error')
      setErrorMessage('The video must be 4 MB or smaller.')
      return
    }

    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
    const previewUrl = URL.createObjectURL(file)
    videoUrlRef.current = previewUrl
    setVideo({ file, previewUrl })
    setErrorMessage('')
    setStatus('idle')
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

  const loadMessages = async (token = getSessionToken()) => {
    if (!token) {
      setAuthed(false)
      setMessages([])
      return false
    }

    const response = await fetch(`${FUNCTIONS_BASE}/admin-messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const payload = await response.json().catch(() => null)

    if (response.status === 401 || !payload) {
      window.sessionStorage.removeItem(SESSION_KEY)
      setAuthed(false)
      setMessages([])
      return false
    }
    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || 'Could not load messages.')
    }

    setAuthed(true)
    setMessages(payload.messages || [])
    setSelectedId((current) => current || payload.messages?.find((item) => item.status !== 'replied' && item.status !== 'archived')?.id || '')
    return true
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
      const response = await fetch(`${FUNCTIONS_BASE}/admin-login`, {
        method: 'POST',
        body,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok || !payload?.token) {
        throw new Error(payload?.error || 'Could not sign in.')
      }

      window.sessionStorage.setItem(SESSION_KEY, payload.token)
      form.reset()
      await loadMessages(payload.token)
      setStatus('idle')
    } catch (error) {
      window.sessionStorage.removeItem(SESSION_KEY)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in.')
    }
  }

  const signOut = async () => {
    const token = getSessionToken()
    if (token) {
      await fetch(`${FUNCTIONS_BASE}/admin-logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null)
    }

    window.sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
    setMessages([])
    setSelectedId('')
    setReply('')
    clearAttachments()
    setStatus('idle')
    setErrorMessage('')
  }

  const clearFromInbox = async () => {
    if (!selected) return
    if (!window.confirm(`Clear ${selected.name}'s ${selected.category || 'enquiry'} from the inbox?`)) return

    const token = getSessionToken()
    if (!token) {
      setAuthed(false)
      setErrorMessage('Your owner session has expired. Please sign in again.')
      return
    }

    setStatus('removing')
    setErrorMessage('')

    const body = new FormData()
    body.append('id', selected.id)

    try {
      const response = await fetch(`${FUNCTIONS_BASE}/dismiss-enquiry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'The enquiry could not be cleared.')
      }

      const clearedId = selected.id
      setMessages((current) => current.map((item) => (
        item.id === clearedId ? { ...item, status: 'archived' } : item
      )))
      setSelectedId('')
      setReply('')
      clearAttachments()
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'The enquiry could not be cleared.')
    }
  }

  const sendReply = async (event) => {
    event.preventDefault()
    if (!selected) return

    const token = getSessionToken()
    if (!token) {
      setAuthed(false)
      setErrorMessage('Your owner session has expired. Please sign in again.')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    const body = new FormData()
    body.append('id', selected.id)
    body.append('reply', reply.trim())
    photos.forEach((item, index) => {
      body.append(`photo-${index + 1}`, item.file, item.file.name)
    })
    if (video) body.append('video', video.file, video.file.name)

    try {
      const response = await fetch(`${FUNCTIONS_BASE}/send-reply`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const payload = await response.json().catch(() => null)

      if (response.status === 401) {
        window.sessionStorage.removeItem(SESSION_KEY)
        setAuthed(false)
        throw new Error('Your owner session has expired. Please sign in again.')
      }
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'The reply could not be sent.')
      }

      setReply('')
      clearAttachments()
      setSelectedId('')
      await loadMessages(token)
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
            <p>Kandyan Handicraft Centre</p>
            <h1>Owner Messages</h1>
            <span className="admin-gate__line" />
            <label>
              Owner password
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
              <p>Kandyan Handicraft Centre</p>
              <h1>Owner Messages</h1>
            </div>
            <button type="button" onClick={signOut}>Sign out</button>
          </header>

          <div className="admin-tools">
            <label className="admin-search">
              Search
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a customer, ring, bracelet…" />
            </label>
            <div className="admin-chips">
              <button type="button" className={categoryFilter === 'All' ? 'is-active' : ''} onClick={() => setCategoryFilter('All')}>All</button>
              {ENQUIRY_CATEGORIES.map((item) => (
                <button key={item} type="button" className={categoryFilter === item ? 'is-active' : ''} onClick={() => setCategoryFilter(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="admin-layout">
            <ul className="admin-list">
              {pendingMessages.length === 0 && <li className="admin-empty">All caught up. No unanswered customer enquiries.</li>}
              {pendingMessages.length > 0 && filtered.length === 0 && <li className="admin-empty">No unanswered messages match this search.</li>}
              {filtered.map((item) => (
                <li key={item.id}>
                  <button type="button" className={item.id === selected?.id ? 'is-active' : ''} onClick={() => {
                    setSelectedId(item.id)
                    setReply('')
                    clearAttachments()
                    setStatus('idle')
                    setErrorMessage('')
                  }}>
                    <strong>{item.name}</strong>
                    {item.category && <em>{item.category}</em>}
                    <span>{item.product || item.subject}</span>
                    <small>{formatWhen(item.createdAt)}{item.photoCount > 0 ? ` · ${item.photoCount} photo${item.photoCount > 1 ? 's' : ''}` : ''}{item.hasVideo ? ' · Video' : ''}</small>
                  </button>
                </li>
              ))}
            </ul>

            {selected && (
              <article className="admin-read">
                <div className="admin-read__head">
                  <p className="admin-read__meta">{selected.name} · {selected.email}<br />{formatWhen(selected.createdAt)}</p>
                  <button type="button" className="admin-clear" onClick={clearFromInbox} disabled={status === 'removing'}>
                    {status === 'removing' ? 'Clearing…' : 'Clear from inbox'}
                  </button>
                </div>

                <h2>{selected.category || selected.subject}</h2>
                <p className="admin-read__message">{selected.product || selected.message}</p>

                {selected.photos?.length > 0 && <><p className="admin-label">Customer photos</p><div className="admin-photos">{selected.photos.map((item, index) => <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noreferrer"><img src={item.url} alt={item.fileName || 'Customer attachment'} /></a>)}</div></>}
                {selected.videoUrl && <><p className="admin-label">Customer video</p><video className="admin-video" src={selected.videoUrl} controls /></>}

                <form onSubmit={sendReply}>
                  <label>
                    Reply to {selected.name}
                    <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows="6" placeholder="Type only your message. The Kandyan Handicraft Centre email design and signature are added automatically." />
                  </label>

                  <div className="admin-attach">
                    <label className="admin-attach__pick"><input type="file" accept="image/*" multiple onChange={addPhotos} />Add photos</label>
                    <label className="admin-attach__pick"><input type="file" accept="video/*" onChange={addVideo} />{video ? 'Change video' : 'Add video'}</label>
                    <span>{photos.length}/{MAX_PHOTOS}</span>
                  </div>

                  {video && <div className="admin-video-pick"><video className="admin-video" src={video.previewUrl} controls /><button type="button" onClick={() => {
                    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
                    videoUrlRef.current = ''
                    setVideo(null)
                  }}>Remove video</button></div>}

                  {photos.length > 0 && <div className="admin-photos">{photos.map((item) => <button key={item.id} type="button" className="admin-photos__remove" onClick={() => removePhoto(item.id)}><img src={item.previewUrl} alt="" /><span>Remove</span></button>)}</div>}

                  <button type="submit" disabled={status === 'sending' || status === 'removing' || (!reply.trim() && photos.length === 0 && !video)}>
                    {status === 'sending' ? 'Sending…' : `Send branded reply to ${selected.name}`}
                  </button>
                  {status === 'sent' && <p className="admin-ok">Reply sent successfully. The enquiry has been cleared from the inbox.</p>}
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

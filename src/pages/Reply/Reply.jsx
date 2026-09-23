import { useState } from 'react'
import '../Contact/Contact.css'

function isLocalPreview() {
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

function Reply() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    if (isLocalPreview()) {
      setStatus('error')
      setErrorMessage('Replies can be sent from the live website only.')
      return
    }

    const form = event.currentTarget
    const body = new FormData()
    body.append('code', form.code.value.trim())
    body.append('name', form.name.value.trim())
    body.append('email', form.email.value.trim())
    body.append('reply', form.reply.value.trim())

    try {
      const response = await fetch('/.netlify/functions/send-reply', {
        method: 'POST',
        body,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'The reply could not be sent.')
      }
      form.reset()
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'The reply could not be sent.')
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-content">
        <div className="container" style={{ maxWidth: 720, padding: '48px 20px 80px' }}>
          <p className="contact-section__eyebrow">Shop reply</p>
          <h1>Reply to a customer</h1>
          <p>
            This sends your message inside the jewellery email. Gmail’s Reply button cannot use this design.
          </p>

          <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <label className="contact-form__field">
              <span className="contact-form__message-label">Reply code</span>
              <input type="password" name="code" required autoComplete="current-password" />
            </label>
            <label className="contact-form__field">
              <span className="contact-form__message-label">Customer name</span>
              <input type="text" name="name" required />
            </label>
            <label className="contact-form__field">
              <span className="contact-form__message-label">Customer email</span>
              <input type="email" name="email" required />
            </label>
            <label className="contact-form__message">
              <span className="contact-form__message-label">Your reply</span>
              <textarea name="reply" rows="6" required />
            </label>
            <button className="contact-form__submit" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send reply'}
            </button>
            {status === 'sent' && (
              <p className="contact-form__success" role="status">
                The reply has been sent in the jewellery template.
              </p>
            )}
            {status === 'error' && (
              <p className="contact-form__error" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}

export default Reply

import nodemailer from 'nodemailer'
import { SHOP_EMAIL } from '../../src/utils/whatsapp.js'
import { json, requireAdmin } from '../lib/admin-auth.js'
import { readMessage, writeMessage } from '../lib/enquiries.js'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function createTransport(user, pass, port) {
  const secure = port === 465
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    connectionTimeout: secure ? 12000 : 8000,
    greetingTimeout: 12000,
    socketTimeout: 20000,
  })
}

async function sendOne(user, pass, message) {
  let lastError
  for (const port of [465, 587]) {
    const transporter = createTransport(user, pass, port)
    try {
      await transporter.sendMail(message)
      transporter.close()
      return
    } catch (error) {
      lastError = error
      transporter.close()
      const code = error && error.code
      if (code !== 'ETIMEDOUT' && code !== 'ECONNECTION' && code !== 'ESOCKET' && code !== 'ECONNRESET') {
        throw error
      }
    }
  }
  throw lastError
}

export default async function sendReply(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405)
  }

  const denied = requireAdmin(request)
  if (denied) return denied

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    return json({ ok: false, error: 'Replies cannot be sent right now.' }, 500)
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return json({ ok: false, error: 'Could not read the reply.' }, 400)
  }

  const id = String(form.get('id') || '').trim()
  const reply = String(form.get('reply') || '').trim()
  if (!reply) return json({ ok: false, error: 'Write a reply first.' }, 400)

  const message = await readMessage(id)
  if (!message) return json({ ok: false, error: 'That message was not found.' }, 404)

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#222;font-size:16px;line-height:1.7;">
<p style="margin:0;">${escapeHtml(reply).replace(/\n/g, '<br />')}</p>
</div>`

  try {
    await sendOne(user, pass, {
      from: `Kandyan Handicraft Center <${user}>`,
      to: message.email,
      replyTo: SHOP_EMAIL,
      subject: `Re: ${message.subject}`,
      text: reply,
      html,
    })
  } catch (error) {
    console.error('Shop reply failed', error)
    return json({ ok: false, error: 'The reply could not be sent. Please try again.' }, 502)
  }

  message.replies = Array.isArray(message.replies) ? message.replies : []
  message.replies.push({ text: reply, sentAt: new Date().toISOString() })
  await writeMessage(message)

  return json({ ok: true, message })
}

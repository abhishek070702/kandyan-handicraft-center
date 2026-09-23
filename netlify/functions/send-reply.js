import nodemailer from 'nodemailer'
import { SHOP_EMAIL } from '../../src/utils/whatsapp.js'
import { json, requireAdmin } from '../lib/admin-auth.js'
import { enquiryStore, readMessage, replyPhotoKey, writeMessage } from '../lib/enquiries.js'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024

async function readPhotos(form) {
  const photos = []
  for (const field of ['photo-1', 'photo-2', 'photo-3']) {
    const value = form.get(field)
    if (!value || typeof value === 'string' || !value.size) continue
    if (value.size > MAX_PHOTO_BYTES) {
      throw new Error('Each photo must be 2 MB or smaller.')
    }
    if (value.type && !value.type.startsWith('image/')) {
      throw new Error('Only image files can be attached.')
    }
    const bytes = Buffer.from(await value.arrayBuffer())
    photos.push({
      filename: safeFilename(value.name, photos.length + 1, value.type),
      content: bytes,
      contentType: value.type || 'application/octet-stream',
    })
  }
  return photos
}

function safeFilename(name, index, type) {
  const cleaned = String(name || '')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
  if (cleaned && /\.(jpe?g|png|webp|gif|heic)$/i.test(cleaned)) return cleaned
  const ext =
    type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : type === 'image/gif' ? 'gif' : 'jpg'
  return `photo-${index}.${ext}`
}

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
  let photos
  try {
    photos = await readPhotos(form)
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : 'Could not attach the photos.' },
      400,
    )
  }
  if (!reply && photos.length === 0) {
    return json({ ok: false, error: 'Write a reply or add a photo.' }, 400)
  }

  const message = await readMessage(id)
  if (!message) return json({ ok: false, error: 'That message was not found.' }, 404)

  const text = reply || 'Please see the attached photos.'
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#222;font-size:16px;line-height:1.7;">
<p style="margin:0;">${escapeHtml(text).replace(/\n/g, '<br />')}</p>
</div>`

  try {
    await sendOne(user, pass, {
      from: `Kandyan Handicraft Center <${user}>`,
      to: message.email,
      replyTo: SHOP_EMAIL,
      subject: `Re: ${message.subject}`,
      text,
      html,
      attachments: photos.map((photo) => ({
        filename: photo.filename,
        content: photo.content,
        contentType: photo.contentType,
      })),
    })
  } catch (error) {
    console.error('Shop reply failed', error)
    return json({ ok: false, error: 'The reply could not be sent. Please try again.' }, 502)
  }

  message.replies = Array.isArray(message.replies) ? message.replies : []
  const replyIndex = message.replies.length
  const store = enquiryStore()
  await Promise.all(
    photos.map((photo, index) =>
      store.set(replyPhotoKey(id, replyIndex, index), photo.content, {
        metadata: { contentType: photo.contentType },
      }),
    ),
  )
  message.replies.push({
    text,
    sentAt: new Date().toISOString(),
    photoCount: photos.length,
  })
  await writeMessage(message)

  return json({ ok: true, message })
}

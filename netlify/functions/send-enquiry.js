import nodemailer from 'nodemailer'
import { SHOP_EMAIL } from '../../src/utils/whatsapp.js'
import { customerReceiptMail, shopEnquiryMail } from '../lib/jewellery-mail.js'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

async function photoAttachments(form) {
  const files = []

  for (const field of ['photo-1', 'photo-2', 'photo-3']) {
    const value = form.get(field)
    if (!value || typeof value === 'string' || !value.size) continue
    if (value.size > MAX_PHOTO_BYTES) {
      throw new Error('Each photo must be 2 MB or smaller.')
    }
    if (value.type && !value.type.startsWith('image/')) {
      throw new Error('Only image files can be attached.')
    }

    files.push({
      filename: safeFilename(value.name, field, value.type),
      content: Buffer.from(await value.arrayBuffer()),
      contentType: value.type || 'application/octet-stream',
    })
  }

  return files
}

function safeFilename(name, field, type) {
  const cleaned = String(name || '')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
  if (cleaned && /\.(jpe?g|png|webp|gif|heic)$/i.test(cleaned)) return cleaned

  const fromType =
    type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : type === 'image/gif' ? 'gif' : 'jpg'
  return `${field}.${fromType}`
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
      console.error(`Enquiry mail connection failed on port ${port}`, code)
    }
  }

  throw lastError
}

export default async function sendEnquiry(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405)
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    console.error('Enquiry mail skipped: GMAIL_USER or GMAIL_APP_PASSWORD is not set.')
    return json(
      { ok: false, error: 'Messages cannot be sent right now. Please use WhatsApp or email us directly.' },
      500,
    )
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return json({ ok: false, error: 'Could not read your message.' }, 400)
  }

  if (String(form.get('bot-field') || '').trim()) {
    return json({ ok: true })
  }

  const fields = {
    name: String(form.get('name') || '').trim(),
    email: String(form.get('email') || '').trim(),
    subject: String(form.get('subject') || '').trim(),
    message: String(form.get('message') || '').trim(),
  }

  if (!fields.name || !fields.subject || !fields.message || !isEmail(fields.email)) {
    return json({ ok: false, error: 'Please fill in your name, email, subject, and message.' }, 400)
  }

  let attachments
  try {
    attachments = await photoAttachments(form)
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : 'Could not attach the photos.' },
      400,
    )
  }

  const shopMail = shopEnquiryMail({ ...fields, photoCount: attachments.length })
  const fromShop = `Kandyan Handicraft Center <${user}>`
  const senderName = fields.name.replace(/[\r\n"]/g, '').slice(0, 80)

  const receipt = customerReceiptMail(fields)

  try {
    await sendOne(user, pass, {
      from: senderName ? `"${senderName}" <${user}>` : fromShop,
      to: SHOP_EMAIL,
      replyTo: senderName ? `"${senderName}" <${fields.email}>` : fields.email,
      subject: shopMail.subject,
      html: shopMail.html,
      text: shopMail.text,
      attachments,
    })
    try {
      await sendOne(user, pass, {
        from: fromShop,
        to: fields.email,
        replyTo: SHOP_EMAIL,
        subject: receipt.subject,
        html: receipt.html,
        text: receipt.text,
      })
    } catch (error) {
      console.error('Customer receipt failed after the shop email was sent', error)
    }
  } catch (error) {
    console.error('Enquiry mail failed', error)
    return json(
      { ok: false, error: 'We could not send your message. Please try WhatsApp or email us directly.' },
      502,
    )
  }

  return json({ ok: true })
}

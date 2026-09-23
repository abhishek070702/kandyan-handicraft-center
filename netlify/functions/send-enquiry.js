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
      filename: value.name || `${field}.jpg`,
      content: Buffer.from(await value.arrayBuffer()),
      contentType: value.type || 'application/octet-stream',
    })
  }

  return files
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

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  })
  const shopMail = shopEnquiryMail({ ...fields, photoCount: attachments.length })
  const fromShop = `Kandyan Handicraft Center <${user}>`
  const senderName = fields.name.replace(/[\r\n"]/g, '').slice(0, 80)

  try {
    await transporter.sendMail({
      from: senderName ? `"${senderName}" <${user}>` : fromShop,
      to: SHOP_EMAIL,
      replyTo: fields.email,
      subject: shopMail.subject,
      html: shopMail.html,
      text: shopMail.text,
      attachments,
    })

    const receipt = customerReceiptMail(fields)
    await transporter.sendMail({
      from: fromShop,
      to: fields.email,
      replyTo: SHOP_EMAIL,
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
    })
  } catch (error) {
    console.error('Enquiry mail failed', error)
    return json(
      { ok: false, error: 'We could not send your message. Please try WhatsApp or email us directly.' },
      502,
    )
  }

  return json({ ok: true })
}

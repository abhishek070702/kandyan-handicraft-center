import nodemailer from 'nodemailer'
import { SHOP_EMAIL } from '../../src/utils/whatsapp.js'
import { shopReplyMail } from '../lib/jewellery-mail.js'

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

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  const replyCode = process.env.SHOP_REPLY_CODE
  if (!user || !pass || !replyCode) {
    return json({ ok: false, error: 'Replies cannot be sent right now.' }, 500)
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return json({ ok: false, error: 'Could not read the reply.' }, 400)
  }

  if (String(form.get('code') || '') !== replyCode) {
    return json({ ok: false, error: 'The reply code is not correct.' }, 401)
  }

  const fields = {
    name: String(form.get('name') || '').trim(),
    email: String(form.get('email') || '').trim(),
    reply: String(form.get('reply') || '').trim(),
  }

  if (!fields.name || !fields.reply || !isEmail(fields.email)) {
    return json({ ok: false, error: 'Enter the customer name, email, and your reply.' }, 400)
  }

  const mail = shopReplyMail(fields)
  try {
    await sendOne(user, pass, {
      from: `Kandyan Handicraft Center <${user}>`,
      to: fields.email,
      replyTo: SHOP_EMAIL,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    })
  } catch (error) {
    console.error('Shop reply failed', error)
    return json({ ok: false, error: 'The reply could not be sent. Please try again.' }, 502)
  }

  return json({ ok: true })
}

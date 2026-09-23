import nodemailer from 'nodemailer'
import { SHOP_EMAIL } from '../../src/utils/whatsapp.js'
import { customerReceiptMail, shopEnquiryMail } from '../lib/jewellery-mail.js'

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function readFields(event) {
  const data = event?.data && typeof event.data === 'object' ? event.data : {}
  return {
    name: String(data.name || '').trim(),
    email: String(data.email || '').trim(),
    subject: String(data.subject || '').trim(),
    message: String(data.message || '').trim(),
    'photo-1': data['photo-1'],
    'photo-2': data['photo-2'],
    'photo-3': data['photo-3'],
  }
}

async function sendMail(transporter, message) {
  await transporter.sendMail(message)
}

export default {
  async formSubmitted(event) {
    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD

    if (!user || !pass) {
      console.log('Jewellery emails skipped: GMAIL_USER or GMAIL_APP_PASSWORD is not set.')
      return
    }

    const fields = readFields(event)
    if (!fields.name && !fields.email && !fields.message) return

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
      })

      const shopMail = shopEnquiryMail(fields)
      const fromShop = `Kandyan Handicraft Center <${user}>`
      const senderName = fields.name.replace(/[\r\n"]/g, '').slice(0, 80)
      const fromCustomer = senderName ? `"${senderName}" <${user}>` : fromShop

      await sendMail(transporter, {
        from: fromCustomer,
        to: SHOP_EMAIL,
        replyTo: isEmail(fields.email)
          ? senderName
            ? `"${senderName}" <${fields.email}>`
            : fields.email
          : undefined,
        subject: shopMail.subject,
        html: shopMail.html,
        text: shopMail.text,
      })

      if (!isEmail(fields.email)) return

      const receipt = customerReceiptMail(fields)
      await sendMail(transporter, {
        from: fromShop,
        to: fields.email,
        replyTo: SHOP_EMAIL,
        subject: receipt.subject,
        html: receipt.html,
        text: receipt.text,
      })
    } catch (error) {
      console.error('Jewellery form mail failed', error)
    }
  },
}

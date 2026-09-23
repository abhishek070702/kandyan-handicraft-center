import { COMPANY_PHONES, SHOP_EMAIL } from '../../src/utils/whatsapp.js'

const GOLD = '#d4af37'
const SOFT = '#f3d27a'
const INK = '#f6efe2'
const MUTED = '#c8c2b8'
const CARD = '#071614'
const PAGE = '#050505'

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function siteOrigin() {
  return (process.env.URL || 'https://kandyan-handicraft-center.netlify.app').replace(/\/$/, '')
}

function phoneLine() {
  return COMPANY_PHONES.map((phone) => phone.display).join('  ·  ')
}

function shell({ eyebrow, title, intro, inner }) {
  const logo = `${siteOrigin()}/images/logo-elephant.png`

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:${PAGE};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid rgba(212,175,55,0.45);border-radius:22px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:32px 28px 8px;">
                <img src="${logo}" width="64" height="64" alt="Kandyan Handicraft Center" style="display:block;border:0;width:64px;height:64px;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1;letter-spacing:0.14em;color:${SOFT};">
                KANDYAN
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:6px 28px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;color:${GOLD};">
                HANDICRAFT CENTER
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 28px 0;">
                <div style="width:72px;height:1px;background:${GOLD};"></div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 32px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${GOLD};">
                ${eyebrow}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 32px 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:${SOFT};">
                ${title}
              </td>
            </tr>
            <tr>
              <td style="padding:14px 32px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${MUTED};text-align:center;">
                ${intro}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px 8px;">
                ${inner}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:${MUTED};">
                ${escapeHtml(phoneLine())}<br />
                <a href="mailto:${SHOP_EMAIL}" style="color:${SOFT};text-decoration:none;">${SHOP_EMAIL}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function detailRow(label, value) {
  return `<tr>
    <td style="padding:12px 16px;border-bottom:1px solid rgba(212,175,55,0.18);">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">${label}</div>
      <div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${INK};">${value}</div>
    </td>
  </tr>`
}

function detailTable(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#04110f;border:1px solid rgba(212,175,55,0.28);border-radius:16px;">
    ${rows}
  </table>`
}

function messageHtml(message) {
  return escapeHtml(message).replace(/\n/g, '<br />')
}

function photoLinks(data) {
  const links = [1, 2, 3]
    .map((index) => data[`photo-${index}`])
    .map((photo) => {
      if (!photo) return ''
      if (typeof photo === 'string') return photo.trim()
      if (typeof photo === 'object' && photo.url) return String(photo.url).trim()
      return ''
    })
    .filter((url) => /^https:\/\//i.test(url))

  if (!links.length) return ''

  const items = links
    .map(
      (url, index) =>
        `<a href="${escapeHtml(url)}" style="color:${SOFT};text-decoration:underline;">Photo ${index + 1}</a>`,
    )
    .join('<br />')

  return detailRow('Photos', items)
}

export function shopEnquiryMail(data) {
  const name = escapeHtml(data.name || 'A customer')
  const email = escapeHtml(data.email || '')
  const subject = escapeHtml(data.subject || 'New enquiry')
  const message = messageHtml(data.message || '')
  const emailLink = data.email
    ? `<a href="mailto:${escapeHtml(data.email)}" style="color:${SOFT};text-decoration:none;">${email}</a>`
    : email

  const html = shell({
    eyebrow: 'New enquiry',
    title: 'A new jewellery enquiry',
    intro: 'A new message has arrived from the website. Reply to this email to answer them directly.',
    inner: detailTable(
      detailRow('Name', name) +
        detailRow('Email', emailLink) +
        detailRow('Subject', subject) +
        detailRow('Message', message) +
        photoLinks(data),
    ),
  })

  const text = [
    'New enquiry — Kandyan Handicraft Center',
    '',
    `Name: ${data.name || ''}`,
    `Email: ${data.email || ''}`,
    `Subject: ${data.subject || ''}`,
    '',
    data.message || '',
  ].join('\n')

  return {
    subject: `${data.name || 'Customer'} — ${data.subject || 'New enquiry'}`,
    html,
    text,
  }
}

export function customerReceiptMail(data) {
  const name = escapeHtml(data.name || 'there')
  const subject = escapeHtml(data.subject || 'Your enquiry')
  const message = messageHtml(data.message || '')

  const html = shell({
    eyebrow: 'Message received',
    title: `Thank you, ${name}`,
    intro: 'Your note has reached Kandyan Handicraft Center. We will reply to this email.',
    inner: detailTable(detailRow('Subject', subject) + detailRow('Your message', message)),
  })

  const text = [
    `Thank you, ${data.name || ''}`,
    '',
    'Your message has reached Kandyan Handicraft Center. We will reply to this email.',
    '',
    `Subject: ${data.subject || ''}`,
    '',
    data.message || '',
    '',
    phoneLine(),
    SHOP_EMAIL,
  ].join('\n')

  return {
    subject: `We received your message — Kandyan Handicraft Center`,
    html,
    text,
  }
}

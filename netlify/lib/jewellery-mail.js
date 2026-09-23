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

function previewBlock(preview) {
  const text = escapeHtml(String(preview || '').replace(/\s+/g, ' ').trim())
  if (!text) return ''
  const pad = '&nbsp;&zwnj;'.repeat(90)
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${text}${pad}</div>`
}

function shell({ eyebrow, title, intro, inner, preview }) {
  const logo = `${siteOrigin()}/images/logo-elephant.png`

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:${PAGE};">
    ${previewBlock(preview)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid rgba(212,175,55,0.45);border-radius:22px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:32px 28px 8px;">
                <img src="${logo}" width="64" height="64" alt="" style="display:block;border:0;width:64px;height:64px;" />
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

function attachedPhotoCopy(data) {
  const count = Number(data.photoCount) || 0
  if (count === 1) return '1 photo is attached to this email.'
  if (count > 1) return `${count} photos are attached to this email.`

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
  return links
    .map(
      (url, index) =>
        `<a href="${escapeHtml(url)}" style="color:#8c6a1a;text-decoration:underline;">Photo ${index + 1}</a>`,
    )
    .join('<br />')
}

export function shopEnquiryMail(data) {
  const name = escapeHtml(data.name || 'A customer')
  const email = escapeHtml(data.email || '')
  const subject = escapeHtml(data.subject || 'New enquiry')
  const message = messageHtml(data.message || '')
  const logo = `${siteOrigin()}/images/logo-elephant.png`
  const emailLink = data.email
    ? `<a href="mailto:${escapeHtml(data.email)}" style="color:#8c6a1a;text-decoration:none;">${email}</a>`
    : email
  const photos = attachedPhotoCopy(data)
  const messagePreview = String(data.message || '').replace(/\s+/g, ' ').trim()
  const preview = messagePreview || `${data.name || 'A customer'} sent an enquiry.`

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#031f1c;font-family:Arial,Helvetica,sans-serif;">
${previewBlock(preview)}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#031f1c;padding:30px 12px;">
<tr>
<td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr>
<td align="center" style="background:#050505;padding:32px 25px;border-bottom:3px solid #d4af37;">
<img src="${logo}" width="90" height="90" alt="" style="display:block;margin:auto;border:0;width:90px;height:90px;" />
<h1 style="color:#d4af37;font-family:Georgia,serif;font-size:25px;margin:15px 0 6px;">Kandyan Handicraft Center</h1>
<p style="color:#c8c2b8;font-size:11px;letter-spacing:2px;margin:0;">NEW CUSTOMER INQUIRY</p>
</td>
</tr>
<tr>
<td style="padding:34px;">
<h2 style="font-family:Georgia,serif;color:#171717;margin:0 0 8px;font-size:25px;">New Jewellery Inquiry</h2>
<p style="color:#5c675f;font-size:14px;line-height:1.7;margin:0 0 28px;">A customer has contacted Kandyan Handicraft Center through the website.</p>
<p style="color:#d4af37;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 8px;">CUSTOMER DETAILS</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4ea;border:1px solid #e4d5a4;border-radius:10px;margin-bottom:25px;">
<tr>
<td style="padding:20px;">
<p style="margin:5px 0;color:#5c675f;font-size:12px;">NAME</p>
<p style="margin:0 0 15px;color:#171717;font-size:15px;"><strong>${name}</strong></p>
<p style="margin:5px 0;color:#5c675f;font-size:12px;">EMAIL</p>
<p style="margin:0;color:#171717;font-size:15px;">${emailLink}</p>
</td>
</tr>
</table>
<p style="color:#d4af37;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 8px;">INQUIRY DETAILS</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4ea;border:1px solid #e4d5a4;border-radius:10px;">
<tr>
<td style="padding:20px;">
<p style="margin:5px 0;color:#5c675f;font-size:12px;">SUBJECT</p>
<p style="margin:0 0 15px;color:#171717;font-size:15px;"><strong>${subject}</strong></p>
<p style="margin:5px 0;color:#5c675f;font-size:12px;">MESSAGE</p>
<p style="margin:0;color:#333333;line-height:1.7;">${message}</p>
${photos ? `<p style="margin:15px 0 5px;color:#5c675f;font-size:12px;">PHOTOS</p><p style="margin:0;color:#171717;line-height:1.7;">${photos}</p>` : ''}
</td>
</tr>
</table>
<div style="margin-top:28px;padding:16px;background:#050505;border-radius:8px;text-align:center;">
<p style="color:#d4af37;margin:0;font-size:13px;">Reply to this email to respond directly to the customer.</p>
</div>
</td>
</tr>
<tr>
<td align="center" style="background:#050505;padding:25px;">
<p style="font-family:Georgia,serif;color:#f3d27a;margin:0 0 8px;">Heritage. Craft. Elegance.</p>
<p style="color:#c8c2b8;font-size:11px;margin:0;">Inquiry received through the Kandyan Handicraft Center website</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`

  const text = [
    preview,
    '',
    `Name: ${data.name || ''}`,
    `Email: ${data.email || ''}`,
    `Subject: ${data.subject || ''}`,
    '',
    data.message || '',
    data.photoCount ? `Photos attached: ${data.photoCount}` : '',
  ].filter((line) => line !== '').join('\n')

  return {
    subject: `New Jewellery Inquiry — ${data.name || 'Customer'}`,
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
    preview: `We received your message about ${data.subject || 'your enquiry'} and will reply to this email.`,
    inner: detailTable(detailRow('Subject', subject) + detailRow('Your message', message)),
  })

  const text = [
    `We received your message about ${data.subject || 'your enquiry'} and will reply to this email.`,
    '',
    `Thank you, ${data.name || ''}`,
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

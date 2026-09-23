import { SHOP_ADDRESS } from '../../src/utils/whatsapp.js'

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

function previewBlock(preview) {
  const text = escapeHtml(String(preview || '').replace(/\s+/g, ' ').trim())
  if (!text) return ''
  const pad = '&nbsp;&zwnj;'.repeat(90)
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${text}${pad}</div>`
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
  const logo = `${siteOrigin()}/images/logo-elephant.png`
  const collections = `${siteOrigin()}/collections`
  const preview = 'We have received your jewellery inquiry and will get back to you shortly.'
  const photos = Number(data.photoCount) || 0
  const photoLine =
    photos === 1
      ? '<p style="margin:7px 0;font-size:14px;color:#333333;"><strong>Photos:</strong> 1 photo was attached.</p>'
      : photos > 1
        ? `<p style="margin:7px 0;font-size:14px;color:#333333;"><strong>Photos:</strong> ${photos} photos were attached.</p>`
        : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kandyan Handicraft Center</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f1e8;font-family:Arial,Helvetica,sans-serif;">
${previewBlock(preview)}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f1e8;padding:30px 10px;">
<tr>
<td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr>
<td align="center" style="background:#0b0b0b;padding:35px 20px;border-bottom:3px solid #d4af37;">
<img src="${logo}" alt="" width="95" height="95" style="display:block;margin:auto;border:0;width:95px;height:95px;" />
<h1 style="color:#d4af37;margin:18px 0 5px;font-size:26px;font-family:Georgia,serif;font-weight:500;letter-spacing:1px;">Kandyan Handicraft Center</h1>
<p style="color:#d9d9d9;margin:0;font-size:13px;letter-spacing:2px;">CRAFTED THROUGH GENERATIONS</p>
</td>
</tr>
<tr>
<td style="padding:38px 35px;">
<p style="margin:0 0 16px;color:#333333;font-size:16px;">Hello <strong>${name}</strong>,</p>
<h2 style="color:#1b1b1b;font-family:Georgia,serif;font-size:25px;margin:0 0 15px;">Thank You for Contacting Us</h2>
<p style="color:#666666;font-size:15px;line-height:1.7;margin:0 0 25px;">We have received your jewellery inquiry. Our team at Kandyan Handicraft Center will review your request and get back to you shortly.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7ef;border:1px solid #eadfbf;border-radius:10px;margin-bottom:30px;">
<tr>
<td style="padding:22px;">
<p style="margin:0 0 15px;color:#b58a24;font-size:12px;font-weight:bold;letter-spacing:2px;">YOUR INQUIRY</p>
<p style="margin:7px 0;font-size:14px;color:#333333;"><strong>Subject:</strong> ${subject}</p>
<p style="margin:7px 0;font-size:14px;color:#333333;"><strong>Message:</strong> ${message}</p>
${photoLine}
</td>
</tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" align="center">
<tr>
<td align="center" style="background:#d4af37;border-radius:6px;">
<a href="${collections}" style="display:inline-block;padding:14px 28px;color:#111111;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;">VIEW OUR COLLECTIONS</a>
</td>
</tr>
</table>
<p style="text-align:center;color:#777777;margin:35px 0 0;font-size:14px;">Need assistance? Reply to this email and we'll be happy to help.</p>
</td>
</tr>
<tr>
<td align="center" style="background:#111111;padding:30px 20px;">
<p style="color:#d4af37;margin:0 0 8px;font-family:Georgia,serif;font-size:16px;">Crafted through generations.</p>
<p style="color:#d4af37;margin:0 0 20px;font-family:Georgia,serif;font-size:16px;">Created especially for you.</p>
<p style="color:#aaaaaa;font-size:12px;line-height:1.7;margin:0;">Kandyan Handicraft Center<br />${escapeHtml(SHOP_ADDRESS)}<br />Gold • Silver • Gems • Traditional Jewellery</p>
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
    `Hello ${data.name || ''},`,
    '',
    `Subject: ${data.subject || ''}`,
    '',
    data.message || '',
    '',
    SHOP_ADDRESS,
    collections,
  ].join('\n')

  return {
    subject: 'Thank You for Contacting Us — Kandyan Handicraft Center',
    html,
    text,
  }
}

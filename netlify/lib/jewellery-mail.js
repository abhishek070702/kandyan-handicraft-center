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

function detailLine(label, value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return `<p style="margin:16px 0 4px;color:#8c6a1a;font-size:11px;letter-spacing:1.6px;font-weight:bold;">${label}</p>
<p style="margin:0;color:#222222;font-size:15px;line-height:1.6;">${text}</p>`
}

function quietMail({ preview, inner }) {
  const logo = `${siteOrigin()}/images/logo-elephant.png`
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5f1e8;font-family:Georgia,serif;">
${previewBlock(preview)}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1e8;padding:36px 12px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;">
<tr>
<td align="center" style="background:#0b0b0b;padding:36px 28px 28px;border-bottom:2px solid #d4af37;">
<img src="${logo}" alt="" width="84" height="84" style="display:block;margin:0 auto 16px;border:0;width:84px;height:84px;" />
<p style="margin:0;color:#d4af37;font-size:18px;letter-spacing:2px;">Kandyan Handicraft Center</p>
</td>
</tr>
<tr>
<td style="padding:36px 36px 40px;">
${inner}
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function inquiryDetails(data) {
  const email = data.email
    ? `<a href="mailto:${escapeHtml(data.email)}" style="color:#8c6a1a;text-decoration:none;">${escapeHtml(data.email)}</a>`
    : ''
  const photos = attachedPhotoCopy(data)
  return [
    detailLine('NAME', escapeHtml(data.name || '')),
    detailLine('EMAIL', email),
    detailLine('PHONE / WHATSAPP', escapeHtml(data.phone || '')),
    detailLine('PRODUCT', escapeHtml(data.product || data.subject || '')),
    detailLine('MATERIAL', escapeHtml(data.material || '')),
    detailLine('CATEGORY', escapeHtml(data.category || '')),
    detailLine('MESSAGE', messageHtml(data.message || '')),
    photos ? detailLine('PHOTOS', photos) : '',
  ].join('')
}

export function shopEnquiryMail(data) {
  const preview =
    String(data.message || '').replace(/\s+/g, ' ').trim() ||
    `${data.name || 'A customer'} sent an enquiry.`
  return {
    subject: `New Jewellery Inquiry — ${data.name || 'Customer'}`,
    html: quietMail({
      preview,
      inner: inquiryDetails(data),
    }),
    text: [
      preview,
      '',
      `Name: ${data.name || ''}`,
      `Email: ${data.email || ''}`,
      `Phone: ${data.phone || ''}`,
      `Product: ${data.product || data.subject || ''}`,
      `Material: ${data.material || ''}`,
      `Category: ${data.category || ''}`,
      '',
      data.message || '',
    ]
      .filter((line) => line !== '')
      .join('\n'),
  }
}

function receiptLine(label, value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return `<p style="margin:7px 0;font-size:14px;color:#333333;"><strong>${label}:</strong> ${text}</p>`
}

export function customerReceiptMail(data) {
  const name = escapeHtml(data.name || 'there')
  const preview = 'We received your message.'
  const photos = attachedPhotoCopy(data)

  const html = quietMail({
    preview,
    inner: `<p style="margin:0 0 22px;color:#171717;font-size:22px;">Hello ${name},</p>
<p style="margin:0 0 28px;color:#666666;font-size:16px;line-height:1.7;">We received your message.</p>
${receiptLine('Product', escapeHtml(data.product || data.subject || ''))}
${receiptLine('Material', escapeHtml(data.material || ''))}
${receiptLine('Category', escapeHtml(data.category || ''))}
${receiptLine('Message', messageHtml(data.message || ''))}
${photos ? receiptLine('Photos', photos) : ''}`,
  })

  return {
    subject: 'Thank You for Contacting Us — Kandyan Handicraft Center',
    html,
    text: [
      preview,
      '',
      `Hello ${data.name || ''},`,
      '',
      `Product: ${data.product || data.subject || ''}`,
      `Material: ${data.material || ''}`,
      `Category: ${data.category || ''}`,
      '',
      data.message || '',
    ]
      .filter((line) => line !== '')
      .join('\n'),
  }
}

export function shopReplyMail(data) {
  const name = escapeHtml(data.name || 'there')
  const reply = messageHtml(data.reply || '')
  const preview = String(data.reply || '').replace(/\s+/g, ' ').trim()

  const html = quietMail({
    preview,
    inner: `<p style="margin:0 0 22px;color:#171717;font-size:22px;">Hello ${name},</p>
<p style="margin:0;color:#333333;font-size:16px;line-height:1.8;">${reply}</p>`,
  })

  return {
    subject: 'A reply from Kandyan Handicraft Center',
    html,
    text: [`Hello ${data.name || ''},`, '', data.reply || ''].join('\n'),
  }
}

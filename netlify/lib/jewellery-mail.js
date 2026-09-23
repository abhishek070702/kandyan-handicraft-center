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

const CATEGORY_LINKS = {
  rings: '/collections/rings',
  earrings: '/collections/earrings',
  necklaces: '/collections/necklaces',
  bracelets: '/collections/bracelets',
  bangles: '/collections/bangles',
  brooches: '/collections/brooches',
  'waist chains': '/collections/waist-chains',
  pendants: '/collections/pendants',
  gems: '/gems',
}

function productHref(category) {
  const key = String(category || '').trim().toLowerCase()
  return `${siteOrigin()}${CATEGORY_LINKS[key] || '/collections'}`
}

function detailLine(label, value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return `<p style="margin:16px 0 4px;color:#8c6a1a;font-size:11px;letter-spacing:1.6px;font-weight:bold;">${label}</p>
<p style="margin:0;color:#222222;font-size:15px;line-height:1.6;">${text}</p>`
}

function inquiryCard({ preview, eyebrow, title, intro, details, buttonLabel, buttonHref, note }) {
  const logo = `${siteOrigin()}/images/logo-elephant.png`
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5f1e8;font-family:Arial,Helvetica,sans-serif;">
${previewBlock(preview)}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1e8;padding:30px 12px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr>
<td align="center" style="background:#0b0b0b;padding:32px 24px 26px;border-bottom:3px solid #d4af37;">
<img src="${logo}" alt="" width="90" height="90" style="display:block;margin:0 auto 14px;border:0;width:90px;height:90px;" />
<p style="margin:0;color:#d4af37;font-family:Georgia,serif;font-size:18px;letter-spacing:2px;">KANDYAN HANDICRAFT CENTER</p>
<p style="margin:8px 0 0;color:#d9d9d9;font-size:11px;letter-spacing:2px;">${eyebrow}</p>
</td>
</tr>
<tr>
<td style="padding:34px 32px 28px;">
<h2 style="margin:0 0 10px;color:#171717;font-family:Georgia,serif;font-size:26px;font-weight:500;text-align:center;">${title}</h2>
<p style="margin:0 0 26px;color:#666666;font-size:15px;line-height:1.7;text-align:center;">${intro}</p>
<p style="margin:0 0 8px;color:#8c6a1a;font-size:12px;font-weight:bold;letter-spacing:2px;">CUSTOMER DETAILS</p>
<div style="height:1px;background:#e4d5a4;"></div>
${details}
<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 0;">
<tr><td align="center" style="background:#d4af37;border-radius:6px;">
<a href="${buttonHref}" style="display:inline-block;padding:14px 28px;color:#111111;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:1px;">${buttonLabel}</a>
</td></tr>
</table>
<p style="margin:28px 0 0;color:#777777;font-size:14px;line-height:1.7;text-align:center;">${note}</p>
</td>
</tr>
<tr>
<td align="center" style="background:#111111;padding:22px 20px;border-top:3px solid #d4af37;">
<p style="margin:0;color:#d4af37;font-family:Georgia,serif;font-size:16px;">Crafted Through Generations</p>
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
    '<p style="margin:28px 0 8px;color:#8c6a1a;font-size:12px;font-weight:bold;letter-spacing:2px;">INQUIRY DETAILS</p><div style="height:1px;background:#e4d5a4;"></div>',
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
  const href = productHref(data.category)

  return {
    subject: `New Jewellery Inquiry — ${data.name || 'Customer'}`,
    html: inquiryCard({
      preview,
      eyebrow: 'NEW CUSTOMER INQUIRY',
      title: 'New Jewellery Inquiry',
      intro: 'A customer has contacted you through the Kandyan Handicraft Center website.',
      details: inquiryDetails(data),
      buttonLabel: 'VIEW PRODUCT',
      buttonHref: href,
      note: 'Received from the Kandyan Handicraft Center website.<br />Just reply to this email to respond directly to the customer.',
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
  const logo = `${siteOrigin()}/images/logo-elephant.png`
  const href = productHref(data.category)
  const preview = 'We have received your jewellery inquiry and will get back to you shortly.'
  const photos = attachedPhotoCopy(data)

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f5f1e8;font-family:Arial,Helvetica,sans-serif;">
${previewBlock(preview)}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1e8;padding:30px 10px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
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
<tr><td style="padding:22px;">
<p style="margin:0 0 15px;color:#b58a24;font-size:12px;font-weight:bold;letter-spacing:2px;">YOUR INQUIRY</p>
${receiptLine('Product', escapeHtml(data.product || data.subject || ''))}
${receiptLine('Material', escapeHtml(data.material || ''))}
${receiptLine('Category', escapeHtml(data.category || ''))}
${receiptLine('Message', messageHtml(data.message || ''))}
${photos ? receiptLine('Photos', photos) : ''}
</td></tr>
</table>
<table cellpadding="0" cellspacing="0" align="center">
<tr><td align="center" style="background:#d4af37;border-radius:6px;">
<a href="${href}" style="display:inline-block;padding:14px 28px;color:#111111;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;">VIEW OUR COLLECTIONS</a>
</td></tr>
</table>
<p style="text-align:center;color:#777777;margin:35px 0 0;font-size:14px;">Need assistance? Reply to this email and we'll be happy to help.</p>
</td>
</tr>
<tr>
<td align="center" style="background:#111111;padding:30px 20px;">
<p style="color:#d4af37;margin:0 0 8px;font-family:Georgia,serif;font-size:16px;">Crafted through generations.</p>
<p style="color:#d4af37;margin:0 0 20px;font-family:Georgia,serif;font-size:16px;">Created especially for you.</p>
<p style="color:#aaaaaa;font-size:12px;line-height:1.7;margin:0;">Kandyan Handicraft Center<br />${escapeHtml('Castle Lane, Bogambara, Kandy, Sri Lanka')}<br />Gold • Silver • Gems • Traditional Jewellery</p>
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`

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
      '',
      href,
    ]
      .filter((line) => line !== '')
      .join('\n'),
  }
}

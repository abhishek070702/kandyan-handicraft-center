import { json } from '../lib/admin-auth.js'
import { enquiryStore, photoKey, writeMessage } from '../lib/enquiries.js'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

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
    photos.push({
      contentType: value.type || 'application/octet-stream',
      bytes: new Uint8Array(await value.arrayBuffer()),
    })
  }
  return photos
}

export default async function saveEnquiry(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405)
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

  let photos
  try {
    photos = await readPhotos(form)
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : 'Could not attach the photos.' },
      400,
    )
  }

  const id = crypto.randomUUID()
  const message = {
    id,
    ...fields,
    createdAt: new Date().toISOString(),
    photoCount: photos.length,
    replies: [],
  }

  try {
    const store = enquiryStore()
    await Promise.all(
      photos.map((photo, index) =>
        store.set(photoKey(id, index), photo.bytes, {
          metadata: { contentType: photo.contentType },
        }),
      ),
    )
    await writeMessage(message)
  } catch (error) {
    console.error('Could not save enquiry', error)
    return json(
      { ok: false, error: 'We could not save your message. Please use WhatsApp or email us directly.' },
      502,
    )
  }

  return json({ ok: true })
}

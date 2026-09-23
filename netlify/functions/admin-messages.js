import { json, requireAdmin } from '../lib/admin-auth.js'
import { listMessages } from '../lib/enquiries.js'

export default async function adminMessages(request) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed.' }, 405)
  }

  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const messages = await listMessages()
    return json({ ok: true, messages })
  } catch (error) {
    console.error('Could not list messages', error)
    return json({ ok: false, error: 'Could not load messages.' }, 500)
  }
}

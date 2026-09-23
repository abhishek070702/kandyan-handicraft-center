import { clearAdminCookie, json } from '../lib/admin-auth.js'

export default async function adminLogout(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405)
  }
  return json({ ok: true }, 200, { 'set-cookie': clearAdminCookie() })
}

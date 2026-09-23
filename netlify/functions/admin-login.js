import { adminCookie, json } from '../lib/admin-auth.js'

export default async function adminLogin(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405)
  }

  const code = process.env.SHOP_REPLY_CODE
  if (!code) {
    return json({ ok: false, error: 'Admin access is not ready yet.' }, 500)
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return json({ ok: false, error: 'Could not read the sign-in.' }, 400)
  }

  if (String(form.get('code') || '') !== code) {
    return json({ ok: false, error: 'That code is not correct.' }, 401)
  }

  return json({ ok: true }, 200, { 'set-cookie': adminCookie(60 * 60 * 12) })
}

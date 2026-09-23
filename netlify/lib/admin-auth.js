import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'khc_admin'

function secret() {
  return process.env.SHOP_REPLY_CODE || ''
}

export function adminToken() {
  return createHmac('sha256', secret()).update('kandyan-admin-v1').digest('hex')
}

export function isAdmin(request) {
  const expected = secret() ? adminToken() : ''
  const given = readCookie(request)
  if (!expected || given.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

export function adminCookie(maxAge) {
  return `${COOKIE}=${adminToken()}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
}

export function clearAdminCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
}

function readCookie(request) {
  const raw = request.headers.get('cookie') || ''
  const part = raw
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE}=`))
  return part ? part.slice(COOKIE.length + 1) : ''
}

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  })
}

export function requireAdmin(request) {
  if (!secret()) {
    return json({ ok: false, error: 'Admin access is not ready yet.' }, 500)
  }
  if (!isAdmin(request)) {
    return json({ ok: false, error: 'Sign in required.' }, 401)
  }
  return null
}

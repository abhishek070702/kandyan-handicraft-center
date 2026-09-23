import { isAdmin } from '../lib/admin-auth.js'
import { enquiryStore, photoKey, replyPhotoKey } from '../lib/enquiries.js'

export default async function adminPhoto(request) {
  if (!isAdmin(request)) {
    return new Response('Sign in required.', { status: 401 })
  }

  const url = new URL(request.url)
  const id = url.searchParams.get('id') || ''
  const index = Number(url.searchParams.get('n'))
  const replyIndex = url.searchParams.get('reply')
  const reply = replyIndex == null || replyIndex === '' ? null : Number(replyIndex)
  const validId = /^[a-zA-Z0-9-]{8,80}$/.test(id)
  const validIndex = Number.isInteger(index) && index >= 0 && index <= 2
  const validReply = reply == null || (Number.isInteger(reply) && reply >= 0 && reply < 40)
  if (!validId || !validIndex || !validReply) {
    return new Response('Not found.', { status: 404 })
  }

  const key = reply == null ? photoKey(id, index) : replyPhotoKey(id, reply, index)
  const file = await enquiryStore().getWithMetadata(key, { type: 'arrayBuffer' })
  if (!file) return new Response('Not found.', { status: 404 })

  const type = file.metadata?.contentType || 'application/octet-stream'
  return new Response(file.data, {
    headers: {
      'content-type': type,
      'cache-control': 'private, no-store',
    },
  })
}

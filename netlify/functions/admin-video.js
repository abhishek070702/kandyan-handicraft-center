import { isAdmin } from '../lib/admin-auth.js'
import { enquiryStore, replyVideoKey, videoKey } from '../lib/enquiries.js'

export default async function adminVideo(request) {
  if (!isAdmin(request)) {
    return new Response('Sign in required.', { status: 401 })
  }

  const url = new URL(request.url)
  const id = url.searchParams.get('id') || ''
  const replyIndex = url.searchParams.get('reply')
  const reply = replyIndex == null || replyIndex === '' ? null : Number(replyIndex)
  const validId = /^[a-zA-Z0-9-]{8,80}$/.test(id)
  const validReply = reply == null || (Number.isInteger(reply) && reply >= 0 && reply < 40)
  if (!validId || !validReply) return new Response('Not found.', { status: 404 })

  const key = reply == null ? videoKey(id) : replyVideoKey(id, reply)
  const file = await enquiryStore().getWithMetadata(key, { type: 'arrayBuffer' })
  if (!file) return new Response('Not found.', { status: 404 })

  return new Response(file.data, {
    headers: {
      'content-type': file.metadata?.contentType || 'video/mp4',
      'cache-control': 'private, no-store',
    },
  })
}

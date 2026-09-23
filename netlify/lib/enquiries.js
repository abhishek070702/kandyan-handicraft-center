import { getStore } from '@netlify/blobs'

const PREFIX = 'msg/'

export function enquiryStore() {
  return getStore({ name: 'enquiries', consistency: 'strong' })
}

export function messageKey(id) {
  return `${PREFIX}${id}`
}

export function photoKey(id, index) {
  return `photo/${id}/${index}`
}

export function replyPhotoKey(id, replyIndex, photoIndex) {
  return `reply/${id}/${replyIndex}/${photoIndex}`
}

export function videoKey(id) {
  return `video/${id}`
}

export function replyVideoKey(id, replyIndex) {
  return `reply-video/${id}/${replyIndex}`
}

export async function listMessages() {
  const store = enquiryStore()
  const { blobs } = await store.list({ prefix: PREFIX })
  const messages = []

  for (const blob of blobs) {
    const message = await store.get(blob.key, { type: 'json' })
    if (message) messages.push(message)
  }

  messages.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  return messages
}

export async function readMessage(id) {
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(String(id || ''))) return null
  return enquiryStore().get(messageKey(id), { type: 'json' })
}

export async function writeMessage(message) {
  await enquiryStore().setJSON(messageKey(message.id), message)
}

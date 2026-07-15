export const WHATSAPP_NUMBER = '94779516105'

/**
 * Short pre-fill — client only taps Send.
 * Note: emojis are omitted — WhatsApp Desktop often replaces them with ◈
 * when text comes from a wa.me / api.whatsapp.com link.
 */
const CUSTOM_ORDER_MESSAGE =
  'Hi *Kandyan Handicraft Center*,\n\n' +
  'Can I create a custom jewellery piece with *my own design*?'

export function getWhatsAppUrl(text) {
  // api.whatsapp.com is more reliable than wa.me for pre-filled text
  const base = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`
  if (!text) return base
  return `${base}&text=${encodeURIComponent(text)}`
}

export function getCustomOrderWhatsAppUrl() {
  return getWhatsAppUrl(CUSTOM_ORDER_MESSAGE)
}

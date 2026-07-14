const TROY_OUNCE_GRAMS = 31.1034768
/** In Sri Lanka, "pound" / පවුම (pawn) = 8 grams (also called sovereign). */
const PAWN_GRAMS = 8
const CACHE_KEY = 'khc-metal-rates-v3-pawn'
const CACHE_MS = 10 * 60 * 1000

function formatLkr(value) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(value)
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (Date.now() - cached.fetchedAt > CACHE_MS) return null
    return cached
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

/**
 * Sri Lanka jewellery rate method:
 * 1) International spot USD per troy ounce
 * 2) Convert to LKR per gram: (USD/oz ÷ 31.1034768) × USD/LKR
 * 3) 22K = 24K × (22/24)
 * 4) 1 pound/පවුම = 8 grams
 */
async function fetchMetalRates() {
  const cached = readCache()
  if (cached) return { ...cached, fromCache: true }

  const [metalsRes, fxRes] = await Promise.all([
    fetch('https://aurumrates.com/api/v1/spot?metals=gold,silver'),
    fetch('https://open.er-api.com/v6/latest/USD'),
  ])

  if (!metalsRes.ok || !fxRes.ok) {
    throw new Error('Unable to load live metal rates')
  }

  const metals = await metalsRes.json()
  const fx = await fxRes.json()

  const usdToLkr = fx?.rates?.LKR
  const goldOzUsd = metals?.data?.gold?.price
  const silverOzUsd = metals?.data?.silver?.price
  const goldChange = metals?.data?.gold?.change_pct
  const silverChange = metals?.data?.silver?.change_pct

  if (!usdToLkr || !goldOzUsd || !silverOzUsd) {
    throw new Error('Incomplete rate data')
  }

  const gold24kPerGram = (goldOzUsd / TROY_OUNCE_GRAMS) * usdToLkr
  const gold22kPerGram = gold24kPerGram * (22 / 24)
  const silverPerGram = (silverOzUsd / TROY_OUNCE_GRAMS) * usdToLkr

  const payload = {
    gold24kPerGram,
    gold22kPerGram,
    silverPerGram,
    gold24kPerPound: gold24kPerGram * PAWN_GRAMS,
    gold22kPerPound: gold22kPerGram * PAWN_GRAMS,
    silverPerPound: silverPerGram * PAWN_GRAMS,
    goldChange,
    silverChange,
    usdToLkr,
    goldOzUsd,
    silverOzUsd,
    fetchedAt: Date.now(),
    fromCache: false,
  }

  writeCache(payload)
  return payload
}

export { fetchMetalRates, formatLkr, PAWN_GRAMS }

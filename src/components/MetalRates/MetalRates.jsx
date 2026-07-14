import { useEffect, useState } from 'react'
import { fetchMetalRates, formatLkr, PAWN_GRAMS } from '../../utils/metalRates'
import './MetalRates.css'

function changeClass(value) {
  if (value > 0) return 'metal-rates__change--up'
  if (value < 0) return 'metal-rates__change--down'
  return ''
}

function formatChange(value) {
  if (value == null || Number.isNaN(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function MetalRates() {
  const [rates, setRates] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setStatus('loading')
        const data = await fetchMetalRates()
        if (!active) return
        setRates(data)
        setStatus('ready')
        setError('')
      } catch (err) {
        if (!active) return
        setStatus('error')
        setError(err.message || 'Failed to load rates')
      }
    }

    load()
    const timer = setInterval(load, 10 * 60 * 1000)

    return () => {
      active = false
      clearInterval(timer)
    }
  }, [])

  const updatedLabel = rates
    ? new Date(rates.fetchedAt).toLocaleString('en-LK', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : ''

  return (
    <section className="metal-rates" aria-label="Live gold and silver rates Sri Lanka">
      <div className="container">
        <div className="metal-rates__header">
          <div>
            <p>Live market rates · අද රන් / රිදී මිල</p>
            <h2>Gold & Silver in Sri Lanka</h2>
          </div>
          <div className="metal-rates__meta">
            <span className="metal-rates__badge">
              Per pound (පවුම) = {PAWN_GRAMS}g
            </span>
            {status === 'ready' && <span>Updated {updatedLabel}</span>}
            {status === 'loading' && <span>Fetching live rates…</span>}
            {status === 'error' && <span>Unable to refresh rates</span>}
          </div>
        </div>

        {status === 'error' && (
          <p className="metal-rates__error">{error}. Please try again shortly.</p>
        )}

        <div className="metal-rates__grid">
          <article className="metal-rates__card metal-rates__card--gold">
            <div className="metal-rates__card-top">
              <span>24K</span>
              <p className={`metal-rates__change ${changeClass(rates?.goldChange)}`}>
                {status === 'ready' ? formatChange(rates.goldChange) : '…'}
              </p>
            </div>
            <h3>Gold 24K</h3>
            <strong>
              {status === 'ready' ? formatLkr(rates.gold24kPerPound) : 'LKR —'}
            </strong>
            <p className="metal-rates__unit">per pound · පවුමකට ({PAWN_GRAMS}g)</p>
            <p className="metal-rates__sub">
              {status === 'ready'
                ? `${formatLkr(rates.gold24kPerGram)} / gram`
                : 'LKR — / gram'}
            </p>
          </article>

          <article className="metal-rates__card metal-rates__card--gold">
            <div className="metal-rates__card-top">
              <span>22K</span>
              <p className={`metal-rates__change ${changeClass(rates?.goldChange)}`}>
                {status === 'ready' ? formatChange(rates.goldChange) : '…'}
              </p>
            </div>
            <h3>Gold 22K</h3>
            <strong>
              {status === 'ready' ? formatLkr(rates.gold22kPerPound) : 'LKR —'}
            </strong>
            <p className="metal-rates__unit">per pound · පවුමකට ({PAWN_GRAMS}g)</p>
            <p className="metal-rates__sub">
              {status === 'ready'
                ? `${formatLkr(rates.gold22kPerGram)} / gram`
                : 'LKR — / gram'}
            </p>
          </article>

          <article className="metal-rates__card metal-rates__card--silver">
            <div className="metal-rates__card-top">
              <span>Ag</span>
              <p className={`metal-rates__change ${changeClass(rates?.silverChange)}`}>
                {status === 'ready' ? formatChange(rates.silverChange) : '…'}
              </p>
            </div>
            <h3>Silver</h3>
            <strong>
              {status === 'ready' ? formatLkr(rates.silverPerPound) : 'LKR —'}
            </strong>
            <p className="metal-rates__unit">per pound · පවුමකට ({PAWN_GRAMS}g)</p>
            <p className="metal-rates__sub">
              {status === 'ready'
                ? `${formatLkr(rates.silverPerGram)} / gram`
                : 'LKR — / gram'}
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default MetalRates

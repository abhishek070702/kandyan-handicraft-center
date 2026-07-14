import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './ProductZoomModal.css'

const genderLabels = {
  men: "Men's",
  women: "Women's",
}

const MIN_SCALE = 1
const MAX_SCALE = 3

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function ProductZoomModal({ product, onClose }) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef(null)
  const dragRef = useRef({ pointerId: null, startX: 0, startY: 0, originX: 0, originY: 0 })

  const resetView = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    resetView()
  }, [product, resetView])

  useEffect(() => {
    if (!product) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === '+' || event.key === '=') {
        setScale((value) => clamp(value + 0.2, MIN_SCALE, MAX_SCALE))
      }
      if (event.key === '-') {
        setScale((value) => {
          const next = clamp(value - 0.2, MIN_SCALE, MAX_SCALE)
          if (next === 1) setOffset({ x: 0, y: 0 })
          return next
        })
      }
      if (event.key === '0') resetView()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [product, onClose, resetView])

  const handleWheel = useCallback((event) => {
    event.preventDefault()
    const direction = event.deltaY > 0 ? -0.12 : 0.12

    setScale((current) => {
      const next = clamp(current + direction, MIN_SCALE, MAX_SCALE)
      if (next <= 1) setOffset({ x: 0, y: 0 })
      return next
    })
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !product) return undefined

    stage.addEventListener('wheel', handleWheel, { passive: false })
    return () => stage.removeEventListener('wheel', handleWheel)
  }, [handleWheel, product])

  const handlePointerDown = (event) => {
    if (scale <= 1) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId) return
    const deltaX = event.clientX - dragRef.current.startX
    const deltaY = event.clientY - dragRef.current.startY
    setOffset({
      x: dragRef.current.originX + deltaX,
      y: dragRef.current.originY + deltaY,
    })
  }

  const handlePointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    dragRef.current.pointerId = null
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetView()
      return
    }
    setScale(2.2)
  }

  const zoomIn = () => setScale((value) => clamp(value + 0.25, MIN_SCALE, MAX_SCALE))
  const zoomOut = () => {
    setScale((value) => {
      const next = clamp(value - 0.25, MIN_SCALE, MAX_SCALE)
      if (next === 1) setOffset({ x: 0, y: 0 })
      return next
    })
  }

  if (!product) return null

  const genderLabel = product.gender ? genderLabels[product.gender] : null
  const zoomPercent = Math.round(scale * 100)
  const categorySlug = product.categorySlug || ''
  const productPath = categorySlug
    ? `/collections/${categorySlug}?product=${product.id}`
    : '/collections'
  const productUrl = `${window.location.origin}${productPath}`
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${window.location.origin}${product.image}`
  const enquireText =
    `Hi Kandyan Handicraft Center, I would like to enquire about "${product.name}".\n\n` +
    `Jewellery photo:\n${imageUrl}\n\n` +
    `View on website:\n${productUrl}`

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/94779516105?text=${encodeURIComponent(enquireText)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleEnquire = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const extension = blob.type.split('/')[1] || 'png'
      const file = new File([blob], `${product.name}.${extension}`, {
        type: blob.type || 'image/png',
      })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: product.name,
          text: enquireText,
        })
        return
      }
    } catch {
      // Fall back to WhatsApp text + image link below.
    }

    openWhatsApp()
  }

  return createPortal(
    <div
      className="product-zoom"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} preview`}
      onClick={onClose}
    >
      <div className="product-zoom__panel" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="product-zoom__close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>

        <div className="product-zoom__layout">
          <div
            ref={stageRef}
            className={`product-zoom__media${scale > 1 ? ' is-zoomed' : ''}${isDragging ? ' is-dragging' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
          >
            <div
              className="product-zoom__stage-inner"
              style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-zoom__image"
                draggable={false}
              />
            </div>

            <div className="product-zoom__controls">
              <button type="button" onClick={zoomOut} aria-label="Zoom out">
                −
              </button>
              <span>{zoomPercent}%</span>
              <button type="button" onClick={zoomIn} aria-label="Zoom in">
                +
              </button>
              <button type="button" onClick={resetView} aria-label="Reset zoom">
                Reset
              </button>
            </div>

            <p className="product-zoom__hint">Scroll · Double-click · Drag</p>
          </div>

          <div className="product-zoom__info">
            {genderLabel && (
              <span className="product-zoom__badge">{genderLabel}</span>
            )}
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <button
              type="button"
              className="product-zoom__cta"
              onClick={handleEnquire}
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ProductZoomModal

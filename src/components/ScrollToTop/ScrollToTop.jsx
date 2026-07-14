import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    const wasCollections = previousPath.current.startsWith('/collections')
    const isCollections = pathname.startsWith('/collections')

    if (wasCollections && isCollections) {
      previousPath.current = pathname
      return
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })

    previousPath.current = pathname
  }, [pathname])

  return null
}

export default ScrollToTop

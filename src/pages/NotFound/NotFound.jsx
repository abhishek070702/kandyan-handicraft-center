import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <main className="not-found">
      <div className="container not-found__inner">
        <p className="not-found__code">404</p>
        <h1>Page not found</h1>
        <p className="not-found__lead">
          That address does not match a page on our site. The piece you are
          looking for may have moved.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="not-found__primary">
            Back to Home
          </Link>
          <Link to="/collections" className="not-found__ghost">
            View Collections
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound

import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AppRoutes />
      {!isAdmin && <Footer />}
    </>
  )
}

export default App
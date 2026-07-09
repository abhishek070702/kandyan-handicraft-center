import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Collections from '../pages/Collections/Collections'
import Gems from '../pages/Gems/Gems'
import Gallery from '../pages/Gallery/Gallery'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/gems" element={<Gems />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default AppRoutes
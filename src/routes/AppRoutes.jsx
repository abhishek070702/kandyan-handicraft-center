import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Collections from '../pages/Collections/Collections'
import Gems from '../pages/Gems/Gems'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/gems" element={<Gems />} />
    </Routes>
  )
}

export default AppRoutes
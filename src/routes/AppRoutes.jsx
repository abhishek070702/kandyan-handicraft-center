import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Collections from '../pages/Collections/Collections'
import CollectionsLayout from '../pages/Collections/CollectionsLayout'
import CollectionCategory from '../pages/Collections/CollectionCategory'
import Gems from '../pages/Gems/Gems'
import GemDetail from '../pages/Gems/GemDetail'
import Gallery from '../pages/Gallery/Gallery'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy'
import TermsConditions from '../pages/TermsConditions/TermsConditions'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<CollectionsLayout />}>
        <Route index element={<Collections />} />
        <Route path=":slug" element={<CollectionCategory />} />
      </Route>
      <Route path="/gems" element={<Gems />} />
      <Route path="/gems/:slug" element={<GemDetail />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsConditions />} />
    </Routes>
  )
}

export default AppRoutes

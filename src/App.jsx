import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Philosophy from './components/Philosophy'
import Lab from './components/Lab'
import ProductShowcase from './components/ProductShowcase'
import SalonSystem from './components/SalonSystem'
import Partners from './components/Partners'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CheckoutPage from './components/Checkoutpage'

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Philosophy />
      <Lab />
      <ProductShowcase />
      <SalonSystem />
      <Partners />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout/:productId" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
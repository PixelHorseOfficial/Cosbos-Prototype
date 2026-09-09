import React, { useState, useEffect, useRef } from 'react'
import './Header.css'

const Header = ({ heroWrapperRef }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    if (!heroWrapperRef?.current) return

    // Use Intersection Observer to detect when hero section leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If hero is NO LONGER visible (has scrolled out), mark as scrolled
        setIsScrolled(!entry.isIntersecting)
      },
      {
        threshold: 0.1 // Trigger when 90% of hero has scrolled out
      }
    )

    observer.observe(heroWrapperRef.current)
    return () => observer.disconnect()
  }, [heroWrapperRef])

  // Update header class
  useEffect(() => {
    if (headerRef.current) {
      if (isScrolled) {
        headerRef.current.classList.add('scrolled')
      } else {
        headerRef.current.classList.remove('scrolled')
      }
    }
  }, [isScrolled])

  // Update menu-open class
  useEffect(() => {
    if (headerRef.current) {
      if (menuOpen) {
        headerRef.current.classList.add('menu-open')
      } else {
        headerRef.current.classList.remove('menu-open')
      }
    }
  }, [menuOpen])

  return (
    <header className="header" ref={headerRef}>
      <div className="header-inner">
        <div className="logo">
          <div className="logo-mark">COSBOS</div>
          <div className="logo-sub">PROFESSIONALS</div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <a href="#about" className="nav-link">
            <span className="nav-link-text" data-text="ABOUT">ABOUT</span>
          </a>
          <a href="#system" className="nav-link">
            <span className="nav-link-text" data-text="SYSTEM">SYSTEM</span>
          </a>
          <a href="#products" className="nav-link">
            <span className="nav-link-text" data-text="PRODUCTS">PRODUCTS</span>
          </a>
          <a href="#partners" className="nav-link">
            <span className="nav-link-text" data-text="PARTNERS">PARTNERS</span>
          </a>
          <a href="#contact" className="nav-cta">
            <span>PARTNER WITH US</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className="nav-mobile">
        <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
        <a href="#system" onClick={() => setMenuOpen(false)}>SYSTEM</a>
        <a href="#products" onClick={() => setMenuOpen(false)}>PRODUCTS</a>
        <a href="#partners" onClick={() => setMenuOpen(false)}>PARTNERS</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>PARTNER WITH US</a>
      </nav>
    </header>
  )
}

export default Header
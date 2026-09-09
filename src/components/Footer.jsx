import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">COSBOS</div>
          <div className="footer-tagline">Professionals</div>
          <p>Luxury Salon Science — Formaldehyde Free • Professional Grade • Structural Integrity. Engineering the future of treatment integrity.</p>
        </div>
        <div className="footer-links">
          <div className="link-group"><span>SYSTEM</span><a href="#system">Salon Protocol</a><a href="#products">Retail Rituals</a><a href="#about">Lab Notes</a></div>
          <div className="link-group"><span>PARTNERS</span><a href="#partners">Verified Salons</a><a href="#contact">Partner Verification</a><a href="#">Education</a></div>
          <div className="link-group"><span>LEGAL</span><a href="#">LLPIN ABC-8663</a><a href="#">GSTIN Registered</a><a href="#">©2024 COSBOS Professionals</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>Designed by Pixel Horse - Hyderabad </span><span>Raipur C.G. • Lab to Salon • No Marketplace Dilution</span></div>
    </footer>
  )
}
export default Footer

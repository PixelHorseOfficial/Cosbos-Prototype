import React from 'react'
import './About.css'

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-grid">
        <div className="about-media">
          <video
            className="about-video"
            src="/images/about-video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="about-right">
          <div className="section-number">ABOUT</div>
          <h2 className="about-title">
            Exploring systems —<br/>Salon & Retail
          </h2>
          <p className="about-lead">
            COSBOS Professionals is a science-driven brand dedicated to the evolution of hair care. 
            We exist where cosmetic chemistry meets professional artistry.
          </p>
          <div className="about-quote-block">
            <blockquote>
              “The future of treatment integrity is not about coating hair — it is about rebuilding it from within.”
            </blockquote>
            <cite>— COSBOS Lab, Raipur C.G.</cite>
          </div>
          <div className="about-stats">
            <div className="about-stat-row">
              <h4>Our Origin</h4>
              <p>We formulate in small, controlled batches. Every ingredient ratio is logged, pH is locked, stability is tested at 40°C / 75% humidity. This is luxury salon science.</p>
            </div>
            <div className="about-stat-row">
              <h4>Professional Only</h4>
              <p>Verified salon distribution across India. LLPIN ABC-8663, GSTIN registered. Direct lab-to-salon chain, no marketplace dilution.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default About
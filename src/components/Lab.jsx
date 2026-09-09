import React from 'react'
import './Lab.css'
const Lab = () => {
  return (
    <section className="lab">
      <div className="lab-inner">
        <div className="lab-left">
          <div className="lab-image-wrap">
            <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1000&auto=format&fit=crop" alt="Lab" />
            <div className="lab-overlay"></div>
          </div>
        </div>
        <div className="lab-right">
          <div className="section-number">LAB NOTES</div>
          <h2>Small batch.<br/>Logged ratios.<br/>Locked pH.</h2>
          <p className="lab-lead">We formulate in small, controlled batches. Every ingredient ratio is logged, pH is locked, stability is tested at 40°C / 75% humidity. This is luxury salon science.</p>
          <div className="lab-specs">
            <div className="spec"><span className="spec-label">FORMALDEHYDE</span><span className="spec-value">0.00% • GC-MS Verified</span></div>
            <div className="spec"><span className="spec-label">pH DRIFT</span><span className="spec-value">&lt;0.2 • 12 Month Stability</span></div>
            <div className="spec"><span className="spec-label">BATCH SIZE</span><span className="spec-value">50L • Lab Controlled</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Lab

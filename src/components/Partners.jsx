import React, { useEffect, useRef } from 'react'
import './Partners.css'

const stats = [
  { value: 120, suffix: '+', label: 'Verified Salons' },
  { value: 18, suffix: '', label: 'Cities • Direct Lab Chain' },
  { value: 0, suffix: '', label: 'Marketplace Dilution' },
]

const cities = [
  { name: 'Raipur', detail: 'Lab HQ — Chhattisgarh' },
  { name: 'Mumbai', detail: 'Bandra, Worli' },
  { name: 'Delhi', detail: 'Shahpur Jat, GK' },
  { name: 'Bangalore', detail: 'Indiranagar' },
  { name: 'Hyderabad', detail: 'Jubilee Hills' },
  { name: 'Pune', detail: 'Koregaon Park' },
]

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const Partners = () => {
  const gridRef = useRef(null)
  const cardRefs = useRef([])
  const numberRefs = useRef([])
  const tiltState = useRef(stats.map(() => ({ rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 50, tmx: 50, tmy: 50 })))

  const textRef = useRef(null)
  const cityListRef = useRef(null)
  const cityRefs = useRef([])

  // continuous rAF loop for springy stat-card tilt + spotlight
  useEffect(() => {
    let frameId
    const loop = () => {
      tiltState.current.forEach((s, i) => {
        const card = cardRefs.current[i]
        if (!card) return
        s.rx += (s.tx - s.rx) * 0.12
        s.ry += (s.ty - s.ry) * 0.12
        s.mx += (s.tmx - s.mx) * 0.12
        s.my += (s.tmy - s.my) * 0.12
        card.style.transform = `perspective(1000px) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`
        card.style.setProperty('--mx', `${s.mx}%`)
        card.style.setProperty('--my', `${s.my}%`)
      })
      frameId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(frameId)
  }, [])

  // scroll-triggered: stagger the stat cards in, count the numbers up, then
  // reveal the paragraph text and city list once they're in view.
  useEffect(() => {
    const observers = []

    if (gridRef.current) {
      const gridObs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          gridRef.current.classList.add('in-view')

          stats.forEach((stat, i) => {
            const el = numberRefs.current[i]
            if (!el) return
            const duration = 1400
            const start = performance.now()
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1)
              const eased = easeOutExpo(progress)
              const current = Math.round(stat.value * eased)
              el.textContent = `${current}${stat.suffix}`
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          })

          gridObs.disconnect()
        },
        { threshold: 0.3 }
      )
      gridObs.observe(gridRef.current)
      observers.push(gridObs)
    }

    ;[textRef.current, cityListRef.current].forEach((el) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view')
            obs.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleCardMove = (e, i) => {
    const card = cardRefs.current[i]
    const rect = card.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    const s = tiltState.current[i]
    s.tx = (0.5 - relY) * 8
    s.ty = (relX - 0.5) * 8
    s.tmx = relX * 100
    s.tmy = relY * 100
  }

  const handleCardLeave = (i) => {
    const s = tiltState.current[i]
    s.tx = 0; s.ty = 0; s.tmx = 50; s.tmy = 50
  }

  const handleCityMove = (e, i) => {
    const row = cityRefs.current[i]
    const rect = row.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    row.style.transform = `translateX(${(relX - 0.5) * 10}px)`
  }
  const handleCityLeave = (i) => {
    cityRefs.current[i].style.transform = 'translateX(0)'
  }

  return (
    <section className="partners" id="partners">
      <div className="partners-inner">
        <div className="partners-header">
          <div className="section-number"> DISTRIBUTION</div>
          <h2>Salon Partners<br/>India</h2>
        </div>

        <div className="partners-grid" ref={gridRef}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-wrap"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div
                className="partner-stat"
                ref={(el) => (cardRefs.current[i] = el)}
                onMouseMove={(e) => handleCardMove(e, i)}
                onMouseLeave={() => handleCardLeave(i)}
              >
                <svg className="stat-border" preserveAspectRatio="none">
                  <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" pathLength="100" fill="none" />
                </svg>
                <span className="stat-number" ref={(el) => (numberRefs.current[i] = el)}>0{stat.suffix}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="partners-content">
          <div className="partners-text" ref={textRef}>
            <p>We work exclusively with verified salon partners. Distribution, education, and collaboration — built for professional integrity, not mass retail.</p>
            <p>Co-develop rituals with COSBOS lab. Feedback loops from salon floor to formulation bench. Artist-led R&D.</p>
          </div>
          <div className="partners-list">
            <div className="partners-list-title">PARTNER CITIES — SELECT</div>
            <div className="city-list" ref={cityListRef}>
              {cities.map((c, i) => (
                <div
                  key={c.name}
                  className="city"
                  style={{ transitionDelay: `${i * 0.06}s` }}
                  onMouseMove={(e) => handleCityMove(e, i)}
                  onMouseLeave={() => handleCityLeave(i)}
                >
                  <span
                    className="city-row"
                    ref={(el) => (cityRefs.current[i] = el)}
                  >
                    <span className="city-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="city-name">{c.name}</span>
                    <span className="city-detail">{c.detail}</span>
                    <span className="city-arrow">→</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Partners
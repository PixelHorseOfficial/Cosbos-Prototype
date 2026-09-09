import React, { useEffect, useRef } from 'react'
import './Philosophy.css'

const items = [
  { num: '01', title: 'Structural Integrity', desc: 'Quiet luxury is scientific precision. Our formulation philosophy rejects shortcuts — no formaldehyde, no compromise on internal hair architecture. Each molecule is placed with intent.', tag: 'Bond Science' },
  { num: '02', title: 'Professional Grade', desc: 'Concentration calibrated for licensed professionals. High-active actives, low pH drift, predictable results under salon heat.', tag: 'Lab Locked' },
  { num: '03', title: 'Rebuild, Not Coat', desc: 'Protects disulfide bonds during thermal realignment. We rebuild, not coat — ensuring internal strength after chemical services.', tag: 'Disulfide Protocol' }
]

const Philosophy = () => {
  const gridRef = useRef(null)
  const cardRefs = useRef([])
  const tagRefs = useRef([])
  const state = useRef(items.map(() => ({
    rx: 0, ry: 0, tx: 0, ty: 0,       // current / target tilt (deg)
    mx: 50, my: 50, tmx: 50, tmy: 50, // current / target spotlight position (%)
    tagX: 0, tagY: 0, tTagX: 0, tTagY: 0, // current / target magnetic tag offset (px)
  })))

  // continuous rAF loop: lerps every card's current values toward their targets
  // every frame, so motion is smooth and springy instead of snapping to the
  // mouse and relying on a CSS transition to catch up.
  useEffect(() => {
    let frameId
    const loop = () => {
      state.current.forEach((s, i) => {
        const card = cardRefs.current[i]
        const tag = tagRefs.current[i]
        if (!card) return

        s.rx += (s.tx - s.rx) * 0.12
        s.ry += (s.ty - s.ry) * 0.12
        s.mx += (s.tmx - s.mx) * 0.12
        s.my += (s.tmy - s.my) * 0.12
        s.tagX += (s.tTagX - s.tagX) * 0.18
        s.tagY += (s.tTagY - s.tagY) * 0.18

        card.style.transform = `perspective(1200px) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`
        card.style.setProperty('--mx', `${s.mx}%`)
        card.style.setProperty('--my', `${s.my}%`)
        card.style.setProperty('--depth', `${(Math.abs(s.rx) + Math.abs(s.ry)) / 10}`)
        if (tag) tag.style.transform = `translate(${s.tagX}px, ${s.tagY}px)`
      })
      frameId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(frameId)
  }, [])

  // scroll-triggered entrance, staggered per card
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          grid.classList.add('in-view')
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  const handleMove = (e, i) => {
    const card = cardRefs.current[i]
    const rect = card.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    const s = state.current[i]

    s.tx = (0.5 - relY) * 10
    s.ty = (relX - 0.5) * 10
    s.tmx = relX * 100
    s.tmy = relY * 100
    s.tTagX = (relX - 0.5) * 16
    s.tTagY = (relY - 0.5) * 12
  }

  const handleLeave = (i) => {
    const s = state.current[i]
    s.tx = 0; s.ty = 0
    s.tmx = 50; s.tmy = 50
    s.tTagX = 0; s.tTagY = 0
  }

  return (
    <section className="philosophy">
      <video
        className="philosophy-bg-video"
        src="/images/Video-Project-6.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="philosophy-header">
        <div className="phil-left">
          <div className="section-number"> PHILOSOPHY</div>
          <h2>Luxury is precision,<br/>not excess.</h2>
        </div>
      </div>

      <div className="philosophy-grid" ref={gridRef}>
        {items.map((item, i) => (
          <div
            key={item.num}
            className="phil-card-wrap"
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div
              className="phil-card"
              data-num={item.num}
              ref={(el) => (cardRefs.current[i] = el)}
              onMouseMove={(e) => handleMove(e, i)}
              onMouseLeave={() => handleLeave(i)}
            >
              <svg className="phil-border" preserveAspectRatio="none">
                <rect
                  className="phil-border-rect"
                  x="1" y="1"
                  width="calc(100% - 2px)" height="calc(100% - 2px)"
                  pathLength="100"
                  fill="none"
                />
              </svg>

              <div className="phil-card-top">
                <span className="phil-num">{item.num}</span>
                <span
                  className="phil-tag"
                  ref={(el) => (tagRefs.current[i] = el)}
                >
                  {item.tag}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
export default Philosophy
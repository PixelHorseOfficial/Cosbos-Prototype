import React, { useEffect, useRef } from 'react'
import './SalonSystem.css'

const STEPS = [
  {
    num: '01',
    img: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800&auto=format&fit=crop',
    overlay: 'STEP 01 — PREP & BOND',
    title: '01 — Bond Reset',
    desc: 'Low pH pre-treatment to open cuticle without damage. Prepares disulfide bonds for realignment.',
    meta: '15 MIN • pH 3.5',
  },
  {
    num: '02',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    overlay: 'STEP 02 — THERMAL REALIGNMENT',
    title: '02 — Structure Lock',
    desc: 'Active serum with keratin-mimetic peptides. Heat-activated, formaldehyde-free straightening.',
    meta: '50 MIN • 180°C MAX',
  },
  {
    num: '03',
    img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
    overlay: 'STEP 03 — SEAL & SHIELD',
    title: '03 — Integrity Seal',
    desc: 'Acidic rinse locks internal structure. Leaves signature COSBOS aroma, glass finish.',
    meta: '25 MIN • FINISH',
  },
]

const MAX_TILT = 6        // degrees, kept restrained — cinematic, not gimmicky
const MAX_PARALLAX = 20   // px, image drift
const TILT_DAMP = 0.09    // lower = slower / heavier / more "cinematic" catch-up
const IMG_DAMP = 0.05     // image trails the card slightly for a parallax-depth feel

const SalonSystem = () => {
  const topRef = useRef(null)
  const stepsWrapRef = useRef(null)
  const stepRefs = useRef([])
  const imgRefs = useRef([])

  // motion state lives in refs so the RAF loop never touches React state
  const state = useRef(
    STEPS.map(() => ({
      targetPx: 0.5, targetPy: 0.5,
      px: 0.5, py: 0.5,
      imgPx: 0.5, imgPy: 0.5,
    }))
  )

  // Scroll-triggered reveal: top copy, connecting line, then cards in sequence
  useEffect(() => {
    const targets = [topRef.current, stepsWrapRef.current].filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  // Continuous RAF loop: eases current position toward target position every
  // frame instead of snapping to the cursor — this is what makes the tilt
  // feel weighted and cinematic instead of mechanical.
  useEffect(() => {
    let raf
    const tick = () => {
      state.current.forEach((s, i) => {
        const card = stepRefs.current[i]
        const img = imgRefs.current[i]
        if (!card) return

        s.px += (s.targetPx - s.px) * TILT_DAMP
        s.py += (s.targetPy - s.py) * TILT_DAMP
        s.imgPx += (s.targetPx - s.imgPx) * IMG_DAMP
        s.imgPy += (s.targetPy - s.imgPy) * IMG_DAMP

        const rotateX = (0.5 - s.py) * MAX_TILT
        const rotateY = (s.px - 0.5) * MAX_TILT

        card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`
        card.style.setProperty('--mx', `${s.px * 100}%`)
        card.style.setProperty('--my', `${s.py * 100}%`)

        if (img) {
          const moveX = (s.imgPx - 0.5) * MAX_PARALLAX
          const moveY = (s.imgPy - 0.5) * MAX_PARALLAX
          img.style.setProperty('--px', `${-moveX}px`)
          img.style.setProperty('--py', `${-moveY}px`)
        }
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleMove = (index) => (e) => {
    const card = stepRefs.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    state.current[index].targetPx = (e.clientX - rect.left) / rect.width
    state.current[index].targetPy = (e.clientY - rect.top) / rect.height
  }

  const handleLeave = (index) => () => {
    state.current[index].targetPx = 0.5
    state.current[index].targetPy = 0.5
  }

  return (
    <section className="system" id="system">
      <div className="system-top reveal-block" ref={topRef}>
        <div className="system-label reveal-mask">
          <span>SALON SYSTEM</span>
        </div>
        <div className="system-title-wrap">
          <h2 className="reveal-mask reveal-mask--delay-1">
            <span>90-min in-salon protocol, 3-step</span>
          </h2>
          <p className="reveal-mask reveal-mask--delay-2">
            <span>Professional use only — education & certification required</span>
          </p>
        </div>
      </div>

      <div className="system-steps" ref={stepsWrapRef}>
        {STEPS.map((s, i) => (
          <div
            className="step-wrap"
            key={s.num}
            style={{ transitionDelay: `${i * 0.18}s` }}
          >
            <div
              className="step"
              data-num={s.num}
              ref={(el) => (stepRefs.current[i] = el)}
              onMouseMove={handleMove(i)}
              onMouseLeave={handleLeave(i)}
            >
              <svg className="step-border" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="0.5" y="0.5" width="99" height="99" fill="none" pathLength="1" />
              </svg>

              <div className="step-image">
                <img
                  ref={(el) => (imgRefs.current[i] = el)}
                  src={s.img}
                  alt={`Step ${s.num}`}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                />
                <div className="step-overlay">
                  <span>{s.overlay}</span>
                </div>
              </div>

              <div className="step-info">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <span className="step-tag">{s.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SalonSystem
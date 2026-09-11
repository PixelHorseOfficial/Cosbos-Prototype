import React, { useRef, useEffect, useState } from 'react'
import './Hero.css';
import Header from './Header';

// ---- Image sequence config ----
const FRAME_FOLDER = '/images/Video-project-7'; // adjust if you move the folder
const TOTAL_FRAMES = 191; // 0001.png ...0191.png
const frameSrc = (i) => `${FRAME_FOLDER}/${String(i + 1).padStart(4, '0')}.png`;

// How much scroll distance (in viewport heights) it takes to play through
// the whole sequence. Higher = slower scrub. Tweak to taste.
const SCRUB_VH = 600;

// How quickly the displayed frame catches up to the scroll-derived target
// frame, each animation tick. Lower = smoother/slower catch-up (more of a
// "trailing" feel), higher = snappier and closer to 1:1 with scroll input.
const SMOOTHING = 0.12;

const Hero = () => {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const displayFrameRef = useRef(0)
  const rafIdRef = useRef(null)
  const lastPercentRef = useRef(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  // existing mouse-tracking effect (kept as-is)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleMouse = (e) => {
      const rect = el.getBoundingClientRect()

      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--mx', `${x}%`)
      el.style.setProperty('--my', `${y}%`)
    }
    el.addEventListener('mousemove', handleMouse)
    return () => el.removeEventListener('mousemove', handleMouse)
  }, [])

  // preload the image sequence
  useEffect(() => {
    let cancelled = false
    let loadedCount = 0
    const imgs = new Array(TOTAL_FRAMES)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      const handleDone = () => {
        loadedCount++
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100)
        if (!cancelled && percent !== lastPercentRef.current) {
          lastPercentRef.current = percent
          setLoadProgress(percent)
        }
        if (!cancelled && loadedCount === TOTAL_FRAMES) setImagesLoaded(true)
      }
      img.onload = handleDone
      img.onerror = handleDone // don't let one missing frame block the whole sequence
      imgs[i] = img
    }
    imagesRef.current = imgs

    return () => { cancelled = true }
  }, [])

  // draw a given frame index onto the canvas, covering it like object-fit: cover
  const drawFrame = (index) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || !img.naturalWidth) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const targetW = Math.round(rect.width * dpr)
    const targetH = Math.round(rect.height * dpr)

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const canvasW = rect.width
    const canvasH = rect.height
    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = canvasW / canvasH

    let drawW, drawH, offsetX, offsetY
    if (imgRatio > canvasRatio) {
      drawH = canvasH
      drawW = drawH * imgRatio
      offsetX = (canvasW - drawW) / 2
      offsetY = 0
    } else {
      drawW = canvasW
      drawH = drawW / imgRatio
      offsetX = 0
      offsetY = (canvasH - drawH) / 2
    }

    ctx.clearRect(0, 0, canvasW, canvasH)
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  }

  // scroll-linked frame update
  useEffect(() => {
    if (!imagesLoaded) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Recompute which frame the current scroll position corresponds to.
    // This only sets the *target* — the rAF loop below eases toward it.
    const updateTarget = () => {
      const rect = wrapper.getBoundingClientRect()
      const scrollDistance = wrapper.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollDistance, 1))
      const progress = scrollDistance > 0 ? scrolled / scrollDistance : 0
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1)
    }

    // Runs every animation frame (not just on scroll events) so the
    // displayed frame glides toward the target instead of jumping to it.
    const animate = () => {
      const target = targetFrameRef.current
      const current = displayFrameRef.current
      const diff = target - current
      const next = Math.abs(diff) < 0.05 ? target : current + diff * SMOOTHING
      displayFrameRef.current = next

      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(next)))
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }
      rafIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    updateTarget()
    drawFrame(0) // draw the initial frame immediately, before easing kicks in
    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [imagesLoaded])

  return (
    <>
      <Header heroWrapperRef={wrapperRef} />
      <div className="hero-scroll-wrapper" ref={wrapperRef} style={{ height: `${SCRUB_VH}vh` }}>
        <section className="hero" ref={containerRef} id="hero">
          <div className={`hero-loading ${imagesLoaded ? 'is-hidden' : ''}`} aria-live="polite" aria-busy={!imagesLoaded}>
            <div className="hero-loading-inner">
              <span className="hero-loading-label">COSBOS</span>
              <div className="hero-loading-bar">
                <div className="hero-loading-fill" style={{ width: `${loadProgress}%` }} />
              </div>
              <span className="hero-loading-percent">{loadProgress}%</span>
            </div>
          </div>
          <div className="hero-bg">
            <div className="hero-gradient"></div>
            <canvas className="hero-canvas" ref={canvasRef} />
          </div>
          <div className="hero-content">
            <div className="hero-eyebrow">
              {/* Salon System — Professional protocol active */}
            </div>
            <h1 className="hero-title">
              {/* <span>Luxury</span>
              <span>Salon</span>
              <span className="outline">Science</span> */}
            </h1>
            <div className="hero-bottom">
              <p className="hero-desc">
                COSBOS Professionals is a science-driven brand dedicated to the evolution of hair care.
                We exist where cosmetic chemistry meets professional artistry.
              </p>
              <div className="hero-actions">
                <a href="#system" className="btn-primary">Explore System</a>
                <a href="#contact" className="btn-ghost">Verified Partners Only</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default Hero
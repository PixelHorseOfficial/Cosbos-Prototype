import React, { useRef, useEffect, useState } from 'react'
import './Hero.css';
import Header from './Header';

// ---- Image sequence config ----
const FRAME_FOLDER = '/images/Video%20Project%205'; // adjust if you move the folder
const TOTAL_FRAMES = 959; // 0001.png ...0959.png
const frameSrc = (i) => `${FRAME_FOLDER}/${String(i + 1).padStart(4, '0')}.png`;

// How much scroll distance (in viewport heights) it takes to play through
// the whole sequence. Higher = slower scrub. Tweak to taste.
const SCRUB_VH = 400;

const Hero = () => {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const currentFrameRef = useRef(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

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
      img.onload = () => {
        loadedCount++
        if (!cancelled && loadedCount === TOTAL_FRAMES) setImagesLoaded(true)
      }
      img.onerror = () => {
        // don't let one missing frame block the whole sequence
        loadedCount++
        if (!cancelled && loadedCount === TOTAL_FRAMES) setImagesLoaded(true)
      }
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

    let ticking = false

    const update = () => {
      const rect = wrapper.getBoundingClientRect()
      const scrollDistance = wrapper.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollDistance, 1))
      const progress = scrollDistance > 0 ? scrolled / scrollDistance : 0
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      )
      if (frameIndex !== currentFrameRef.current || progress === 0) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }
      ticking = false
    }

    const onScrollOrResize = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    update() // draw the initial frame

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [imagesLoaded])

  return (
    <>
      <Header heroWrapperRef={wrapperRef} />
      <div className="hero-scroll-wrapper" ref={wrapperRef} style={{ height: `${SCRUB_VH}vh` }}>
        <section className="hero" ref={containerRef} id="hero">
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
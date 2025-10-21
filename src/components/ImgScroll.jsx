import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'

export default function ImgScroll({
  imageSrc = 'https://via.placeholder.com/800x600?text=Image',
  imageAlt = 'Placeholder Image',
  brandText = 'HOMBURG',
}) {
  const heroSectionRef = useRef(null)
  const imageRef = useRef(null)
  const placeholderRef = useRef(null)

  const [isTransitioning, setIsTransitioning] = useState(false)

  const imageX = useMotionValue(0)
  const imageY = useMotionValue(0)
  const imageScale = useMotionValue(1)

  const { scrollY } = useScroll()
  const { scrollYProgress: section1ScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end end'],
  })

  const scrollDrivenY = useTransform(section1ScrollProgress, [0, 1], [0, 500])

  useEffect(() => {
    let unsubscribe
    if (!isTransitioning) {
      unsubscribe = scrollDrivenY.onChange((value) => imageY.set(value))
    }
    return () => unsubscribe && unsubscribe()
  }, [isTransitioning, scrollDrivenY, imageY])

  useEffect(() => {
    const checkTransition = () => {
      if (!placeholderRef.current) return

      const rect = placeholderRef.current.getBoundingClientRect()
      const triggerPoint = window.innerHeight * 0.75

      const isVisible = rect.top < triggerPoint && rect.bottom > 0

      if (isVisible && !isTransitioning) {
        setIsTransitioning(true)
      } else if (!isVisible && isTransitioning) {
        setIsTransitioning(false)
      }
    }

    const unsubscribe = scrollY.onChange(checkTransition)
    checkTransition()
    return () => unsubscribe && unsubscribe()
  }, [isTransitioning, scrollY])

  useEffect(() => {
    const transition = { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }

    if (isTransitioning) {
      if (imageRef.current && placeholderRef.current) {
        const imageRect = imageRef.current.getBoundingClientRect()
        const placeholderRect = placeholderRef.current.getBoundingClientRect()

        const targetCenterX = placeholderRect.left + placeholderRect.width / 2
        const targetCenterY = placeholderRect.top + placeholderRect.height / 2
        const imageCenterX = imageRect.left + imageRect.width / 2
        const imageCenterY = imageRect.top + imageRect.height / 2

        const newX = imageX.get() + (targetCenterX - imageCenterX)
        const newY = imageY.get() + (targetCenterY - imageCenterY)

        animate(imageX, newX, transition)
        animate(imageY, newY, transition)
      }
    } else {
      animate(imageX, 0, transition)
      animate(imageScale, 1, transition)
    }
  }, [isTransitioning, imageX, imageY, imageScale])

  return (
    <div className="imgscroll-root">
      <style>{`
        .imgscroll-hero {
          position: relative;
          min-height: 200vh;
          width: 100%;
          z-index: 7;
          background: #b9fd65;
        }

        .imgscroll-sticky {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .imgscroll-brand {
          position: absolute;
          font-size: clamp(4rem, 15vw, 12rem);
          font-weight: 900;
          color: #000000;
          letter-spacing: 0.1em;
          z-index: 1;
          pointer-events: none;
          user-select: none;
          margin: 0;
          line-height: 1;
          white-space: nowrap;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -130%);
        }

        .imgscroll-image-container {
          position: relative;
          z-index: 10;
          width: 90%;
          max-width: 600px;
        }

        .imgscroll-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .imgscroll-content-wrapper {
          position: relative;
          background: #ffffff;
          z-index: 5;
        }

        .imgscroll-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          align-content: center;
        }

        .imgscroll-content-left {
          padding: 2rem;
          padding-top: 2rem;
        }

        .imgscroll-content-left h2 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #000000;
          margin-bottom: 2rem;
          line-height: 1.2;
        }

        .imgscroll-content-left p {
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          color: #333;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .imgscroll-content-right {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 800px;
          position: relative;
          padding-top: 0;
          border-radius: 20px;
          z-index: 6;
          outline: 2px dashed #ddd;
          outline-offset: -10px;
          background: #fafafa;
        }

        @media (max-width: 900px) {
          .imgscroll-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="imgscroll-hero" ref={heroSectionRef}>
        <div className="imgscroll-sticky">
          <h1 className="imgscroll-brand">{brandText}</h1>
          <motion.div
            ref={imageRef}
            className="imgscroll-image-container"
            style={{ x: imageX, y: imageY, scale: imageScale, transformOrigin: 'top left' }}
          >
            <img src={imageSrc} alt={imageAlt} className="imgscroll-image" />
          </motion.div>
        </div>
      </section>

      <div className="imgscroll-content-wrapper">
        <div className="imgscroll-content">
          <div className="imgscroll-content-left">
            <h2>Our Story</h2>
            <p>
              This is placeholder content. Scroll to see the image drift and dock into the
              right column below when it becomes visible.
            </p>
            <p>
              You can replace this text and the placeholder image by passing props to the
              component or customizing the markup.
            </p>
          </div>
          <div className="imgscroll-content-right" ref={placeholderRef} />
        </div>
      </div>
    </div>
  )
}



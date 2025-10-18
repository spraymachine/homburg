/**
 * HorizontalMenu Component
 * Horizontal scroll menu for Homburg burgers
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

// Burger menu items
const burgers = [
  { 
    id: 1, 
    name: 'FlameTang Chicken',
    description: 'Spicy chicken patty with our signature FlameTang sauce, crispy lettuce, and jalapeños',
    price: '₹249',
    color: '#b9fd65', // Red/Orange from brand
    emoji: '🔥'
  },
  { 
    id: 2, 
    name: 'Classic Chicken',
    description: 'Juicy grilled chicken breast, fresh lettuce, tomatoes, and mayo on a toasted bun',
    price: '₹199',
    color: '#fff', // Tan/Beige from brand
    emoji: '🍗'
  },
  { 
    id: 3, 
    name: 'Classic Fish',
    description: 'Crispy fish fillet with tangy tartar sauce, lettuce, and pickles',
    price: '₹229',
    color: '#b9fd65', // Green from brand
    emoji: '🐟'
  },
  { 
    id: 4, 
    name: 'Veggie Delight',
    description: 'Plant-based patty loaded with fresh veggies, avocado, and our special herb sauce',
    price: '₹179',
    color: '#fff', // Dark Brown from brand
    emoji: '🥗'
  },
]

const styles = {
  menuSection: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  menuTitle: {
    position: 'absolute',
    top: '10vh',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 900,
    color: '#000',
    zIndex: 200,
    textAlign: 'center',
    letterSpacing: '0.05em',
    marginBottom: '3rem',
  },
  panelsWrapper: {
    display: 'flex',
    height: '100%',
    width: 'max-content',
    willChange: 'transform',
    transform: 'translate3d(0, 0, 0)',
  },
  panel: {
    width: '100vw',
    height: '100vh',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '2rem',
    paddingTop: '14rem',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '3rem',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    border: '2px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '1rem',
    minHeight: '520px',
  },
  emoji: {
    fontSize: 'clamp(4rem, 10vw, 8rem)',
    marginBottom: '1rem',
    display: 'block',
    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
  },
  burgerName: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 900,
    color: '#000',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  description: {
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    color: '#333',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  price: {
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: 800,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1.25rem',
    height: '48px',
    borderRadius: '50px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: '#45CC2D',
    textAlign: 'center',
    lineHeight: 1,
  },
  orderButton: {
    padding: '0 1.75rem',
    height: '48px',
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    fontWeight: 700,
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    fontFamily: 'inherit',
    backgroundColor: '#45CC2D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    minHeight: '48px',
  },
  panelNumber: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem',
    fontSize: 'clamp(6rem, 15vw, 12rem)',
    fontWeight: 900,
    opacity: 0.1,
    userSelect: 'none',
    lineHeight: 1,
  },
  progressBar: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '1rem',
    zIndex: 100,
    padding: '1rem',
    borderRadius: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  scrollHint: {
    position: 'absolute',
    bottom: '6rem',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.9rem',
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    zIndex: 100,
    fontWeight: 600,
  },
}

const HorizontalMenu = () => {
  const menuRef = useRef(null)
  const panelsRef = useRef(null)
  const panelRefs = useRef([])

  useEffect(() => {
    const panels = panelsRef.current
    const menu = menuRef.current

    if (!panels || !menu) return

    // Calculate the total scroll distance needed
    const totalPanelWidth = panels.scrollWidth - window.innerWidth

    // Create the main horizontal scroll animation
    const scrollTween = gsap.to(panels, {
      x: -totalPanelWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: menu,
        start: 'top top',
        end: () => `+=${totalPanelWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Animate each panel's content
    panelRefs.current.forEach((panel) => {
      if (!panel) return

      const card = panel.querySelector('.burger-card')
      
      if (card) {
        gsap.fromTo(
          card,
          {
            scale: 0.8,
            opacity: 0,
            y: 50,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left center',
              end: 'center center',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={menuRef} style={styles.menuSection}>
      <h2 style={styles.menuTitle}>OUR MENU</h2>
      
      <div ref={panelsRef} style={styles.panelsWrapper}>
        {burgers.map((burger, index) => (
          <div
            key={burger.id}
            ref={(el) => (panelRefs.current[index] = el)}
            style={{
              ...styles.panel,
              backgroundColor: burger.color,
            }}
          >
            <div className="burger-card" style={styles.card}>
              <span style={styles.emoji}>{burger.emoji}</span>
              <h3 style={styles.burgerName}>{burger.name}</h3>
              <p style={styles.description}>{burger.description}</p>
              <div style={styles.actionsRow}>
                <div style={styles.price}>{burger.price}</div>
                <button 
                  style={{
                    ...styles.orderButton,
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>

            {/* Panel number indicator */}
            <div style={styles.panelNumber}>
              {burger.id}
            </div>
          </div>
        ))}
      </div>

  

     
    </div>
  )
}

export default HorizontalMenu


import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import './App.css';
import burgerImage from './assets/Gourmet Hamburger on Red Background-Photoroom.png';
import yummyImage from './assets/yummy.png';
import homemadeImage from './assets/homemade.png';
import HorizontalMenu from './HorizontalMenu';
import Contact from './Contact';

// GSAP temporarily removed to resolve dev server 504 import errors

function App() {
  const heroSectionRef = useRef(null); // This is section1Ref
  const aboutUsSectionRef = useRef(null); // This is section2Ref
  const burgerRef = useRef(null); // This is imageRef
  const placeholderRef = useRef(null); // This is placeholderRef

  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const imageScale = useMotionValue(1);

  const { scrollY } = useScroll();

  const { scrollYProgress: section1ScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"]
  });

  const scrollDrivenY = useTransform(
    section1ScrollProgress,
    [0, 1],
    [0, 500] 
  );

  useEffect(() => {
    let unsubscribe;
    if (!isTransitioning) {
      unsubscribe = scrollDrivenY.onChange(v => imageY.set(v));
    }
    return () => unsubscribe && unsubscribe();
  }, [isTransitioning, scrollDrivenY, imageY]);

  useEffect(() => {
    const checkTransition = () => {
      // Trigger docking when the right column (placeholder) is entering the viewport
      if (!placeholderRef.current) return;

      const rect = placeholderRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.75;

      const isVisible = rect.top < triggerPoint && rect.bottom > 0;

      if (isVisible && !isTransitioning) {
        setIsTransitioning(true);
      } else if (!isVisible && isTransitioning) {
        setIsTransitioning(false);
      }
    };

    const unsubscribe = scrollY.onChange(checkTransition);
    // Run once on mount to set initial state
    checkTransition();
    return () => unsubscribe();
  }, [isTransitioning, scrollY]);

  useEffect(() => {
    const transition = { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] };
    
    if (isTransitioning) {
      if (burgerRef.current && placeholderRef.current) {
        const imageRect = burgerRef.current.getBoundingClientRect();
        const placeholderRect = placeholderRef.current.getBoundingClientRect();

        // Move burger to the CENTER of the placeholder (content-right)
        const targetCenterX = placeholderRect.left + (placeholderRect.width / 2);
        const targetCenterY = placeholderRect.top + (placeholderRect.height / 2);
        const imageCenterX = imageRect.left + (imageRect.width / 2);
        const imageCenterY = imageRect.top + (imageRect.height / 2);

        const newX = imageX.get() + (targetCenterX - imageCenterX);
        const newY = imageY.get() + (targetCenterY - imageCenterY);
        
        animate(imageX, newX, transition);
        animate(imageY, newY, transition);
        // Keep current scale; adjust later if needed
      }
    } else {
        animate(imageX, 0, transition);
        animate(imageScale, 1, transition);
    }
  }, [isTransitioning, imageX, imageY, imageScale]);

  return (
    <div className="App">
      <div className="hero-section" ref={heroSectionRef}>
        <div className="sticky-container">
          <h1 className="brand-text">HOMBURG</h1>
          <motion.div
            ref={burgerRef}
            className="burger-container"
            style={{
              x: imageX,
              y: imageY,
              scale: imageScale,
              transformOrigin: 'top left'
            }}
          >
            <img src={burgerImage} alt="Gourmet Burger" className="burger-image" />
          </motion.div>
        </div>
        <img src={yummyImage} alt="Yummy" className="yummy-image" />
        <img src={homemadeImage} alt="Homemade" className="homemade-image" />
      </div>
      
      <div className="content-wrapper shapedividers_com-2036">
        <div className="content-container" ref={aboutUsSectionRef}>
          <div className="content-left">
            <h2>Our Story</h2>
            <p>
              At Homburg, we believe that every burger tells a story. Our journey began
              with a simple mission: to create the most delicious, high-quality burgers
              that bring joy to every bite. Each ingredient is carefully selected,
              every patty perfectly seasoned, and all burgers made fresh to order.
            </p>
            <p>
              From our cloud kitchen to your door, we're committed to delivering
              not just food, but an experience. Whether it's a quick lunch or a
              special dinner, Homburg brings gourmet quality right to your table.
            </p>
          </div>
          <div className="content-right" ref={placeholderRef}>
            {/* Burger lands here after scroll */}
          </div>
        </div>
      </div>


      {/* Horizontal Scroll Menu */}
      <HorizontalMenu />

      {/* Contact Form */}
      <Contact />
    </div>
  );
}

export default App;


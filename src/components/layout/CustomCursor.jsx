import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Slow follower for outer ring
  const slowConfig = { damping: 30, stiffness: 120, mass: 0.8 };
  const slowX = useSpring(cursorX, slowConfig);
  const slowY = useSpring(cursorY, slowConfig);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-hover], .hmw-card, .solution-card, .quote-card, .artifact-img-wrap, .rca-card');
      setIsHovering(!!target);
    };

    const onMouseDown = (e) => {
      setIsClicking(true);
      // Ripple effect
      const id = Date.now();
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    };
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      {/* Dot */}
      {/* Dot — white + mix-blend-mode:difference = inverts to dark on light, light on dark */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 12 : 8,
          height: isHovering ? 12 : 8,
          background: '#ffffff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
      {/* Outer ring */}
      <motion.div
        style={{
          x: slowX,
          y: slowY,
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 44 : 30,
          height: isHovering ? 44 : 30,
          border: '1.5px solid #ffffff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          scale: isClicking ? 0.82 : 1,
          transition: 'width 0.3s, height 0.3s, scale 0.1s',
        }}
      />
      {/* Click ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            left: r.x,
            top: r.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            border: '1px solid rgba(115,0,113,0.6)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 99997,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          from { width: 0; height: 0; opacity: 1; }
          to { width: 80px; height: 80px; opacity: 0; }
        }
        /* Ensure recharts SVG doesn't show default cursor */
        .recharts-wrapper, .recharts-wrapper svg, .recharts-wrapper * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}

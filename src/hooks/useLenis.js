import { useEffect, useRef } from 'react';

export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    let lenis;
    
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
        });
        lenisRef.current = lenis;

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch (e) {
        // Lenis not available, graceful fallback
        console.warn('Lenis not available, using native scroll');
      }
    };

    initLenis();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return lenisRef;
}

import { useEffect, useRef } from 'react';

/**
 * Canvas-based floating particle field — tiny drifting dots.
 * Fully GPU-efficient: only uses fillRect + globalAlpha.
 * Respects prefers-reduced-motion (skips loop entirely).
 */
export default function FloatingParticles({
  color = '#ffffff',
  count = 28,
  maxOpacity = 0.14,
  speed = 0.18,
  minSize = 0.8,
  maxSize = 2.4,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({ particles: [], w: 0, h: 0 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let isVisible = false;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        // Kickstart the loop again if it became visible
        if (!rafRef.current) loop();
      }
    });
    if (canvas.parentElement) io.observe(canvas.parentElement);

    const init = (w, h) => {
      stateRef.current.w = w;
      stateRef.current.h = h;
      stateRef.current.particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed * 0.55,
        r: minSize + Math.random() * (maxSize - minSize),
        o: Math.random() * maxOpacity,
        od: Math.random() > 0.5 ? 1 : -1,
        os: 0.0008 + Math.random() * 0.002,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      init(rect.width, rect.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const loop = () => {
      const { particles, w, h } = stateRef.current;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.o += p.od * p.os;
        if (p.o >= maxOpacity) { p.o = maxOpacity; p.od = -1; }
        if (p.o <= 0.015)      { p.o = 0.015;      p.od =  1; }
        if (p.x < -4)  p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4)  p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        ctx.globalAlpha = p.o;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (isVisible) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };

    if (isVisible) loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
    };
  }, [color, count, maxOpacity, speed, minSize, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

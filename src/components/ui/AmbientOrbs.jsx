import { useMemo } from 'react';

// Seeded pseudo-random for stable SSR/hydration
const makeRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

/**
 * Slow-drifting blurred colour orbs — purely decorative background layer.
 * Sits at z-index 0, pointer-events none.
 */
export default function AmbientOrbs({
  colors = ['#730071', '#DC9596', '#390040'],
  count = 5,
  maxOpacity = 0.18,
  minSize = 180,
  maxSize = 480,
  seed = 7,
}) {
  const orbs = useMemo(() => {
    const rand = makeRand(seed);
    return Array.from({ length: count }, (_, i) => ({
      color: colors[i % colors.length],
      size: minSize + rand() * (maxSize - minSize),
      left: 10 + rand() * 80,   // 10–90%
      top: 5 + rand() * 90,    // 5–95%
      duration: 28 + rand() * 32,
      delay: -(rand() * 30),
      animIndex: (i % 3) + 1,
    }));
  }, [colors, count, maxOpacity, minSize, maxSize, seed]);

  return (
    <>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
      >
        {orbs.map((orb, i) => (
          <div
            key={i}
            className="ambient-orb"
            style={{
              position: 'absolute',
              // Use radial-gradient instead of filter:blur — avoids Firefox's
              // per-frame CPU blur recomposition on animated elements.
              width: orb.size * 2.2,
              height: orb.size * 2.2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              opacity: maxOpacity * 1.4,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              transform: 'translate(-50%, -50%)',
              animation: `orbFloat${orb.animIndex} ${orb.duration}s ${orb.delay}s ease-in-out infinite`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          30%       { transform: translate(-50%, -50%) translate(22px, -18px); }
          65%       { transform: translate(-50%, -50%) translate(-14px, 22px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          40%       { transform: translate(-50%, -50%) translate(-28px, 12px); }
          72%       { transform: translate(-50%, -50%) translate(18px, -24px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          22%       { transform: translate(-50%, -50%) translate(16px, 18px); }
          78%       { transform: translate(-50%, -50%) translate(-22px, -12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-orb { animation: none !important; }
        }
      `}</style>
    </>
  );
}

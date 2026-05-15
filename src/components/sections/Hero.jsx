import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCountUp } from '../../hooks/useCountUp';

const HERO_STATS = [
  { value: '5–7×', label: 'Home price to annual income ratio in Hyderabad', source: 'NHB 2024', color: '#C2C094' },
  { value: 73, suffix: '%', label: 'Of income consumed by housing for informal residents', source: 'Primary research', color: '#DC9596' },
  { value: 36, label: 'Root causes identified across all 3 personas', source: 'RCA', color: '#730071' },
  { value: 117, label: 'Ideas generated via 6-3-5 brainwriting', source: 'Ideation', color: '#A9A587' },
];

function StatCard({ stat, index, started }) {
  const numericVal = typeof stat.value === 'number' ? stat.value : null;
  const count = useCountUp(numericVal || 0, 2000 + index * 200, started && numericVal !== null);
  const displayVal = numericVal !== null ? `${count}${stat.suffix || ''}` : stat.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '32px 28px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '2px',
        background: stat.color,
      }} />
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(32px, 3.5vw, 48px)',
        color: '#fff',
        lineHeight: 1,
        marginBottom: 10,
      }}>
        {displayVal}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.03em',
        lineHeight: 1.45,
        marginBottom: 8,
      }}>
        {stat.label}
      </div>
      <div style={{
        fontSize: '10px',
        fontFamily: "'DM Mono', monospace",
        color: stat.color,
        opacity: 0.7,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {stat.source}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [heroRef, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { scrollY } = useScroll();
  const rightY = useTransform(scrollY, [0, 600], [0, -60]);

  const handleScrollDown = (e) => {
    e.preventDefault();
    document.getElementById('topic')?.scrollIntoView({ behavior: 'smooth' });
  };

  const titleLines = ['The', 'Housing', 'Crisis'];

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        paddingTop: '64px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left */}
      <div style={{
        padding: '80px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: '#730071',
            textTransform: 'uppercase',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#730071' }} />
          Design Thinking — Full Journey
        </motion.div>

        <div style={{ marginBottom: '24px' }}>
          {['The', 'Housing', 'Crisis'].map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(56px, 7vw, 96px)',
                lineHeight: 0.95,
                color: word === 'Housing' ? '#730071' : '#390040',
                fontStyle: word === 'Housing' ? 'italic' : 'normal',
                letterSpacing: '-2px',
                display: 'block',
              }}
            >
              {word}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            fontSize: '17px',
            color: '#7a6678',
            lineHeight: 1.7,
            marginBottom: '48px',
            maxWidth: '440px',
            fontWeight: 300,
          }}
        >
          A design thinking project exploring how middle-class buyers, informal residents, and urban renters navigate a broken housing system — and what we can do about it.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          href="#topic"
          onClick={handleScrollDown}
          data-hover
          whileHover={{ x: 4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            background: '#390040',
            color: '#fff',
            padding: '16px 32px',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            width: 'fit-content',
            transition: 'background 0.25s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#730071'}
          onMouseLeave={e => e.currentTarget.style.background = '#390040'}
        >
          Begin the journey
          <span style={{ fontSize: '18px' }}>↓</span>
        </motion.a>
      </div>

      {/* Right */}
      <motion.div
        style={{
          background: '#390040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px',
          y: rightY,
        }}
      >
        {/* Noise texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(115,0,113,0.3) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1,
        }}>
          {HERO_STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} started={inView} />
          ))}
        </div>
      </motion.div>

      {/* Mobile: hide hero right */}
      <style>{`
        @media (max-width: 768px) {
          #hero { grid-template-columns: 1fr !important; }
          #hero > div:last-child { display: none; }
          #hero > div:first-child { padding: 60px 24px !important; }
        }
      `}</style>
    </section>
  );
}

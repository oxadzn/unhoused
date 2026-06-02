import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCountUp } from '../../hooks/useCountUp';
import AmbientOrbs from '../ui/AmbientOrbs';
import FloatingParticles from '../ui/FloatingParticles';

const HERO_STATS = [
  { value: '5–7×', label: 'Home price to income ratio', source: 'NHB 2024', color: '#C2C094', trend: '↑ Every year since 2010' },
  { value: 73, suffix: '%', label: 'Income on housing — informal residents', source: 'Primary research', color: '#DC9596', trend: '↑ Was 52% in 2018' },
  { value: 36, label: 'Root causes identified across 3 personas', source: 'RCA', color: '#730071', trend: 'Systemic — not individual' },
  { value: 117, label: 'Ideas generated via 6-3-5 brainwriting', source: 'Ideation', color: '#A9A587', trend: '7 priority solutions shortlisted' },
];

const TICKER_ITEMS = [
  { label: 'Median 2BHK rent — Madhapur', val: '₹24,000/mo' },
  { label: 'Housing price growth since 2010', val: '+278%' },
  { label: 'Wage growth in same period', val: '+48%' },
  { label: 'Families at EMI overextension risk', val: '1 in 3' },
  { label: 'Informal residents with no housing claim', val: '4.2 lakh' },
  { label: 'Average deposit — Gachibowli 2BHK', val: '₹72,000' },
  { label: 'Days to process PMAY application', val: '90–400' },
  { label: 'Urban renters who cannot save', val: '68%' },
];

function StatCard({ stat, index, started }) {
  const numericVal = typeof stat.value === 'number' ? stat.value : null;
  const count = useCountUp(numericVal || 0, 2000 + index * 200, started && numericVal !== null);
  const displayVal = numericVal !== null ? `${count}${stat.suffix || ''}` : stat.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: stat.color }} />

      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(28px, 3vw, 44px)',
        color: '#fff',
        lineHeight: 1,
        marginBottom: 8,
      }}>
        {displayVal}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', lineHeight: 1.45, marginBottom: 10 }}>
        {stat.label}
      </div>
      <div style={{
        fontSize: '10px',
        fontFamily: "'DM Mono', monospace",
        color: stat.color,
        opacity: 0.8,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {stat.trend}
      </div>
      <div style={{
        position: 'absolute', bottom: 8, right: 10,
        fontFamily: "'DM Mono', monospace",
        fontSize: '9px',
        color: 'rgba(255,255,255,0.18)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {stat.source}
      </div>
    </motion.div>
  );
}

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="hero-ticker" role="marquee" aria-label="Housing data feed">
      <div className="hero-ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="hero-ticker-item">
            <span className="hero-ticker-dot" aria-hidden="true" />
            {item.label}
            <span className="hero-ticker-val">{item.val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CityscapeSVG() {
  return (
    <svg
      className="hero-cityscape"
      viewBox="0 0 800 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Background buildings */}
      <rect x="0" y="120" width="40" height="80" fill="#fff" />
      <rect x="5" y="100" width="30" height="20" fill="#fff" />
      <rect x="45" y="90" width="55" height="110" fill="#fff" />
      <rect x="55" y="70" width="35" height="20" fill="#fff" />
      <rect x="105" y="130" width="30" height="70" fill="#fff" />
      <rect x="140" y="60" width="70" height="140" fill="#fff" />
      <rect x="148" y="40" width="20" height="20" fill="#fff" />
      <rect x="165" y="50" width="20" height="10" fill="#fff" />
      <rect x="215" y="110" width="45" height="90" fill="#fff" />
      <rect x="265" y="80" width="60" height="120" fill="#fff" />
      <rect x="272" y="60" width="10" height="20" fill="#fff" />
      <rect x="330" y="50" width="80" height="150" fill="#fff" />
      <rect x="340" y="30" width="20" height="20" fill="#fff" />
      <rect x="370" y="20" width="10" height="30" fill="#fff" />
      <rect x="415" y="100" width="35" height="100" fill="#fff" />
      <rect x="455" y="70" width="50" height="130" fill="#fff" />
      <rect x="465" y="50" width="15" height="20" fill="#fff" />
      <rect x="510" y="85" width="45" height="115" fill="#fff" />
      <rect x="560" y="55" width="65" height="145" fill="#fff" />
      <rect x="575" y="35" width="20" height="20" fill="#fff" />
      <rect x="630" y="110" width="30" height="90" fill="#fff" />
      <rect x="665" y="75" width="55" height="125" fill="#fff" />
      <rect x="675" y="55" width="10" height="20" fill="#fff" />
      <rect x="725" y="90" width="40" height="110" fill="#fff" />
      <rect x="770" y="130" width="30" height="70" fill="#fff" />
      {/* Windows hint */}
      <rect x="148" y="75" width="6" height="4" fill="rgba(255,200,100,0.3)" />
      <rect x="160" y="75" width="6" height="4" fill="rgba(255,200,100,0.3)" />
      <rect x="148" y="85" width="6" height="4" fill="rgba(255,200,100,0.2)" />
      <rect x="340" y="60" width="6" height="4" fill="rgba(255,200,100,0.3)" />
      <rect x="352" y="55" width="5" height="4" fill="rgba(255,200,100,0.2)" />
    </svg>
  );
}

export default function Hero() {
  const [heroRef, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { scrollY } = useScroll();
  const rightY = useTransform(scrollY, [0, 600], [0, -60]);

  const handleScrollDown = (e) => {
    e.preventDefault();
    document.getElementById('reality')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      aria-label="Introduction"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        paddingTop: '64px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Left Panel ── */}
      <div style={{
        padding: '80px 64px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Eyebrow */}
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
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#730071' }} aria-hidden="true" />
          Design Thinking · Hyderabad Housing Crisis
        </motion.div>

        {/* Main title */}
        <div style={{ marginBottom: '20px' }}>
          {['For most', 'families,', 'home is out of reach.'].map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px, 5.5vw, 76px)',
                lineHeight: 0.98,
                color: i === 1 ? '#730071' : '#390040',
                fontStyle: i === 1 ? 'italic' : 'normal',
                letterSpacing: '-2px',
                display: 'block',
              }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.7 }}
          style={{
            fontSize: '16px',
            color: '#7a6678',
            lineHeight: 1.75,
            marginBottom: '40px',
            maxWidth: '420px',
            fontWeight: 300,
          }}
        >
          A design thinking investigation into why housing in Hyderabad fails middle-class buyers, informal residents, and urban renters — and what human-centred solutions actually look like.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.6 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <motion.a
            href="#reality"
            onClick={handleScrollDown}
            data-hover
            whileHover={{ x: 4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              background: '#390040',
              color: '#fff',
              padding: '16px 36px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'background 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#730071'}
            onMouseLeave={e => e.currentTarget.style.background = '#390040'}
          >
            Explore the crisis
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '18px' }}
              aria-hidden="true"
            >→</motion.span>
          </motion.a>

          {/* PDF Report Button */}
          <motion.a
            id="pdf-report-btn"
            href="/design-thinking-report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(115,0,113,0.18)' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(115,0,113,0.08)',
              border: '1px solid rgba(115,0,113,0.25)',
              color: '#730071',
              padding: '14px 24px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'all 0.25s',
              borderRadius: '2px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(115,0,113,0.14)';
              e.currentTarget.style.borderColor = '#730071';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(115,0,113,0.08)';
              e.currentTarget.style.borderColor = 'rgba(115,0,113,0.25)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Read the report
          </motion.a>

          <motion.a
            href="#calculator"
            onClick={e => { e.preventDefault(); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              fontSize: '12px',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#7a6678',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(122,102,120,0.3)',
              paddingBottom: '2px',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#390040'; e.currentTarget.style.borderColor = '#390040'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#7a6678'; e.currentTarget.style.borderColor = 'rgba(122,102,120,0.3)'; }}
          >
            Try the calculator ↓
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '64px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '32px',
              background: 'linear-gradient(to bottom, transparent, #730071)',
            }}
            aria-hidden="true"
          />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(57,0,64,0.35)',
          }}>Scroll</span>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <motion.div
        style={{
          background: '#390040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 48px',
          y: rightY,
        }}
      >
        {/* Ambient orbs behind everything */}
        <AmbientOrbs
          colors={['#730071', '#5a004f', '#DC9596']}
          count={4}
          maxOpacity={0.22}
          minSize={200}
          maxSize={440}
          seed={13}
        />
        {/* Floating particles */}
        <FloatingParticles
          color="#fff"
          count={30}
          maxOpacity={0.12}
          speed={0.15}
        />
        {/* Cityscape silhouette */}
        <CityscapeSVG />

        {/* Noise texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4, pointerEvents: 'none',
        }} aria-hidden="true" />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(115,0,113,0.3) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />

        {/* Stat cards */}
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

        {/* Ticker at bottom of dark panel */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <Ticker />
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          #hero { grid-template-columns: 1fr !important; min-height: auto !important; }
          #hero > div:last-child { display: none; }
          #hero > div:first-child {
            padding: 80px 24px 60px !important;
            min-height: 100vh;
          }
          #hero > div:first-child > div:last-child { left: 24px !important; }
        }
      `}</style>
    </section>
  );
}

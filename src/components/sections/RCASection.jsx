import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import Lightbox from '../ui/Lightbox';
import { staggerContainerVariants, staggerItemVariants } from '../../hooks/useInViewAnimation';
import data from '../../data/housing-data.json';

const { rootCauses } = data;

const RCA_IMAGES = [
  { src: '/images/rca_p1_suresh.jpeg', label: 'P1 — Suresh & Radha — 5 Whys Map' },
  { src: '/images/rca_p2_didi.jpeg', label: 'P2 — Didi — 5 Whys Map' },
  { src: '/images/rca_p3_priya.jpeg', label: 'P3 — Priya K. — 5 Whys Map' },
];

const CHART_DATA = rootCauses.categories.map((cat, i) => ({
  name: cat.length > 14 ? cat.slice(0, 13) + '…' : cat,
  fullName: cat,
  P1: rootCauses.byPersona.P1[i],
  P2: rootCauses.byPersona.P2[i],
  P3: rootCauses.byPersona.P3[i],
}));

const CustomRCATooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const full = rootCauses.categories[CHART_DATA.findIndex(d => d.name === label)];
  return (
    <div style={{ background: '#1A1015', color: '#fff', padding: '12px 16px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{full || label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function RCACard({ cause, index, inView }) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className="rca-card"
      whileHover={{ y: -4 }}
      data-hover
    >
      <div className="rca-persona-tag">{cause.persona} — {cause.persona === 'P1' ? 'Suresh & Radha' : cause.persona === 'P2' ? 'Didi' : 'Priya K.'}</div>
      <div className="rca-pain">{cause.pain}</div>
      <div className="rca-chain">
        {cause.chain.map((step, i) => (
          <div key={i} className="rca-step">
            <span className="rca-step-num">W{i + 1}</span>
            {step}
          </div>
        ))}
      </div>
      <div className="rca-root">
        <div className="rca-root-label">Root Cause</div>
        <div className="rca-root-text">{cause.root}</div>
      </div>
    </motion.div>
  );
}

export default function RCASection() {
  const [activePersonas, setActivePersonas] = useState({ P1: true, P2: true, P3: true });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.05, triggerOnce: true });

  const toggle = (p) => setActivePersonas(prev => ({ ...prev, [p]: !prev[p] }));

  return (
    <section id="rca" style={{ background: '#390040', padding: 'var(--section-gap) 0' }}>
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', color: '#DC9596', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span style={{ display: 'block', width: 28, height: 1, background: '#DC9596' }} />
            Phase 04
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 4vw, 56px)', color: '#fff', lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 20 }}
          >Following each pain to its root</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 620, fontWeight: 300, marginBottom: 48 }}
          >
            We applied the 5 Whys method to 12 pain points per persona — 36 chains in total — surfacing the systemic causes beneath surface-level symptoms.
          </motion.p>
        </div>

        {/* Chart toggle */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {['P1', 'P2', 'P3'].map(p => (
              <button
                key={p}
                onClick={() => toggle(p)}
                style={{
                  padding: '7px 18px',
                  fontSize: '11px',
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: `1px solid ${activePersonas[p] ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
                  background: activePersonas[p] ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activePersonas[p] ? '#fff' : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                data-hover
              >
                {p === 'P1' ? 'Suresh & Radha' : p === 'P2' ? 'Didi' : 'Priya K.'}
              </button>
            ))}
          </div>

          <ChartWrapper height={320} caption="">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CHART_DATA}
                margin={{ top: 8, right: 8, left: -16, bottom: 48 }}
                barSize={13}
                barGap={2}
                barCategoryGap="32%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace" }} angle={-40} textAnchor="end" interval={0} height={60} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                <Tooltip content={<CustomRCATooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.5)', paddingTop: '8px' }}
                />
                {activePersonas.P1 && <Bar dataKey="P1" name="P1 — Suresh & Radha" fill="#DC9596" isAnimationActive animationDuration={800} />}
                {activePersonas.P2 && <Bar dataKey="P2" name="P2 — Didi" fill="#730071" isAnimationActive animationDuration={800} />}
                {activePersonas.P3 && <Bar dataKey="P3" name="P3 — Priya K." fill="#A9A587" isAnimationActive animationDuration={800} />}
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 4 }}>
            Root cause categories across 3 personas — 36 pain chains total
          </div>
        </div>

        {/* RCA Cards */}
        <motion.div
          ref={cardsRef}
          variants={staggerContainerVariants}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '48px',
          }}
        >
          {rootCauses.topRootCauses.map((cause, i) => (
            <RCACard key={i} cause={cause} index={i} inView={cardsInView} />
          ))}
        </motion.div>

        {/* Image row */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(220,149,150,0.6)', marginBottom: 16 }}>
            5 Whys Process Artifacts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {RCA_IMAGES.map((img, i) => (
              <div
                key={img.src}
                className="artifact-img-wrap"
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <img src={img.src} alt={img.label} loading="lazy" style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
                <span className="artifact-label" style={{ background: 'rgba(57,0,64,0.85)' }}>{img.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-cutting blockquote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{
            padding: '32px 36px',
            background: 'rgba(115,0,113,0.25)',
            borderLeft: '3px solid #DC9596',
          }}
        >
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#DC9596', marginBottom: 14 }}>
            Cross-cutting insight
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#fff', lineHeight: 1.55, fontStyle: 'italic' }}>
            "{rootCauses.crossCuttingTheme}"
          </p>
        </motion.blockquote>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={RCA_IMAGES}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNav={(dir) => setLightboxIndex(i => Math.max(0, Math.min(RCA_IMAGES.length - 1, i + dir)))}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          #rca .container > div:nth-child(4) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

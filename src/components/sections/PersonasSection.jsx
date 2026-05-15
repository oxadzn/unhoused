import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import Lightbox from '../ui/Lightbox';
import data from '../../data/housing-data.json';

const { personas, emotionCurves } = data;
const STAGES = emotionCurves.stages;

const PERSONA_IMAGES = {
  P1: null, // digital only
  P2: '/images/persona_didi.jpeg',
  P3: '/images/persona_priya.jpeg',
};

const EMO_TOOLTIP = ({ active, payload, label, stageNotes }) => {
  if (!active || !payload?.length) return null;
  const idx = STAGES.indexOf(label);
  return (
    <div style={{ background: '#390040', color: '#fff', padding: '12px 16px', fontSize: '13px', maxWidth: '220px' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>Score: {payload[0]?.value > 0 ? '+' : ''}{payload[0]?.value}</div>
      {stageNotes && idx >= 0 && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>{stageNotes[idx]}</div>}
    </div>
  );
};

function EmotionCurve({ persona, visible }) {
  const pData = emotionCurves.personas.find(p => p.code === persona.code);
  if (!pData) return null;

  const chartData = STAGES.map((stage, i) => ({
    stage,
    score: pData.scores[i],
  }));

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#7a6678',
        marginBottom: 12,
      }}>
        Emotional arc across housing journey
      </div>
      <ChartWrapper height={180}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
            <defs>
              <linearGradient id={`emoGrad-${persona.code}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A9A587" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#DC9596" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,0,64,0.07)" />
            <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#7a6678' }} />
            <YAxis domain={[-10, 5]} tick={{ fontSize: 10, fill: '#7a6678' }} />
            <ReferenceLine y={0} stroke="rgba(57,0,64,0.25)" strokeDasharray="4 4" />
            <Tooltip content={<EMO_TOOLTIP stageNotes={pData.stageNotes} />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke={pData.color}
              strokeWidth={2}
              fill={`url(#emoGrad-${persona.code})`}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const col = payload.score >= 0 ? '#A9A587' : '#DC9596';
                return <circle key={cx} cx={cx} cy={cy} r={4} fill={col} stroke="none" />;
              }}
              isAnimationActive={visible}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}

function PersonaTab({ persona }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imgSrc = PERSONA_IMAGES[persona.code];
  const initial = persona.name[0];

  return (
    <motion.div
      key={persona.code}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '60px',
        alignItems: 'start',
      }}
    >
      {/* Persona card */}
      <div className="persona-card-dark">
        <div className="persona-initial" style={{ background: persona.colorLight || '#DC9596', color: '#390040' }}>
          {initial}
        </div>
        <div className="persona-name">{persona.name}</div>
        <div className="persona-type">{persona.type}</div>
        {[
          ['Age', persona.age],
          ['Occupation', persona.occupation],
          ['Income', persona.income],
          ['Location', persona.location],
          ['Tech comfort', persona.techComfort],
          ['Housing status', persona.housingStatus],
        ].map(([label, val]) => (
          <div key={label} className="persona-detail">
            <span className="persona-detail-label">{label}</span>
            <span className="persona-detail-val" style={{ textAlign: 'right', maxWidth: '60%' }}>{val}</span>
          </div>
        ))}
        <div className="persona-archetype">"{persona.archetype}"</div>

        {/* Physical card artifact (P2, P3 only) */}
        {imgSrc && (
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 8,
            }}>Persona artifact</div>
            <div
              className="artifact-img-wrap"
              onClick={() => setLightboxOpen(true)}
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <img src={imgSrc} alt={`${persona.name} persona card`} loading="lazy" style={{ width: '100%', display: 'block' }} />
              <span className="artifact-label">{persona.code} — Persona card</span>
            </div>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="persona-info">
        <h4>Core goals</h4>
        <ul className="pain-list">
          {persona.goals.map(g => <li key={g}>{g}</li>)}
        </ul>

        <h4>Key frustrations</h4>
        <ul className="pain-list">
          {persona.frustrations.map(f => <li key={f}>{f}</li>)}
        </ul>

        <h4>Observed behaviors</h4>
        <ul className="pain-list">
          {persona.behaviors.map(b => <li key={b}>{b}</li>)}
        </ul>

        <h4>Workarounds</h4>
        <ul className="pain-list">
          {persona.workarounds.map(w => <li key={w}>{w}</li>)}
        </ul>

        <EmotionCurve persona={persona} visible={true} />
      </div>

      {lightboxOpen && imgSrc && (
        <Lightbox
          images={[{ src: imgSrc, label: `${persona.code} — ${persona.name} Persona Card` }]}
          currentIndex={0}
          onClose={() => setLightboxOpen(false)}
          onNav={() => {}}
        />
      )}
    </motion.div>
  );
}

export default function PersonasSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const handleKey = (e) => {
    if (e.key === 'ArrowRight') setActiveTab(p => Math.min(p + 1, 2));
    if (e.key === 'ArrowLeft') setActiveTab(p => Math.max(p - 1, 0));
  };

  return (
    <section id="personas" onKeyDown={handleKey} tabIndex={-1}>
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Phase 03</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Three stories, one broken system</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            We distilled our research into three grounded personas, each representing a distinct housing reality in Hyderabad.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="persona-tabs-bar">
          {personas.map((p, i) => (
            <button
              key={p.code}
              className={`persona-tab-btn ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
              aria-selected={activeTab === i}
            >
              {p.code} — {p.name}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <PersonaTab key={personas[activeTab].code} persona={personas[activeTab]} />
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #personas .container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

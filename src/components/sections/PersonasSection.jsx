import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart, ReferenceArea
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import Lightbox from '../ui/Lightbox';
import data from '../../data/housing-data.json';

const { personas, emotionCurves } = data;

const DAY_IN_LIFE = {
  P1: [
    { time: '6:45am', text: 'Checks phone before getting up — salary credited. EMI debit scheduled for 7am. Holds breath.' },
    { time: '7:02am', text: 'EMI deducted. ₹62,000 gone. Remaining balance: ₹18,500 for the month.' },
    { time: '9:30am', text: 'At school. Colleague asks about the weekend trip. Makes up an excuse. Can\'t afford it.' },
    { time: '1:00pm', text: 'Skips canteen. Brought food from home. Calculates how many such days equal one month\'s grocery saving.' },
    { time: '8:30pm', text: 'Radha shows a quote for the kids\' school trip — ₹3,500. They discuss it for 20 minutes. Say they\'ll think about it.' },
    { time: '10:45pm', text: 'Opens refinancing calculator again. Same result as last month. Doesn\'t qualify. Closes laptop.' },
  ],
  P2: [
    { time: '5:00am', text: 'Wakes before the alarm. Water supply window starts at 5:15am. Fills every bucket, every pot.' },
    { time: '6:30am', text: 'Sends children to school. Counts change for their bus fare. Exact amount. No margin.' },
    { time: '9:00am', text: 'First client. Overheard two neighbours talking about a new housing scheme. Writes down the ward office number on her palm.' },
    { time: '1:30pm', text: 'Visits ward office during lunch break. Told to come back Thursday with a different form.' },
    { time: '6:00pm', text: 'Landlord calls. Rent going up ₹500 from next month. She says okay. What else is there to say?' },
    { time: '9:30pm', text: 'Children asleep on the bed — one at each end. She studies the form she picked up. Can\'t find her ration card.' },
  ],
  P3: [
    { time: '7:15am', text: 'Opens NoBroker. Same listings as last week. Two are now ₹1,000 more. Closes the app.' },
    { time: '8:45am', text: 'Metro commute — 45 minutes. Mentally calculates: ₹2,800/month on transport alone.' },
    { time: '12:30pm', text: 'Colleague\'s birthday lunch. Politely declines. Says she has a call. Eats at her desk.' },
    { time: '3:00pm', text: 'Salary credited notification. Opens banking app. Transfers ₹23,000 to rent account immediately. Doesn\'t wait.' },
    { time: '7:00pm', text: 'WhatsApp from landlord: "Lease renewal due next month. Expecting market-rate revision." She doesn\'t reply.' },
    { time: '11:00pm', text: 'Opens a savings calculator. Types in ₹5,000/month. Calculates deposit for a flat in 2 years. Closes it. Tries to sleep.' },
  ],
};

function DayInLife({ personaCode }) {
  const [open, setOpen] = useState(false);
  const moments = DAY_IN_LIFE[personaCode] || [];

  return (
    <div className="day-in-life">
      <button
        className="day-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`day-moments-${personaCode}`}
      >
        <span className={`day-toggle-icon ${open ? 'open' : ''}`} aria-hidden="true">+</span>
        A day in the life
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={`day-moments-${personaCode}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="day-moments">
              {moments.map((m, i) => (
                <motion.div
                  key={i}
                  className="day-moment"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <span className="day-time">{m.time}</span>
                  <span className="day-moment-text">{m.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
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
      <ChartWrapper height={200}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
            <defs>
              <linearGradient id={`emoGrad-${persona.code}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A9A587" stopOpacity={0.25} />
                <stop offset="50%" stopColor="#DC9596" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#DC9596" stopOpacity={0.4} />
              </linearGradient>
              {/* Danger zone fill */}
              <linearGradient id={`dangerGrad-${persona.code}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC9596" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#DC9596" stopOpacity={0.06} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,0,64,0.07)" />
            <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#7a6678' }} />
            <YAxis domain={[-10, 5]} tick={{ fontSize: 10, fill: '#7a6678' }} />
            {/* Danger zone shading below 0 */}
            <ReferenceArea y1={-10} y2={0} fill={`url(#dangerGrad-${persona.code})`} />
            <ReferenceLine y={0} stroke="rgba(220,149,150,0.4)" strokeDasharray="4 4"
              label={{ value: 'Neutral', fill: 'rgba(220,149,150,0.5)', fontSize: 9, position: 'insideTopLeft' }}
            />
            <Tooltip content={<EMO_TOOLTIP stageNotes={pData.stageNotes} />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke={pData.color}
              strokeWidth={2.5}
              fill={`url(#emoGrad-${persona.code})`}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const col = payload.score >= 0 ? '#A9A587' : '#DC9596';
                return <circle key={cx} cx={cx} cy={cy} r={5} fill={col} stroke="#fff" strokeWidth={1.5} />;
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
        <DayInLife personaCode={persona.code} />
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
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
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
        @media (max-width: 768px) {
          #personas .container > div:last-child > div:first-child { position: static !important; }
        }
      `}</style>
    </section>
  );
}

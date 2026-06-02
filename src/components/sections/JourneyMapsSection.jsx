import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lightbox from '../ui/Lightbox';
import data from '../../data/housing-data.json';

const { journeyMaps, personas } = data;

const JOURNEY_IMAGES = {
  P1: [
    { src: '/images/journey_p1_suresh_full.jpeg', label: 'P1 — Suresh & Radha — Full Journey Map' },
    { src: '/images/journey_p1_suresh.jpeg', label: 'P1 — Suresh & Radha — Empathy Map' },
  ],
  P2: [
    { src: '/images/journey_p2_didi.jpeg', label: 'P2 — Didi — Journey & Empathy Map' },
  ],
  P3: null,
};

const STAGES = ['Awareness', 'Search', 'Decision', 'Entry', 'Living', 'Crisis'];

function EmoScore({ score }) {
  const isPos = score >= 0;
  return (
    <td className={`emo-cell ${isPos ? 'emo-pos' : 'emo-neg'}`}>
      {isPos ? '+' : ''}{score}
    </td>
  );
}

function JourneyTable({ personaKey }) {
  const map = journeyMaps[personaKey];
  if (!map) return null;
  const [tableRef, tableInView] = useInView({ threshold: 0.05, triggerOnce: true });

  const rows = [
    { label: 'Actions', data: map.actions, cls: '' },
    { label: 'Touchpoints', data: map.touchpoints, cls: '' },
    { label: 'Thoughts', data: map.thoughts, cls: '' },
    { label: 'Feels', data: map.emotions, cls: '' },
    { label: 'Pain points', data: map.painPoints, cls: 'pain-cell' },
    { label: 'Opportunities', data: map.opportunities, cls: 'opp-cell' },
  ];

  return (
    <div ref={tableRef} className="journey-table-wrap">
      <table className="journey-table">
        <thead>
          <tr>
            <th style={{ width: 110 }}>Row</th>
            {STAGES.map(s => <th key={s}>{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <motion.tr
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              animate={tableInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: ri * 0.07 }}
            >
              <td className="row-label">{row.label}</td>
              {row.data.map((cell, ci) => (
                <td key={ci} className={row.cls}>
                  {typeof cell === 'string' ? cell.replace(/"/g, '') : cell}
                </td>
              ))}
            </motion.tr>
          ))}
          {/* Emotion score row */}
          <motion.tr
            initial={{ opacity: 0, x: -12 }}
            animate={tableInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: rows.length * 0.07 }}
          >
            <td className="row-label">Emotion score</td>
            {map.emotionScores.map((score, i) => (
              <EmoScore key={i} score={score} />
            ))}
          </motion.tr>
        </tbody>
      </table>
    </div>
  );
}

function JourneyTab({ personaKey }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = JOURNEY_IMAGES[personaKey];
  const map = journeyMaps[personaKey];
  const persona = personas.find(p => p.code === personaKey);

  return (
    <motion.div
      key={personaKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image artifact(s) */}
      {images ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr',
          gap: '2px',
          marginBottom: '40px',
        }}>
          {images.map((img, i) => (
            <div
              key={img.src}
              className="artifact-img-wrap"
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
              style={{ maxHeight: '480px', overflow: 'hidden' }}
            >
              <img
                src={img.src}
                alt={img.label}
                loading="lazy"
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              />
              <span className="artifact-label">{img.label}</span>
            </div>
          ))}
        </div>
      ) : (
        /* P3 placeholder */
        <div style={{
          background: '#F0EDE6',
          border: '1px solid rgba(57,0,64,0.1)',
          padding: '48px 32px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div style={{
            width: 64, height: 64,
            background: '#A9A587',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', color: '#fff',
          }}>P</div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a6678', marginBottom: 6 }}>
              Journey Map Artifact
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#390040' }}>
              Priya K. — Urban Professional Renter
            </div>
            <div style={{ fontSize: '13px', color: '#7a6678', marginTop: 6 }}>
              Journey mapped from Awareness through Crisis — see full data in the table below.
            </div>
          </div>
        </div>
      )}

      {/* Goal strip */}
      {map && (
        <div style={{
          background: '#390040',
          padding: '28px 36px',
          marginBottom: '32px',
          borderLeft: '4px solid #DC9596',
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(220,149,150,0.7)', marginBottom: 10 }}>
            {personaKey} — Journey Goal
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px',
            fontStyle: 'italic',
            color: '#fff',
            lineHeight: 1.45,
          }}>
            "{map.goal}"
          </div>
        </div>
      )}

      {/* Full data table */}
      <JourneyTable personaKey={personaKey} />

      {lightboxOpen && images && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNav={(dir) => setLightboxIndex(i => Math.max(0, Math.min(images.length - 1, i + dir)))}
        />
      )}
    </motion.div>
  );
}

export default function JourneyMapsSection() {
  const [activeTab, setActiveTab] = useState('P1');
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="journey-maps">
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Phase 03 — Journey Maps</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Tracing the path through a broken system</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            Each persona's housing journey spans six stages — from first awareness to crisis. These maps chart not just actions and touchpoints, but the emotional weight carried at every step.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="persona-tabs-bar">
          {[
            { key: 'P1', label: 'P1 — Suresh & Radha' },
            { key: 'P2', label: 'P2 — Didi' },
            { key: 'P3', label: 'P3 — Priya K.' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`persona-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <JourneyTab key={activeTab} personaKey={activeTab} />
        </AnimatePresence>
      </div>
    </section>
  );
}

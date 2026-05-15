import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import data from '../../data/housing-data.json';

const { hmwStatements } = data;

const ALL_CARDS = [
  ...hmwStatements.P1.map(c => ({ ...c, persona: 'P1' })),
  ...hmwStatements.P2.map(c => ({ ...c, persona: 'P2' })),
  ...hmwStatements.P3.map(c => ({ ...c, persona: 'P3' })),
];

const PERSONA_LABELS = {
  P1: 'P1 — Homeowner',
  P2: 'P2 — Informal Resident',
  P3: 'P3 — Urban Renter',
};

const FILTERS = ['All', 'P1', 'P2', 'P3'];

// Top-impact cards based on tripleT sweet spot HMW links
const IMPACT_IDS = new Set(['P1-1', 'P1-6', 'P2-6', 'P2-9', 'P2-11', 'P3-9']);

// Root cause short descriptions keyed by HMW id (for expand layer)
const HMW_ROOTS = {
  'P1-1': 'Housing info monetised by developers, not consumers',
  'P1-2': 'Market info scattered across 10+ disconnected sources',
  'P1-6': 'No mandatory long-term EMI stress disclosure before signing',
  'P1-7': 'Regulation designed around sale price, not ownership cost',
  'P1-10': 'No safety net for over-leveraged homeowners',
  'P2-5': 'Urban poor policy built for static, settled populations',
  'P2-6': 'State never legally recognised informal settlements',
  'P2-9': 'Transparency obligations stop at policy, not operational level',
  'P2-11': 'Housing allocation designed without grievance architecture',
  'P3-6': 'Lack of political prioritisation for renter rights',
  'P3-9': 'Free-market rental system without affordability safeguards',
  'P3-12': 'Structural policy bias toward ownership over renting',
};

export default function HMWSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const filtered = activeFilter === 'All' ? ALL_CARDS : ALL_CARDS.filter(c => c.persona === activeFilter);

  return (
    <section id="hmw">
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Phase 05</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Reframing problems as possibilities</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            We converted each root cause into an opportunity-framed "How Might We" question — a bridge from diagnosis to design. 36 questions total, 12 per persona.
          </motion.p>
        </div>

        {/* Filters + counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div className="toggle-group" style={{ marginBottom: 0 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`toggle-btn ${activeFilter === f ? 'active' : ''} ${f !== 'All' ? f.toLowerCase() : ''}`}
                data-hover
              >
                {f === 'All' ? 'Show All' : `Show ${f}`}
              </button>
            ))}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: '#7a6678',
            letterSpacing: '0.04em',
          }}>
            Showing <strong style={{ color: '#390040' }}>{filtered.length}</strong> of 36 questions
          </div>
        </div>

        {/* Cards grid */}
        <LayoutGroup>
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((card) => (
            <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(57,0,64,0.1)' }}
                  className="hmw-card"
                  data-hover
                  tabIndex={0}
                >
                  {IMPACT_IDS.has(card.id) && (
                    <div className="hmw-impact-badge" aria-label="High impact">★ High impact</div>
                  )}
                  <span className={`persona-tag ${card.persona.toLowerCase()}`}>{PERSONA_LABELS[card.persona]}</span>
                  <div className="hmw-question">{card.hmw}</div>
                  <div className="hmw-pain">{card.pain}</div>
                  {/* Hover expand layer */}
                  <div className="hmw-expand-layer" aria-hidden="true">
                    {HMW_ROOTS[card.id] && (
                      <div className="hmw-root-link">
                        Root cause: <strong>{HMW_ROOTS[card.id]}</strong>
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--purple)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em' }}>
                      → Linked to design opportunity
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Summary stat row */}
        <div style={{
          marginTop: 56,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--border)',
        }}>
          {[
            { persona: 'P1', label: 'Suresh & Radha', desc: 'HMW questions for stretched homeowners' },
            { persona: 'P2', label: 'Didi', desc: 'HMW questions for informal housing residents' },
            { persona: 'P3', label: 'Priya K.', desc: 'HMW questions for urban professional renters' },
          ].map(({ persona, label, desc }) => (
            <div key={persona} style={{ background: 'var(--off-white)', padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', color: '#390040', lineHeight: 1 }}>12</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#730071', marginTop: 6, marginBottom: 4 }}>{persona} — {label}</div>
              <div style={{ fontSize: '12px', color: '#7a6678' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #hmw .container > div:nth-child(4) > div { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          #hmw .container > div:nth-child(4) > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

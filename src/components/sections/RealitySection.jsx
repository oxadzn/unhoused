import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const REALITY_CARDS = [
  {
    tag: 'Reality — Urban Renter',
    persona: 'Priya K., 28 — Software support, Gachibowli',
    bigNum: '₹55,000',
    bigLabel: 'Monthly take-home salary',
    accent: '#DC9596',
    breakdown: [
      { label: 'Rent — 2BHK, Madhapur', val: '₹23,000', pct: 42 },
      { label: 'Commute (auto + metro)', val: '₹4,200', pct: 8 },
      { label: 'Groceries + utilities', val: '₹9,500', pct: 17 },
      { label: 'Loan repayment (education)', val: '₹7,000', pct: 13 },
      { label: 'Health, phone, misc', val: '₹5,800', pct: 11 },
    ],
    savings: { label: 'Monthly savings', val: '₹5,500', pct: 10, color: '#A9A587' },
    quote: '"Every year the rent goes up ₹2,000. My salary goes up ₹1,500. I am moving further out every 12 months."',
  },
  {
    tag: 'Reality — Informal Resident',
    persona: 'Didi, 43 — Domestic worker, Saidabad',
    bigNum: '₹10,000',
    bigLabel: 'Monthly variable income',
    accent: '#730071',
    breakdown: [
      { label: 'Rent (1 room, 4 people)', val: '₹5,500', pct: 55 },
      { label: 'Water — purchased cans', val: '₹800', pct: 8 },
      { label: 'School fees (2 children)', val: '₹1,200', pct: 12 },
      { label: 'Food', val: '₹1,800', pct: 18 },
      { label: 'Transport + misc', val: '₹700', pct: 7 },
    ],
    savings: { label: 'Monthly savings', val: '₹0', pct: 0, color: '#DC9596' },
    quote: '"They raised the rent again. I applied for the scheme twice. Still nothing. I don\'t know how much longer we can stay."',
  },
  {
    tag: 'Reality — Stretched Homeowner',
    persona: 'Suresh & Radha — Teachers, Hyderabad',
    bigNum: '₹1.4L',
    bigLabel: 'Combined monthly income',
    accent: '#C2C094',
    breakdown: [
      { label: 'Home loan EMI', val: '₹62,000', pct: 44 },
      { label: 'Household expenses', val: '₹28,000', pct: 20 },
      { label: 'Children\'s education', val: '₹18,000', pct: 13 },
      { label: 'Vehicle EMI + fuel', val: '₹12,000', pct: 9 },
      { label: 'Insurance + misc', val: '₹8,000', pct: 6 },
    ],
    savings: { label: 'Emergency buffer', val: '₹12,000', pct: 8, color: '#F5C842' },
    quote: '"The bank said we qualified. Nobody ran the stress test. One medical emergency and we can\'t cover the EMI."',
  },
];

function RealityCard({ card, index }) {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="reality-card"
    >
      <div className="reality-card-accent" style={{ background: card.accent }} aria-hidden="true" />

      <div className="reality-card-tag">{card.tag}</div>
      <div className="reality-card-persona">{card.persona}</div>

      <div className="reality-big-num">{card.bigNum}</div>
      <div className="reality-big-label">{card.bigLabel}</div>

      <div className="reality-breakdown">
        {card.breakdown.map((row, i) => (
          <div key={i}>
            <div className="reality-row">
              <span className="reality-row-label">{row.label}</span>
              <span className="reality-row-val">{row.val}</span>
            </div>
            <div className="reality-bar-bg">
              <motion.div
                className="reality-bar-fill"
                style={{ background: card.accent, opacity: 0.6 }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${row.pct}%` } : { width: 0 }}
                transition={{ duration: 1.2, delay: index * 0.12 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}

        {/* Savings row — highlighted */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 10,
          marginTop: 4,
        }}>
          <div className="reality-row">
            <span className="reality-row-label" style={{ color: card.savings.color }}>{card.savings.label}</span>
            <span className="reality-row-val" style={{ color: card.savings.color, fontSize: '15px' }}>
              {card.savings.val}
            </span>
          </div>
          <div className="reality-bar-bg">
            <motion.div
              className="reality-bar-fill"
              style={{ background: card.savings.color }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${Math.max(card.savings.pct, 1)}%` } : { width: 0 }}
              transition={{ duration: 1.4, delay: index * 0.12 + 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>

      <blockquote className="reality-quote">{card.quote}</blockquote>
    </motion.div>
  );
}

export default function RealitySection() {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="reality" className="reality-section" aria-label="The financial reality">
      <div className="container" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 56 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'var(--rose)',
              textTransform: 'uppercase',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--rose)' }} aria-hidden="true" />
            The financial reality
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 4vw, 52px)',
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: 16,
            }}
          >
            Three people. Three traps.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>One broken system.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              maxWidth: '580px',
              fontWeight: 300,
            }}
          >
            Before the research, before the data — three income breakdowns that show exactly where the money goes. And why nothing is left over.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="reality-cards-track">
          {REALITY_CARDS.map((card, i) => (
            <RealityCard key={i} card={card} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 32,
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}>Note</span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>
            All figures are based on primary research interviews, secondary data (NHB, NoBroker, CMIE), and representative composites of real conditions in Hyderabad. Names are fictional; the financial reality is not.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

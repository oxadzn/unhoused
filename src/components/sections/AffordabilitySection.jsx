import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AREAS = [
  { id: 'madhapur', label: 'Madhapur', rent1bhk: 16000, rent2bhk: 25000, commute: '8–15 km', zone: 'Prime IT' },
  { id: 'gachibowli', label: 'Gachibowli', rent1bhk: 14000, rent2bhk: 22000, commute: '5–12 km', zone: 'IT Hub' },
  { id: 'kukatpally', label: 'Kukatpally', rent1bhk: 10000, rent2bhk: 16000, commute: '14–22 km', zone: 'Mid-city' },
  { id: 'hitec', label: 'HITEC City', rent1bhk: 18000, rent2bhk: 28000, commute: '0–8 km', zone: 'Prime IT' },
  { id: 'lbnagar', label: 'LB Nagar', rent1bhk: 7000, rent2bhk: 11000, commute: '22–35 km', zone: 'Outskirts' },
  { id: 'saidabad', label: 'Saidabad', rent1bhk: 5500, rent2bhk: 8500, commute: '18–30 km', zone: 'Periphery' },
];

const FMT = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
};

function formatMonthly(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AffordabilitySection() {
  const [salary, setSalary] = useState(55000);
  const [bhk, setBhk] = useState('2bhk');
  const [areaId, setAreaId] = useState('gachibowli');
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const area = AREAS.find(a => a.id === areaId);
  const rentKey = bhk === '1bhk' ? 'rent1bhk' : 'rent2bhk';
  const actualRent = area[rentKey];
  const safeRent = Math.round(salary * 0.30);
  const gap = actualRent - safeRent;
  const rentPct = Math.round((actualRent / salary) * 100);
  const depositMonths = Math.ceil((actualRent * 2 + actualRent * 0.5) / Math.max(salary - actualRent - 15000, 1));

  const zone = rentPct <= 30 ? 'safe' : rentPct <= 45 ? 'stretch' : 'danger';
  const verdicts = {
    safe: 'Within safe range. You have breathing room.',
    stretch: 'Stretching your budget. Savings will be tight.',
    danger: 'Unaffordable at your current salary.',
  };
  const barColor = zone === 'safe' ? '#A9A587' : zone === 'stretch' ? '#F5C842' : '#DC9596';

  const canBuy = salary >= 100000;
  const approxLoan = salary * 60; // rough 5× annual income
  const homePriceRange = areaId === 'madhapur' || areaId === 'hitec'
    ? '₹1.2Cr – 2.5Cr' : areaId === 'gachibowli'
    ? '₹90L – 1.8Cr' : areaId === 'kukatpally'
    ? '₹55L – 95L' : '₹30L – 60L';

  return (
    <section id="calculator" className="calc-section" aria-label="Affordability calculator">
      <div className="container" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 48 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >
            Interactive Tool
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >
            Can you afford to live<br />
            <em>where you work?</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
            style={{ marginBottom: 0 }}
          >
            Adjust your salary and target neighbourhood. See your real affordability verdict in seconds.
          </motion.p>
        </div>

        <div className="calc-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 320px', gap: '48px', alignItems: 'start' }}>

            {/* Step 1 — Salary */}
            <div>
              <div className="calc-step-label">
                <span className="calc-step-num">1</span>
                Your monthly salary
              </div>
              <div className="calc-step-title">What do you earn?</div>
              <div className="calc-slider-val">{formatMonthly(salary)}</div>
              <div className="calc-slider-sub">per month, take-home</div>
              <div className="calc-slider-wrap">
                <input
                  type="range"
                  className="calc-slider"
                  min={15000}
                  max={250000}
                  step={1000}
                  value={salary}
                  onChange={e => setSalary(Number(e.target.value))}
                  aria-label="Monthly salary"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--ink-light)' }}>₹15k</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--ink-light)' }}>₹2.5L</span>
              </div>
              {/* Safe rent indicator */}
              <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(57,0,64,0.04)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 4 }}>
                  Safe rent budget (30% rule)
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: 'var(--amethyst)' }}>
                  {formatMonthly(safeRent)}
                </div>
              </div>
            </div>

            {/* Step 2 — Area + BHK */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="calc-step-label">
                <span className="calc-step-num">2</span>
                Where do you want to live?
              </div>
              <div className="calc-step-title">Choose your neighbourhood</div>

              {/* BHK toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['1bhk', '2bhk'].map(b => (
                  <button
                    key={b}
                    className={`calc-area-btn ${bhk === b ? 'active' : ''}`}
                    onClick={() => setBhk(b)}
                    style={{ textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", fontSize: '11px', padding: '8px 20px' }}
                  >
                    {b.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="calc-area-grid">
                {AREAS.map(a => (
                  <button
                    key={a.id}
                    className={`calc-area-btn ${areaId === a.id ? 'active' : ''}`}
                    onClick={() => setAreaId(a.id)}
                    aria-pressed={areaId === a.id}
                  >
                    {a.label}
                    <span className="calc-area-rent">
                      {formatMonthly(a[rentKey])}/mo · {a.zone}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--ink-light)', letterSpacing: '0.04em' }}>
                Commute to major IT hubs from {area.label}: <strong style={{ color: 'var(--amethyst)' }}>{area.commute}</strong>
              </div>
            </div>

            {/* Output panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${salary}-${areaId}-${bhk}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="calc-output"
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                  Your verdict
                </div>
                <div className={`calc-verdict ${zone}`}>
                  {verdicts[zone]}
                </div>

                <div className="calc-metric">
                  <span className="calc-metric-label">Actual rent ({bhk.toUpperCase()})</span>
                  <span className={`calc-metric-val ${zone === 'danger' ? 'red' : ''}`}>{formatMonthly(actualRent)}</span>
                </div>
                <div className="calc-metric">
                  <span className="calc-metric-label">Rent % of income</span>
                  <span className={`calc-metric-val ${zone === 'safe' ? 'green' : zone === 'danger' ? 'red' : ''}`}>{rentPct}%</span>
                </div>
                {gap > 0 && (
                  <div className="calc-metric">
                    <span className="calc-metric-label">Monthly overspend</span>
                    <span className="calc-metric-val red">+{formatMonthly(gap)}</span>
                  </div>
                )}
                <div className="calc-metric">
                  <span className="calc-metric-label">Months to save deposit</span>
                  <span className="calc-metric-val">{gap > 0 ? '—' : `${depositMonths} mo`}</span>
                </div>
                <div className="calc-metric">
                  <span className="calc-metric-label">Can you buy in {area.label}?</span>
                  <span className="calc-metric-val" style={{ fontSize: '13px' }}>
                    {canBuy ? `Maybe — ${homePriceRange}` : 'Not at this salary'}
                  </span>
                </div>

                <div className="calc-pct-bar-bg" style={{ marginTop: 20 }}>
                  <motion.div
                    className="calc-pct-bar-fill"
                    style={{ background: barColor, width: `${Math.min(rentPct, 100)}%` }}
                    layout
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>0%</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>30% SAFE</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>100%</span>
                </div>

                <div style={{ marginTop: 20, fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em', lineHeight: 1.5 }}>
                  Rent data: indicative medians (NoBroker, MagicBricks, 2025). Not financial advice.
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #calculator .calc-container > div {
            grid-template-columns: 1fr 1fr !important;
          }
          #calculator .calc-container > div > div:nth-child(2) {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 768px) {
          #calculator .calc-container > div {
            grid-template-columns: 1fr !important;
          }
          #calculator .calc-container > div > div:nth-child(2) {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

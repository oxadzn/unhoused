import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TENURE_OPTIONS = [15, 20, 25];
const RATE = 0.085; // 8.5% p.a. indicative rate

function calcEMI(principal, annualRate, tenureYears) {
  const r = annualRate / 12;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const FMT_L = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};
const FMT_M = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export default function EMIStressSection() {
  const [homePrice, setHomePrice] = useState(8000000); // ₹80L
  const [downPct, setDownPct] = useState(20);
  const [salary, setSalary] = useState(140000); // ₹1.4L
  const [tenure, setTenure] = useState(20);

  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const principal = homePrice * (1 - downPct / 100);
  const emi = useMemo(() => calcEMI(principal, RATE, tenure), [principal, tenure]);
  const emiPct = Math.round((emi / salary) * 100);
  const zone = emiPct <= 30 ? 'safe' : emiPct <= 45 ? 'stretch' : 'danger';
  const zoneClass = `emi-zone-${zone}`;
  const stressEmi = emi; // same EMI
  const stressSalary = salary * 0.8;
  const shortfall = Math.max(stressEmi - (stressSalary * 0.5), 0);

  const zoneLabels = {
    safe: '✓ Within safe range',
    stretch: '⚠ Stretching your finances',
    danger: '✕ Dangerous overextension',
  };
  const zoneColors = { safe: '#A9A587', stretch: '#F5C842', danger: '#DC9596' };

  const totalInterest = emi * tenure * 12 - principal;

  return (
    <section id="emi-stress" className="emi-section" aria-label="EMI stress estimator">
      <div className="container" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 48 }}>
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
            Interactive Tool
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
            What happens when<br />
            <em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>life disrupts the EMI?</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 580, fontWeight: 300 }}
          >
            Banks approve loans. They don't run stress tests. This tool does — showing what happens to your finances if income drops or costs rise.
          </motion.p>
        </div>

        <div className="emi-grid">
          {/* Inputs */}
          <div className="emi-inputs">
            {/* Home price */}
            <div className="emi-input-group">
              <label htmlFor="emi-home-price">Home price</label>
              <div className="emi-slider-val">{FMT_L(homePrice)}</div>
              <input
                id="emi-home-price"
                type="range"
                className="emi-slider"
                min={3000000}
                max={25000000}
                step={500000}
                value={homePrice}
                onChange={e => setHomePrice(Number(e.target.value))}
                aria-label="Home price"
              />
              <div className="emi-slider-range"><span>₹30L</span><span>₹2.5Cr</span></div>
            </div>

            {/* Down payment */}
            <div className="emi-input-group">
              <label htmlFor="emi-down">Down payment — {downPct}%</label>
              <div className="emi-slider-val">{FMT_L(homePrice * downPct / 100)}</div>
              <input
                id="emi-down"
                type="range"
                className="emi-slider"
                min={10}
                max={50}
                step={5}
                value={downPct}
                onChange={e => setDownPct(Number(e.target.value))}
                aria-label="Down payment percentage"
              />
              <div className="emi-slider-range"><span>10%</span><span>50%</span></div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: 6, letterSpacing: '0.04em' }}>
                Loan amount: {FMT_L(principal)} @ 8.5% p.a. (indicative)
              </div>
            </div>

            {/* Monthly salary */}
            <div className="emi-input-group">
              <label htmlFor="emi-salary">Monthly take-home salary</label>
              <div className="emi-slider-val">{FMT_M(salary)}</div>
              <input
                id="emi-salary"
                type="range"
                className="emi-slider"
                min={30000}
                max={300000}
                step={5000}
                value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                aria-label="Monthly salary"
              />
              <div className="emi-slider-range"><span>₹30k</span><span>₹3L</span></div>
            </div>

            {/* Tenure */}
            <div className="emi-input-group">
              <label>Loan tenure</label>
              <div className="emi-tenure-btns">
                {TENURE_OPTIONS.map(t => (
                  <button
                    key={t}
                    className={`emi-tenure-btn ${tenure === t ? 'active' : ''}`}
                    onClick={() => setTenure(t)}
                    aria-pressed={tenure === t}
                  >
                    {t} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual note */}
            <div style={{
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.65,
              letterSpacing: '0.02em',
            }}>
              In our research, banks approved loans with EMI/income ratios of up to 58%. The RBI guideline recommends 40% as a ceiling. Neither figure accounts for income volatility, medical emergencies, or job loss.
            </div>
          </div>

          {/* Output panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${Math.round(emi)}-${emiPct}`}
              initial={{ opacity: 0.6, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="emi-output-panel"
            >
              <div className="emi-output-emi">{FMT_M(emi)}</div>
              <div className="emi-output-label">Monthly EMI</div>

              {/* Risk bar */}
              <div className="emi-risk-bar-wrap">
                <div className="emi-risk-label">
                  <span className="emi-risk-name">EMI as % of salary</span>
                  <span className="emi-risk-pct" style={{ color: zoneColors[zone] }}>{emiPct}%</span>
                </div>
                <div className="emi-risk-bg">
                  <motion.div
                    className={`emi-risk-fill ${zoneClass}`}
                    style={{ width: `${Math.min(emiPct, 100)}%` }}
                    layout
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div style={{ marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', color: zoneColors[zone] }}>
                  {zoneLabels[zone]}
                </div>
              </div>

              {/* Metrics */}
              {[
                { label: 'Monthly EMI', val: FMT_M(emi) },
                { label: 'Remaining salary', val: FMT_M(Math.max(salary - emi, 0)), color: salary - emi < 20000 ? '#DC9596' : '#A9A587' },
                { label: 'Total interest paid', val: FMT_L(totalInterest) },
                { label: 'Total repayment', val: FMT_L(emi * tenure * 12) },
              ].map(m => (
                <div key={m.label} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{m.label}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: m.color || '#fff' }}>{m.val}</span>
                </div>
              ))}

              {/* Stress scenario */}
              <div className="emi-scenario" style={{ marginTop: 20 }}>
                <div className="emi-scenario-title">Stress scenario — 20% income drop</div>
                <div className="emi-scenario-body">
                  If your salary falls to <span className="emi-scenario-num">{FMT_M(stressSalary)}</span> for 3 months, and EMI stays at {FMT_M(emi)}, your monthly shortfall would be{' '}
                  <span className="emi-scenario-num">
                    {shortfall > 0 ? `+${FMT_M(shortfall)}` : 'manageable'}
                  </span>
                  {shortfall > 0 ? ' — with no emergency fund assumed.' : ' — you\'re in the safe zone.'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

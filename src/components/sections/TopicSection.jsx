import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import data from '../../data/housing-data.json';

const { housingSpend, priceVsWage } = data;

const SPEND_DATA = housingSpend.series.map(s => ({
  name: s.persona.split(' ')[0],
  fullName: s.persona,
  value: s.percentage,
  color: s.color,
  annotation: s.annotation,
}));

const PRICE_DATA = priceVsWage.years.map((year, i) => ({
  year,
  housing: priceVsWage.housingPriceIndex[i],
  wage: priceVsWage.wageIndex[i],
}));

const CustomBarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = SPEND_DATA.find(s => s.value === payload[0]?.value);
  return (
    <div style={{
      background: '#390040',
      color: '#fff',
      padding: '12px 16px',
      fontSize: '13px',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: '220px',
    }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{payload[0]?.value}% of income</div>
      {d && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{d.annotation}</div>}
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#390040',
      color: '#fff',
      padding: '12px 16px',
      fontSize: '13px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function SectionHeader() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="section-tag"
      >Phase 01</motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="section-title"
      >Why housing?</motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="section-lead"
      >
        We started with a broad question: what systemic failure affects the most people but gets the least design attention? The answer emerged clearly from secondary data — housing.
      </motion.p>
    </div>
  );
}

export default function TopicSection() {
  const [hiddenBars, setHiddenBars] = useState({});
  const [hiddenLines, setHiddenLines] = useState({});

  const toggleBar = (name) => setHiddenBars(prev => ({ ...prev, [name]: !prev[name] }));
  const toggleLine = (key) => setHiddenLines(prev => ({ ...prev, [key]: !prev[key] }));

  const [leftRef, leftInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [rightRef, rightInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="topic">
      <div className="container">
        <SectionHeader />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start',
        }}>
          {/* Left */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, y: 24 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <blockquote style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontStyle: 'italic',
              color: '#390040',
              lineHeight: 1.45,
              paddingLeft: '24px',
              borderLeft: '3px solid #DC9596',
              marginBottom: '40px',
            }}>
              "Builders have left the middle-class segment entirely. The market is built for investors, not for families."
            </blockquote>

            <div className="stat-row">
              {[
                { num: '5–7×', label: 'Average home price to annual income in Hyderabad' },
                { num: '60%', label: 'Of income consumed by housing for stretched homeowners' },
                { num: '2×', label: 'Lottery rejections for informal residents with no explanation' },
              ].map(s => (
                <div key={s.num} className="stat-box">
                  <div className="stat-box-num">{s.num}</div>
                  <div className="stat-box-label">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, y: 24 }}
            animate={rightInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Bar chart */}
            <ChartWrapper height={260} caption="Housing spend as % of income — by persona type">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SPEND_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,0,64,0.07)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: '#7a6678' }} />
                  <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#7a6678' }} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="value" isAnimationActive animationDuration={1000}>
                    {SPEND_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* Simplified bar chart using recharts properly */}
            <div style={{ marginBottom: 8 }}>
              <ChartWrapper height={240} caption="Housing price index vs. wage growth (indexed to 100) — 15 year trend">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PRICE_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,0,64,0.07)" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#7a6678' }} tickCount={6} />
                    <YAxis tick={{ fontSize: 10, fill: '#7a6678' }} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', fontFamily: "'DM Mono', monospace" }}
                      onClick={e => toggleLine(e.dataKey)}
                    />
                    <ReferenceLine x={2024} stroke="rgba(115,0,113,0.4)" strokeDasharray="4 4" label={{ value: '3.78× gap', fill: '#730071', fontSize: 10 }} />
                    {!hiddenLines.housing && (
                      <Line
                        dataKey="housing"
                        name="Housing price index"
                        stroke="#730071"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive
                        animationDuration={1200}
                      />
                    )}
                    {!hiddenLines.wage && (
                      <Line
                        dataKey="wage"
                        name="Wage index"
                        stroke="#A9A587"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive
                        animationDuration={1200}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #topic .container > div:last-child { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

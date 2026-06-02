import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ReferenceLine,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import { staggerContainerVariants, staggerItemVariants } from '../../hooks/useInViewAnimation';
import data from '../../data/housing-data.json';

const { tripleT } = data;

// Venn diagram SVG component
function VennDiagram() {
  const [hovered, setHovered] = useState(null);
  const counts = {
    D: `${tripleT.totals.dOnly} D-only`,
    F: `${tripleT.totals.fOnly} F-only`,
    V: `${tripleT.totals.vOnly} V-only`,
    center: `${tripleT.totals.dAndFAndV} Sweet Spot (D+F+V)`,
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 480 420" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 440 }}>
        {/* Desirability (rose) */}
        <motion.circle
          cx={195} cy={165} r={130}
          fill="#DC9596" fillOpacity={hovered === 'D' ? 0.25 : 0.14}
          stroke="#DC9596" strokeWidth={1.5}
          onMouseEnter={() => setHovered('D')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
          animate={{ fillOpacity: hovered === 'D' ? 0.25 : 0.14 }}
        />
        {/* Feasibility (purple) */}
        <motion.circle
          cx={285} cy={165} r={130}
          fill="#730071" fillOpacity={hovered === 'F' ? 0.2 : 0.11}
          stroke="#730071" strokeWidth={1.5}
          onMouseEnter={() => setHovered('F')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
          animate={{ fillOpacity: hovered === 'F' ? 0.2 : 0.11 }}
        />
        {/* Viability (sage) */}
        <motion.circle
          cx={240} cy={248} r={130}
          fill="#A9A587" fillOpacity={hovered === 'V' ? 0.25 : 0.14}
          stroke="#A9A587" strokeWidth={1.5}
          onMouseEnter={() => setHovered('V')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
          animate={{ fillOpacity: hovered === 'V' ? 0.25 : 0.14 }}
        />

        {/* Labels */}
        <text x={135} y={112} fontFamily="DM Sans, sans-serif" fontSize={13} fontWeight={500} fill="#8B4546">Desirability</text>
        <text x={135} y={128} fontFamily="DM Mono, monospace" fontSize={10} fill="#8B4546">Users want it</text>

        <text x={302} y={112} fontFamily="DM Sans, sans-serif" fontSize={13} fontWeight={500} fill="#730071">Feasibility</text>
        <text x={302} y={128} fontFamily="DM Mono, monospace" fontSize={10} fill="#730071">Can be built</text>

        <text x={193} y={358} fontFamily="DM Sans, sans-serif" fontSize={13} fontWeight={500} fill="#5a5730">Viability</text>
        <text x={193} y={374} fontFamily="DM Mono, monospace" fontSize={10} fill="#5a5730">Sustainable model</text>

        {/* Intersection labels */}
        <text x={200} y={192} fontFamily="Playfair Display, serif" fontSize={11} fontStyle="italic" fill="#390040" textAnchor="middle">D + F</text>
        <text x={280} y={192} fontFamily="Playfair Display, serif" fontSize={11} fontStyle="italic" fill="#390040" textAnchor="middle">F + V</text>
        <text x={240} y={240} fontFamily="Playfair Display, serif" fontSize={11} fontStyle="italic" fill="#390040" textAnchor="middle">D + V</text>

        {/* Sweet spot */}
        <motion.circle
          cx={240} cy={200} r={40}
          fill="#390040" fillOpacity={0.9}
          onMouseEnter={() => setHovered('center')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
          animate={{ r: [40, 42, 40] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text x={240} y={194} fontFamily="Playfair Display, serif" fontSize={12} fontWeight="bold" fill="white" textAnchor="middle">Sweet</text>
        <text x={240} y={210} fontFamily="Playfair Display, serif" fontSize={12} fontWeight="bold" fill="white" textAnchor="middle">Spot</text>
        <text x={240} y={225} fontFamily="DM Mono, monospace" fontSize={9} fill="rgba(255,255,255,0.5)" textAnchor="middle">D+F+V</text>
      </svg>

      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 12,
            right: 0,
            background: '#390040',
            color: '#fff',
            padding: '10px 16px',
            fontSize: '13px',
            pointerEvents: 'none',
          }}
        >
          {counts[hovered]}
        </motion.div>
      )}
    </div>
  );
}

// Bar data for TTT breakdown
const TTT_BARS = [
  { name: 'Desirability only', value: tripleT.totals.dOnly, color: '#DC9596' },
  { name: 'Feasibility only', value: tripleT.totals.fOnly, color: '#730071' },
  { name: 'Viability only', value: tripleT.totals.vOnly, color: '#A9A587' },
  { name: 'D + F', value: tripleT.totals.dAndF, color: '#8B4546' },
  { name: 'D + V', value: tripleT.totals.dAndV, color: '#5a5730' },
  { name: 'F + V', value: tripleT.totals.fAndV, color: '#4a0048' },
  { name: 'D + F + V (Sweet Spot)', value: tripleT.totals.dAndFAndV, color: '#390040' },
];

// Scatter chart: effort vs value
const SCATTER_DATA = tripleT.sweetSpotIdeas.map(idea => ({
  effort: idea.effort,
  value: idea.value,
  name: idea.title,
  rank: idea.rank,
}));

const CustomScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  const idea = tripleT.sweetSpotIdeas.find(i => i.rank === p?.rank);
  return (
    <div style={{ background: '#390040', color: '#fff', padding: '12px 16px', fontSize: '13px', maxWidth: '240px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#DC9596', marginBottom: 4 }}>Rank #{p?.rank}</div>
      <div style={{ fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{p?.name}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Effort: {p?.effort} / Value: {p?.value}</div>
      {idea && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: 6, lineHeight: 1.4 }}>{idea.description}</div>}
    </div>
  );
};

import { useState } from 'react';

export default function SynthesisSection() {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [chartRef, chartInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="synthesis" style={{ background: '#F0EDE6' }}>
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Phase 07</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Finding the ideas that matter</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            We filtered 840 total ideas down to 117 top ideas, and categorised them across three dimensions — Desirability, Feasibility, Viability — then filtered for short-to-medium time horizon and highest effort-to-value ratio.
          </motion.p>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', alignItems: 'start', marginBottom: 64 }}>
          {/* Left: Venn + scatter */}
          <div>
            <VennDiagram />

            {/* Funnel */}
            <div style={{ marginTop: 40 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a6678', marginBottom: 12 }}>
                Idea filtration funnel
              </div>
              {[
                { label: 'Total ideas generated', count: 840, pct: 100 },
                { label: 'Top ideas selected', count: 117, pct: 14 },
                { label: 'D + F + V (Sweet Spot)', count: 32, pct: 4 },
                { label: 'Short / medium term', count: 28, pct: 3 },
                { label: 'High value / effort', count: 14, pct: 2 },
                { label: 'Priority solutions', count: 7, pct: 1 },
              ].map(({ label, count, pct }) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#390040' }}>{label}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#7a6678' }}>{count}</span>
                  </div>
                  <motion.div
                    style={{ height: 8, background: 'rgba(57,0,64,0.08)' }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#A9A587' : pct > 20 ? '#730071' : '#390040', transition: 'width 1s' }} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: TTT breakdown */}
          <div>
            {TTT_BARS.map(bar => (
              <div key={bar.name} className="ttt-category">
                <div className="ttt-cat-header">
                  <div className="ttt-cat-name">{bar.name}</div>
                  <div className="ttt-cat-count">{bar.value} ideas</div>
                </div>
                <div className="ttt-bar-bg">
                  <motion.div
                    className="ttt-bar-fill"
                    style={{ background: bar.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(bar.value / tripleT.totals.dOnly) * 85}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Effort-Value scatter */}
        <div ref={chartRef}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a6678', marginBottom: 12 }}>
            Effort × Value matrix — 7 priority solutions
          </div>
          <ChartWrapper height={320} caption="Effort (x-axis, lower = easier) vs Value (y-axis, higher = more impactful)">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 40, left: -16, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,0,64,0.07)" />
                {/* Highlight sweet zone */}
                <ReferenceLine x={4} stroke="rgba(115,0,113,0.15)" strokeDasharray="4 4" />
                <ReferenceLine y={8} stroke="rgba(115,0,113,0.15)" strokeDasharray="4 4" />
                <XAxis dataKey="effort" name="Effort" domain={[0, 11]} tickCount={6} tick={{ fontSize: 10, fill: '#7a6678' }} label={{ value: 'Effort →', position: 'insideBottomRight', offset: -4, fill: '#7a6678', fontSize: 11 }} />
                <YAxis dataKey="value" name="Value" domain={[0, 11]} tickCount={6} tick={{ fontSize: 10, fill: '#7a6678' }} label={{ value: 'Value ↑', position: 'insideTopLeft', offset: 8, fill: '#7a6678', fontSize: 11 }} />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter
                  data={SCATTER_DATA}
                  fill="#730071"
                  isAnimationActive={chartInView}
                  shape={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={10} fill="#390040" stroke="#DC9596" strokeWidth={1.5} />
                        <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={9} fontFamily="'DM Mono', monospace">
                          #{payload.rank}
                        </text>
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 16,
          }}>
            {tripleT.sweetSpotIdeas.map(idea => (
              <div key={idea.rank} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '11px',
                color: '#7a6678',
                fontFamily: "'DM Mono', monospace",
              }}>
                <span style={{ background: '#390040', color: '#fff', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>#{idea.rank}</span>
                {idea.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #synthesis .container > div:nth-child(3) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

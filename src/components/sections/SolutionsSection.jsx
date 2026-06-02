import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import { staggerContainerVariants, staggerItemVariants } from '../../hooks/useInViewAnimation';
import data from '../../data/housing-data.json';

const { tripleT } = data;

const TAG_COLORS = { D: 'tag-d', F: 'tag-f', V: 'tag-v' };
const FEATURED = [1, 3, 5];

const RADAR_DATA = [
  { axis: 'Impact', s1: 9, s2: 10, s3: 8 },
  { axis: 'Feasibility', s1: 8, s2: 7, s3: 8 },
  { axis: 'Speed', s1: 9, s2: 9, s3: 9 },
  { axis: 'Reach', s1: 8, s2: 7, s3: 9 },
  { axis: 'Cost', s1: 8, s2: 7, s3: 7 },
];

const CustomRadarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(26, 16, 21, 0.92)',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '10px 14px',
      fontSize: '12px',
      backdropFilter: 'blur(8px)',
      minWidth: '180px',
    }}>
      {payload.map(p => (
        <div
          key={p.dataKey}
          style={{
            color: '#fff',
            paddingLeft: '10px',
            borderLeft: `3px solid ${p.color}`,
            marginBottom: '6px',
            lineHeight: 1.4,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', display: 'block' }}>{p.name}</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>{p.value}<span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>/10</span></span>
        </div>
      ))}
    </div>
  );
};


function SolutionCard({ idea }) {
  const isFeatured = FEATURED.includes(idea.rank);
  const effortPct = (idea.effort / 10) * 100;
  const valuePct = (idea.value / 10) * 100;

  return (
    <motion.div
      variants={staggerItemVariants}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(57,0,64,0.12)' }}
      className={`solution-card ${isFeatured ? 'featured' : ''}`}
      data-num={`0${idea.rank}`}
      data-hover
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {idea.tags.map(t => (
          <span key={t} className={`tag ${TAG_COLORS[t]}`}>{t === 'D' ? 'Desirable' : t === 'F' ? 'Feasible' : 'Viable'}</span>
        ))}
      </div>
      <div className="solution-title">{idea.title}</div>
      <div className="solution-body">{idea.description}</div>

      {idea.targetPersonas && (
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {idea.targetPersonas.map(p => (
            <span key={p} className={`persona-tag ${p.toLowerCase()}`} style={{ marginBottom: 0 }}>{p}</span>
          ))}
        </div>
      )}

      <div className="effort-value-bars">
        <div className="ev-item">
          <div className="ev-label">Value</div>
          <div className="ev-bar-bg">
            <motion.div
              className="ev-bar-fill"
              style={{ background: '#390040' }}
              initial={{ width: 0 }}
              whileInView={{ width: `${valuePct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
          </div>
          <div className="ev-val">{idea.value}/10</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SolutionsSection() {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section id="solutions" style={{ background: '#fff' }}>
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Priority Solutions</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Top Ideas</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            The final filter: among D+F+V ideas in the short-to-medium time horizon, we selected the seven that offered the highest impact relative to effort required.
          </motion.p>
        </div>

        {/* Solution cards */}
        <motion.div
          ref={cardsRef}
          variants={staggerContainerVariants}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '72px',
          }}
        >
          {tripleT.sweetSpotIdeas.map(idea => (
            <SolutionCard key={idea.rank} idea={idea} />
          ))}
        </motion.div>

        {/* Radar chart */}
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7a6678',
            marginBottom: 12,
          }}>
            Top 3 solutions — Comparative radar across 5 dimensions
          </div>
          <ChartWrapper height={320} caption="Scores (1–10) across Impact, Feasibility, Speed, Reach, and Cost dimensions">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <PolarGrid stroke="rgba(57,0,64,0.1)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: '#7a6678', fontFamily: "'DM Sans', sans-serif" }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 9, fill: '#7a6678' }} axisLine={false} />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar name="Affordability Dashboard" dataKey="s1" stroke="#390040" fill="#390040" fillOpacity={0.15} isAnimationActive animationDuration={1200} />
                <Radar name="Missed-call Paralegal" dataKey="s2" stroke="#730071" fill="#730071" fillOpacity={0.12} isAnimationActive animationDuration={1200} />
                <Radar name="Informal Proof" dataKey="s3" stroke="#DC9596" fill="#DC9596" fillOpacity={0.12} isAnimationActive animationDuration={1200} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { color: '#390040', label: 'Affordability Dashboard' },
              { color: '#730071', label: 'Missed-call Paralegal' },
              { color: '#DC9596', label: 'Informal Proof of Residence' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#7a6678', fontFamily: "'DM Mono', monospace" }}>
                <div style={{ width: 12, height: 12, background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #solutions .container > div:nth-child(3) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

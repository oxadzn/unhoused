import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import { useCountUp } from '../../hooks/useCountUp';
import { staggerContainerVariants, staggerItemVariants } from '../../hooks/useInViewAnimation';
import data from '../../data/housing-data.json';

const { sixThreeFive } = data;

const CUMULATIVE_DATA = sixThreeFive.rounds.map(r => ({
  round: `R${r.round}`,
  ideas: r.cumulative,
  new: sixThreeFive.perRound[r.round - 1],
}));

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const r = sixThreeFive.rounds[parseInt(label.slice(1)) - 1];
  return (
    <div style={{ background: '#390040', color: '#fff', padding: '12px 16px', fontSize: '13px', maxWidth: '200px' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label} — {r?.name}</div>
      <div style={{ fontWeight: 500 }}>{payload[0]?.value} cumulative ideas</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>+{r?.cumulative - (sixThreeFive.rounds[r.round - 2]?.cumulative || 0)} this round</div>
    </div>
  );
};

function CountBig({ started }) {
  const count = useCountUp(840, 2200, started);
  return (
    <div style={{
      background: '#390040',
      padding: '48px 40px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '96px',
        color: '#fff',
        lineHeight: 1,
        letterSpacing: '-4px',
      }}>{count}</div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
      }}>Total raw ideas</div>
      <div style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.6)',
        marginTop: 8,
        lineHeight: 1.55,
        maxWidth: '200px',
      }}>generated across 5 rounds, 3 HMW tracks, and 6 participants</div>
    </div>
  );
}

export default function IdeationSection() {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [leftRef, leftInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [rightRef, rightInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="ideation" style={{ background: '#EDE9DF' }}>
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Phase 06</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Structured divergent thinking</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            The 6-3-5 method — 6 participants, 3 ideas each, 5 rounds of iteration — generated a cascade of solutions, each building on the last. Ideas compounded across rounds.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Left: rounds */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, y: 24 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <ul style={{ listStyle: 'none' }}>
              {sixThreeFive.rounds.map(r => (
                <li key={r.round} className="round-item">
                  <div className="round-num">R{r.round}</div>
                  <div>
                    <div className="round-title">{r.name}</div>
                    <div className="round-body">{r.description}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* 6x3x5 math */}
            <div style={{
              marginTop: 32,
              padding: '24px',
              background: 'rgba(57,0,64,0.05)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a6678', marginBottom: 12 }}>
                How it works
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
                {[
                  { num: '4', label: 'Participants' },
                  { num: '3', label: 'Ideas each' },
                  { num: '5', label: 'Rounds' },
                ].map(({ num, label }) => (
                  <div key={`top-${label}`} style={{ background: 'var(--off-white)', padding: '16px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#390040' }}>{num}</div>
                    <div style={{ fontSize: '11px', color: '#7a6678', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', marginTop: 8 }}>
                {[
                  { num: '3', label: 'Participants' },
                  { num: '3', label: 'Ideas each' },
                  { num: '5', label: 'Rounds' },
                ].map(({ num, label }) => (
                  <div key={`bottom-${label}`} style={{ background: 'var(--off-white)', padding: '16px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#390040' }}>{num}</div>
                    <div style={{ fontSize: '11px', color: '#7a6678', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: '13px', color: '#7a6678' }}>
                10 questions generated → <strong style={{ color: '#390040' }}>840 total ideas</strong> across 5 rounds
              </div>
            </div>
          </motion.div>

          {/* Right: count-up + chart + pills */}
          <div ref={rightRef}>
            <CountBig started={rightInView} />

            <div style={{ marginTop: 2, background: '#fff', padding: '20px 16px 8px' }}>
              <ChartWrapper height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CUMULATIVE_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                    <defs>
                      <linearGradient id="ideaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#390040" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#390040" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,0,64,0.07)" />
                    <XAxis dataKey="round" tick={{ fontSize: 11, fill: '#7a6678' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#7a6678' }} />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="ideas"
                      name="Cumulative ideas"
                      stroke="#390040"
                      strokeWidth={2.5}
                      fill="url(#ideaGrad)"
                      dot={{ fill: '#390040', r: 4 }}
                      isAnimationActive={rightInView}
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>
              <p className="chart-caption" style={{ paddingBottom: 8 }}>Cumulative ideas generated per round</p>
            </div>

            {/* Sample ideas pill cloud */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a6678', marginBottom: 12 }}>
                Sample ideas from the session
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sixThreeFive.sampleIdeas.map(idea => (
                  <span key={idea} className="idea-pill">{idea}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #ideation .container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

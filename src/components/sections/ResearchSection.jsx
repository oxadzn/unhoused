import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';
import { staggerContainerVariants, staggerItemVariants } from '../../hooks/useInViewAnimation';

const METHODS = [
  {
    title: 'In-depth interviews',
    body: 'Semi-structured conversations with residents across income groups, exploring daily housing friction, documentation challenges, and emotional experiences of navigating a broken system.',
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
    ),
  },
  {
    title: 'Secondary data review',
    body: 'Analysis of RERA data, PMAY scheme reports, Hyderabad ward office processes, NoBroker/MagicBricks user flows, NHB housing price indices, and RBI mortgage guidelines.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M9 17H5a2 2 0 00-2 2v2h18v-2a2 2 0 00-2-2h-4"/><rect x="9" y="3" width="6" height="10" rx="1"/></svg>
    ),
  },
  {
    title: 'Field observation',
    body: 'Visits to ward offices, informal settlements in Saidabad, and builder show-homes to understand the physical and procedural realities of housing access.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>
    ),
  },
];

const QUOTES = [
  {
    text: 'They keep sending me to different people. Nobody actually knows the rules. I waited 40 minutes only to be told to come back with a different form.',
    source: 'Didi — Informal resident, Saidabad',
  },
  {
    text: 'A 1BHK near Madhapur is going for 2 crore — that\'s not for people like us. The market has been handed over to investors entirely.',
    source: 'Suresh — Middle-income homeowner',
  },
  {
    text: 'Every listing in my budget is either too far or too small. I\'ve been looking for 6 months. Nothing has changed. The market is not built for my salary.',
    source: 'Priya K. — Urban professional renter',
  },
];

const DONUT_DATA = [
  { name: 'Interviews', value: 40, color: '#390040' },
  { name: 'Secondary research', value: 35, color: '#730071' },
  { name: 'Field observation', value: 25, color: '#DC9596' },
];

const CustomDonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#390040', color: '#fff', padding: '10px 14px', fontSize: '13px' }}>
      {payload[0].name}: <strong>{payload[0].value}%</strong>
    </div>
  );
};

export default function ResearchSection() {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [quotesRef, quotesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="research" style={{ background: '#EDEADF' }}>
      <div className="container">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-tag"
          >Phase 02</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title"
          >Listening before designing</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-lead"
          >
            We combined secondary research with primary interviews across three housing contexts — formal ownership, informal settlement, and urban renting.
          </motion.p>
        </div>

        {/* Method cards */}
        <motion.div
          ref={cardsRef}
          variants={staggerContainerVariants}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(57,0,64,0.1)',
            marginBottom: '48px',
          }}
        >
          {METHODS.map(m => (
            <motion.div key={m.title} variants={staggerItemVariants} className="research-card">
              <div className="research-icon">{m.icon}</div>
              <div className="research-card-title">{m.title}</div>
              <div className="research-card-body">{m.body}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quotes + Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '48px', alignItems: 'start' }}>
          <motion.div
            ref={quotesRef}
            variants={staggerContainerVariants}
            initial="hidden"
            animate={quotesInView ? 'visible' : 'hidden'}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
          >
            {QUOTES.map(q => (
              <motion.div
                key={q.source}
                variants={staggerItemVariants}
                className="quote-card"
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(57,0,64,0.12)' }}
                transition={{ duration: 0.25 }}
                data-hover
              >
                <div className="quote-text">"{q.text}"</div>
                <div className="quote-source">{q.source}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Donut chart */}
          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#7a6678',
              marginBottom: '12px',
            }}>
              Research methods
            </div>
            <ChartWrapper height={180}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    dataKey="value"
                    isAnimationActive
                    animationDuration={1000}
                  >
                    {DONUT_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomDonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
            <div style={{ marginTop: 8 }}>
              {DONUT_DATA.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#7a6678', fontFamily: "'DM Mono', monospace" }}>
                    {d.name} {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #research .container > div:nth-child(4) { grid-template-columns: 1fr !important; }
          #research .container > div:nth-child(3) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const FOOTER_PHASES = [
  'Topic Selection', 'Research & Interviews', 'Personas & Journey Maps',
  'Root Cause Analysis', 'How Might We', '6-3-5 Brainwriting', 'Triple-T Synthesis'
];

export default function Footer() {
  const handleTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: '#390040',
      padding: '80px 48px 48px',
    }}>
      {/* Top row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'start',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: '48px',
        marginBottom: '40px',
      }}>
        {/* Left */}
        <div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            color: '#fff',
            marginBottom: '16px',
            letterSpacing: '-1px',
          }}>
            Unhoused
          </div>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            maxWidth: '380px',
            marginBottom: '24px',
          }}>
            A design thinking investigation into the housing crisis affecting middle-class buyers, informal residents, and urban renters in Hyderabad — and a set of human-centred, actionable solutions.
          </p>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(220,149,150,0.6)',
          }}>
            A design thinking project · Hyderabad, India
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '16px',
          }}>
            Seven Phases
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FOOTER_PHASES.map((phase, i) => (
              <span
                key={phase}
                style={{
                  fontSize: '10px',
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  padding: '5px 12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'color 0.2s, border-color 0.2s',
                  cursor: 'default',
                }}
              >
                {String(i + 1).padStart(2, '0')} {phase}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
        }}>
          Made as part of a design thinking course investigation · 2025–2026
        </div>

        <a
          href="#hero"
          onClick={handleTop}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(220,149,150,0.6)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#DC9596'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,149,150,0.6)'}
        >
          ↑ Back to top
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer { padding: 60px 24px 40px !important; }
          footer > div:first-child { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  );
}

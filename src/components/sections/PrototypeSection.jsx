import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Standard SVG Icon Set
const Icons = {
  calculator: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
    </svg>
  ),
  truck: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5.14a1 1 0 0 0-.293-.707l-4-4A1 1 0 0 0 17 7h-3"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  messageSquare: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  qr: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M12 12h.01"/><path d="M12 17v.01"/><path d="M17 12h.01"/>
    </svg>
  ),
  hash: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
    </svg>
  ),
  megaphone: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
    </svg>
  ),
  smartphone: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>
    </svg>
  ),
  alertCircle: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
  ),
  send: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  bell: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  ban: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" x2="19.07" y1="4.93" y2="19.07"/>
    </svg>
  ),
  play: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  ),
  refresh: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M16 3h5v5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 21H3v-5"/>
    </svg>
  ),
  check: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  home: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
};

// Features mapped to specific icons (instead of letters)
const FEATURES = [
  {
    id: 'calculator',
    name: 'Offline Eligibility Simulator',
    desc: 'Points calculator running entirely offline. Tells users their likely eligibility and exact documents needed before visiting a ward office.',
    nodes: [3, 4]
  },
  {
    id: 'truck',
    name: 'Live Queue + Van Booking',
    desc: 'Real-time ward office queue tracker. Book a 15-minute slot for a Mobile Scheme Van to come directly to your settlement instead.',
    nodes: [5]
  },
  {
    id: 'messageSquare',
    name: 'SMS Status Updates',
    desc: 'Automated SMS updates in Telugu, Urdu, or Hindi at every stage of the application. Works on any basic feature phone.',
    nodes: [7, 8]
  },
  {
    id: 'qr',
    name: 'Rejection Remedy QR Code',
    desc: 'Every rejection letter gets a unique QR code. Scan it to view a short video in your language explaining exactly how to resubmit.',
    nodes: [10, 11]
  },
  {
    id: 'hash',
    name: 'Waitlist Transparency',
    desc: 'Approved but waitlisted? Receive a secure SMS link with your exact, immutable rank in the queue. No queue-jumping or corruption.',
    nodes: [14]
  }
];

// Nodes data for Visualization 1 (Journey Flow)
const JOURNEY_NODES = [
  { id: 1, label: 'Hears about scheme', cx: 280, cy: 40, w: 180, h: 40, icon: 'megaphone', feat: null },
  { id: 2, label: 'Opens Navigator PWA (offline)', cx: 280, cy: 130, w: 200, h: 40, icon: 'smartphone', feat: null },
  { id: 3, label: 'Runs Eligibility Simulator', cx: 280, cy: 220, w: 190, h: 40, icon: 'calculator', feat: 'calculator' },
  { id: 4, label: 'Not eligible → remedies', cx: 475, cy: 220, w: 150, h: 40, icon: 'alertCircle', feat: 'calculator', type: 'rejection' },
  { id: 5, label: 'Books Mobile Van slot', cx: 280, cy: 310, w: 180, h: 40, icon: 'truck', feat: 'truck' },
  { id: 6, label: 'Submits application', cx: 280, cy: 400, w: 180, h: 40, icon: 'send', feat: null },
  { id: 7, label: 'SMS confirmation sent', cx: 280, cy: 490, w: 180, h: 40, icon: 'messageSquare', feat: 'messageSquare' },
  { id: 8, label: 'Application status via SMS', cx: 280, cy: 580, w: 200, h: 40, icon: 'bell', feat: 'messageSquare' },
  
  // Left branch (REJECTED)
  { id: 9, label: 'REJECTED', cx: 140, cy: 700, w: 140, h: 40, icon: 'ban', feat: 'qr', type: 'rejection' },
  { id: 10, label: 'Scans QR code', cx: 140, cy: 790, w: 140, h: 40, icon: 'qr', feat: 'qr', type: 'rejection' },
  { id: 11, label: 'Video explanation', cx: 140, cy: 880, w: 150, h: 40, icon: 'play', feat: 'qr', type: 'rejection' },
  { id: 12, label: 'Resubmit', cx: 140, cy: 970, w: 140, h: 40, icon: 'refresh', feat: 'qr', type: 'rejection' },
  
  // Right branch (APPROVED)
  { id: 13, label: 'APPROVED', cx: 420, cy: 700, w: 140, h: 40, icon: 'check', feat: null },
  { id: 14, label: 'Waitlist rank via SMS', cx: 420, cy: 790, w: 160, h: 40, icon: 'hash', feat: 'hash' },
  { id: 15, label: 'Allotment', cx: 420, cy: 880, w: 140, h: 40, icon: 'home', feat: null }
];

// Happy path nodes (by index in the JOURNEY_NODES array)
const HAPPY_PATH_INDICES = [0, 1, 2, 4, 5, 6, 7, 12, 13, 14]; 

// Root causes (left) connected to Navigator features (right)
const CONNECTIONS = [
  {
    id: 1,
    left: 'Lost wages to attend office',
    right: 'Mobile Van Booking',
    pill: 'reduces'
  },
  {
    id: 2,
    left: 'Staff give contradictory information',
    right: 'Standardised Eligibility Simulator',
    pill: 'solves'
  },
  {
    id: 3,
    left: 'Document ecosystem excludes informal residents',
    right: 'Alternative document pathways',
    pill: 'reduces'
  },
  {
    id: 4,
    left: 'Zero communication post-submission',
    right: 'SMS Status at every stage',
    pill: 'solves'
  },
  {
    id: 5,
    left: 'Lottery is opaque; no appeal process',
    right: 'Waitlist rank + QR rejection remedy',
    pill: 'solves'
  }
];

export default function PrototypeSection() {
  const [activePill, setActivePill] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [vis1Ref, vis1InView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [vis2Ref, vis2InView] = useInView({ threshold: 0.2, triggerOnce: true });

  const startDidiJourney = () => {
    if (isTracking) {
      setIsTracking(false);
      setActiveStep(-1);
      return;
    }
    setIsTracking(true);
    setActiveStep(0);
  };

  useEffect(() => {
    if (!isTracking) return;
    if (activeStep < HAPPY_PATH_INDICES.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setIsTracking(false);
        setActiveStep(-1);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [isTracking, activeStep]);

  const getTrackerCoords = () => {
    if (activeStep === -1) return { cx: 280, cy: 0 };
    const nodeIndex = HAPPY_PATH_INDICES[activeStep];
    const node = JOURNEY_NODES[nodeIndex];
    return { cx: node.cx, cy: node.cy };
  };

  const trackerPos = getTrackerCoords();

  return (
    <section id="prototype" style={{ background: 'transparent', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px' }}>
        
        <div style={{ marginBottom: '60px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'DM Mono', monospace", color: '#730071', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '16px' }}
          >
            The Prototype
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#390040', marginBottom: '24px', lineHeight: 1.1 }}
          >
            Meet the <em>GHMC Scheme Navigator</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#7a6678', lineHeight: 1.6, maxWidth: '640px' }}
          >
            An offline-first PWA + SMS system designed to make the Hyderabad 2BHK housing scheme completely transparent and navigable for informal workers, migrants, and low-income citizens—without replacing any backend government infrastructure.
          </motion.p>
        </div>

        {/* 5 Horizontal Feature Pills - Using SVGs instead of Alphabets */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            overflowX: 'auto', 
            paddingBottom: '16px',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch'
          }}>
            {FEATURES.map(feat => {
              const isActive = activePill === feat.id;
              return (
                <button
                  key={feat.id}
                  data-hover="true"
                  onClick={() => setActivePill(isActive ? null : feat.id)}
                  style={{
                    background: isActive ? '#390040' : 'rgba(57, 0, 64, 0.03)',
                    border: `1px solid ${isActive ? '#390040' : 'rgba(57, 0, 64, 0.12)'}`,
                    color: isActive ? '#fff' : '#390040',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(57, 0, 64, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(57, 0, 64, 0.03)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '14px',
                    height: '14px',
                    color: isActive ? '#DC9596' : '#730071',
                  }}>
                    {Icons[feat.id]}
                  </span>
                  {feat.name}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activePill && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginTop: '16px',
                  padding: '20px 24px',
                  background: 'rgba(115, 0, 113, 0.02)',
                  borderLeft: '3px solid #730071',
                  borderRadius: '0 8px 8px 0',
                  maxWidth: '560px'
                }}
              >
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#390040', marginBottom: '6px' }}>
                  {FEATURES.find(f => f.id === activePill).name}
                </div>
                <div style={{ fontSize: '13.5px', color: '#7a6678', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                  {FEATURES.find(f => f.id === activePill).desc}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={vis1Ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
          <motion.button
            data-hover="true"
            onClick={startDidiJourney}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginBottom: '40px',
              background: isTracking ? '#DC9596' : '#730071',
              color: isTracking ? '#390040' : '#fff',
              border: 'none',
              padding: '12px 28px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderRadius: '24px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(115, 0, 113, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 500,
              transition: 'background 0.3s'
            }}
          >
            {isTracking ? (
              <>
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
                {activeStep === HAPPY_PATH_INDICES.length - 1 ? 'Reset Journey' : "Didi is moving..."}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Follow Didi's Journey
              </>
            )}
          </motion.button>

          <div style={{ position: 'relative', width: '100%', maxWidth: '560px', margin: '0 auto' }}>
            <svg 
              viewBox="0 0 560 1020" 
              style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#730071" />
                </marker>
                <marker id="arrow-rose" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DC9596" />
                </marker>
              </defs>

              {vis1InView && (
                <g>
                  {/* Happy Path */}
                  <motion.line x1="280" y1="60" x2="280" y2="110" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.0 }} />
                  <motion.line x1="280" y1="150" x2="280" y2="200" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.15 }} />
                  <motion.line x1="375" y1="220" x2="392" y2="220" stroke="#DC9596" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow-rose)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
                  <motion.line x1="280" y1="240" x2="280" y2="290" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.45 }} />
                  <motion.line x1="280" y1="330" x2="280" y2="380" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
                  <motion.line x1="280" y1="420" x2="280" y2="470" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.75 }} />
                  <motion.line x1="280" y1="510" x2="280" y2="560" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.9 }} />
                  <motion.path d="M 280 600 L 140 600 L 140 672" stroke="#DC9596" strokeWidth="2" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-rose)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.05 }} />
                  <motion.path d="M 280 600 L 420 600 L 420 672" stroke="#730071" strokeWidth="2" fill="none" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.05 }} />

                  {/* Branches */}
                  <motion.line x1="140" y1="720" x2="140" y2="762" stroke="#DC9596" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow-rose)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.25 }} />
                  <motion.line x1="140" y1="810" x2="140" y2="852" stroke="#DC9596" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow-rose)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.4 }} />
                  <motion.line x1="140" y1="900" x2="140" y2="942" stroke="#DC9596" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow-rose)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.55 }} />
                  <motion.path d="M 70 970 C -15 970, -15 400, 180 400" stroke="#DC9596" strokeWidth="1.5" strokeDasharray="5 4" fill="none" markerEnd="url(#arrow-rose)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.8 }} />
                  <motion.line x1="420" y1="720" x2="420" y2="762" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.25 }} />
                  <motion.line x1="420" y1="810" x2="420" y2="852" stroke="#730071" strokeWidth="2" markerEnd="url(#arrow-purple)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.4 }} />
                </g>
              )}

              {JOURNEY_NODES.map((node, i) => {
                const isRejection = node.type === 'rejection';
                const isPillHighlighted = activePill && FEATURES.find(f => f.id === activePill)?.nodes.includes(node.id);
                const nodeHappyPathIndex = HAPPY_PATH_INDICES.indexOf(i);
                const isTrackingActiveNode = isTracking && nodeHappyPathIndex !== -1 && activeStep === nodeHappyPathIndex;
                const rx = node.w / 2;
                const ry = node.h / 2;

                return (
                  <motion.g
                    key={node.id}
                    data-hover="true"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      vis1InView 
                        ? { 
                            opacity: 1, 
                            scale: isTrackingActiveNode ? 1.08 : isPillHighlighted ? 1.04 : 1
                          } 
                        : {}
                    }
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.15 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={node.cx - rx}
                      y={node.cy - ry}
                      width={node.w}
                      height={node.h}
                      rx="8"
                      ry="8"
                      fill={isRejection ? '#fff' : '#390040'}
                      stroke={isTrackingActiveNode || isPillHighlighted ? '#DC9596' : isRejection ? '#DC9596' : 'transparent'}
                      strokeWidth={isTrackingActiveNode || isPillHighlighted ? 2.5 : isRejection ? 1.5 : 0}
                      filter={isTrackingActiveNode || isPillHighlighted ? 'url(#glow)' : 'none'}
                      style={{ transition: 'stroke 0.25s, fill 0.25s' }}
                    />
                    <svg x={node.cx - rx + 14} y={node.cy - 7.5} width="15" height="15" style={{ color: isRejection ? '#DC9596' : '#fff', overflow: 'visible' }}>
                      {Icons[node.icon]}
                    </svg>
                    <text x={node.cx + 10} y={node.cy + 4} fill={isRejection ? '#390040' : '#fff'} fontFamily="'DM Sans', sans-serif" fontSize="11px" fontWeight="500" textAnchor="middle">
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}

              <AnimatePresence>
                {isTracking && activeStep !== -1 && (
                  <motion.circle
                    cx={trackerPos.cx}
                    cy={trackerPos.cy}
                    r="8"
                    fill="#DC9596"
                    stroke="#fff"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  />
                )}
              </AnimatePresence>
            </svg>

            <AnimatePresence>
              {hoveredNode && hoveredNode.feat && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 10, x: '-50%' }}
                  style={{
                    position: 'absolute',
                    left: `${(hoveredNode.cx / 560) * 100}%`,
                    top: `${(hoveredNode.cy / 1020) * 100 + 4.5}%`,
                    transform: 'translateX(-50%)',
                    background: '#1A1015',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    padding: '8px 12px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                    zIndex: 200,
                    minWidth: '220px',
                    textAlign: 'center',
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#DC9596', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <span style={{ width: '12px', height: '12px', display: 'inline-block' }}>{Icons[hoveredNode.feat]}</span>
                    Navigator Feature
                  </div>
                  <div>
                    {FEATURES.find(f => f.id === hoveredNode.feat).name}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(57, 0, 64, 0.1)', margin: '40px 0 80px' }} />

        <div ref={vis2Ref} style={{ padding: '40px 0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#390040', marginBottom: '12px' }}>
              From diagnosis to design
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#7a6678', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              Directly mapping the critical root causes identified in our Root Cause Analysis (RCA) to the tangible components designed in this Navigator prototype.
            </p>
          </div>

          <div className="connector-desktop" style={{ position: 'relative', width: '100%', maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 1fr', gap: '0', alignItems: 'stretch' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', zIndex: 5 }}>
                {CONNECTIONS.map((conn, idx) => (
                  <div
                    key={conn.id}
                    data-hover="true"
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: '#fff',
                      border: `1.5px solid ${hoveredRow === idx ? '#730071' : 'rgba(57, 0, 64, 0.12)'}`,
                      padding: '16px 20px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#390040',
                      lineHeight: 1.5,
                      fontWeight: 500,
                      boxShadow: hoveredRow === idx ? '0 12px 30px rgba(115, 0, 113, 0.08)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      minHeight: '84px',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'default'
                    }}
                  >
                    <span style={{ marginRight: '12px', fontFamily: "'DM Mono', monospace", color: '#DC9596', fontSize: '11px', fontWeight: 'bold' }}>
                      {idx + 1}.
                    </span>
                    {conn.left}
                  </div>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                {vis2InView && (
                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                    {CONNECTIONS.map((conn, idx) => {
                      const y = 42 + idx * 114;
                      const pathD = `M 0 ${y} C 70 ${y}, 110 ${y}, 180 ${y}`;
                      const isHovered = hoveredRow === idx;
                      return (
                        <g key={conn.id}>
                          <motion.path
                            d={pathD}
                            fill="none"
                            stroke={isHovered ? '#730071' : 'rgba(115, 0, 113, 0.25)'}
                            strokeWidth={isHovered ? 3 : 1.5}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.9, delay: idx * 0.15, ease: 'easeOut' }}
                            style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}
                {CONNECTIONS.map((conn, idx) => {
                  const y = 42 + idx * 114;
                  const isHovered = hoveredRow === idx;
                  return (
                    <div
                      key={conn.id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                        background: isHovered ? '#730071' : '#F5F3EE',
                        border: `1px solid ${isHovered ? '#730071' : 'rgba(57, 0, 64, 0.12)'}`,
                        color: isHovered ? '#fff' : '#7a6678',
                        fontSize: '9.5px',
                        fontFamily: "'DM Mono', monospace",
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        letterSpacing: '0.04em',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}
                    >
                      {conn.pill}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', zIndex: 5 }}>
                {CONNECTIONS.map((conn, idx) => {
                  const isHovered = hoveredRow === idx;
                  return (
                    <div
                      key={conn.id}
                      data-hover="true"
                      style={{
                        background: '#390040',
                        color: '#fff',
                        border: '1.5px solid transparent',
                        padding: '16px 20px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        boxShadow: isHovered ? '0 12px 30px rgba(115, 0, 113, 0.3)' : 'none',
                        transform: isHovered ? 'translateX(4px)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        minHeight: '84px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'default'
                      }}
                    >
                      <span style={{ marginRight: '12px', fontFamily: "'DM Mono', monospace", color: '#DC9596', fontSize: '11px', fontWeight: 'bold' }}>
                        {idx + 1}.
                      </span>
                      {conn.right}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="connector-mobile" style={{ display: 'none', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
            {CONNECTIONS.map((conn, idx) => (
              <div key={conn.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '360px' }}>
                <div style={{ background: '#fff', border: '1px solid rgba(57, 0, 64, 0.12)', padding: '20px', borderRadius: '8px', fontSize: '14px', color: '#390040', lineHeight: 1.5, width: '100%', fontWeight: 500, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: '#DC9596', fontSize: '10px', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Cause {idx + 1}</div>
                  {conn.left}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: '#F5F3EE', border: '1px solid rgba(57, 0, 64, 0.12)', color: '#7a6678', fontSize: '10px', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', padding: '4px 12px', borderRadius: '12px', letterSpacing: '0.05em' }}>
                    {conn.pill}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#730071" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/>
                  </svg>
                </div>
                <div style={{ background: '#390040', color: '#fff', padding: '20px', borderRadius: '8px', fontSize: '14px', lineHeight: 1.5, width: '100%', textAlign: 'center', boxShadow: '0 8px 20px rgba(57,0,64,0.15)' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: '#DC9596', fontSize: '10px', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Fix {idx + 1}</div>
                  {conn.right}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontStyle: 'italic', color: '#7a6678', letterSpacing: '0.01em' }}>
              Every line here is a root cause this prototype directly addresses.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '96px', borderTop: '1px solid rgba(57, 0, 64, 0.1)', paddingTop: '40px' }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontStyle: 'italic', color: '#730071', letterSpacing: '-0.5px' }}>
            Offline. In your language. No smartphone required.
          </h4>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .connector-desktop { display: none !important; }
          .connector-mobile { display: flex !important; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

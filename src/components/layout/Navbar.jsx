import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NAV_LINKS = [
  { num: '—', href: '#reality', label: 'Reality' },
  { num: '∿', href: '#calculator', label: 'Calculator' },
  { num: '01', href: '#topic', label: 'Topic' },
  { num: '02', href: '#research', label: 'Research' },
  { num: '03', href: '#personas', label: 'Personas' },
  { num: '03B', href: '#journey-maps', label: 'Journeys' },
  { num: '04', href: '#rca', label: 'Root Cause' },
  { num: '05', href: '#hmw', label: 'HMW' },
  { num: '06', href: '#ideation', label: '6-3-5' },
  { num: '07', href: '#synthesis', label: 'Triple-T' },
  { num: '—', href: '#solutions', label: 'Solutions' },
  { num: '—', href: '#prototype', label: 'Prototype' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('topic');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1));
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -80, opacity: 0, x: '-50%' }}
      animate={{ y: scrolled ? 24 : 0, opacity: 1, x: '-50%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: scrolled ? '0 12px' : '0 48px',
        width: scrolled ? 'auto' : '100%',
        height: '64px',
        background: scrolled ? 'rgba(57,0,64,0.95)' : 'transparent',
        borderRadius: scrolled ? '32px' : '0px',
        boxShadow: scrolled ? '0 8px 32px rgba(57,0,64,0.2)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <ul style={{ display: 'flex', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
        {NAV_LINKS.map(({ num, href, label }) => {
          const sectionId = href.slice(1);
          const isActive = activeSection === sectionId;
          return (
            <li key={href} style={{ position: 'relative', display: 'flex' }}>
              <a
                href={href}
                onClick={e => handleClick(e, href)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 500 : 400,
                  color: scrolled ? (isActive ? '#fff' : 'rgba(255,255,255,0.4)') : (isActive ? '#390040' : '#7a6678'),
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                  padding: scrolled ? '10px 14px' : '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontFamily: "'DM Mono', monospace",
                  background: scrolled && isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRadius: scrolled ? '20px' : '0px',
                }}
              >
                <span style={{
                  color: scrolled ? (isActive ? '#DC9596' : 'rgba(220,149,150,0.4)') : (isActive ? '#DC9596' : '#DC959680'),
                  fontSize: '9px'
                }}>{num}</span>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

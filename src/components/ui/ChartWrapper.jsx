import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

// Lazy-renders children only when scrolled into viewport
export default function ChartWrapper({ children, height = 300, caption }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref}>
      <div style={{ position: 'relative', height, width: '100%' }}>
        {inView ? children : (
          <div style={{
            height: '100%',
            background: 'rgba(57,0,64,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid rgba(57,0,64,0.15)',
              borderTopColor: '#730071',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
      </div>
      {caption && <p className="chart-caption">{caption}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

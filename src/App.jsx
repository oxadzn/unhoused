import React, { Suspense } from 'react';
import './styles/globals.css';
import { useLenis } from './hooks/useLenis';

import CustomCursor from './components/layout/CustomCursor';
import ScrollProgress from './components/layout/ScrollProgress';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackToTop from './components/layout/BackToTop';
import GradientBlinds from './components/ui/GradientBlinds';
import GradualBlur from './components/ui/GradualBlur';

import Hero from './components/sections/Hero';
import RealitySection from './components/sections/RealitySection';
import AffordabilitySection from './components/sections/AffordabilitySection';
import TopicSection from './components/sections/TopicSection';
import ResearchSection from './components/sections/ResearchSection';
import PersonasSection from './components/sections/PersonasSection';
import JourneyMapsSection from './components/sections/JourneyMapsSection';
import RCASection from './components/sections/RCASection';
import HMWSection from './components/sections/HMWSection';
import IdeationSection from './components/sections/IdeationSection';
import SynthesisSection from './components/sections/SynthesisSection';
import SolutionsSection from './components/sections/SolutionsSection';
import EMIStressSection from './components/sections/EMIStressSection';
import PrototypeSection from './components/sections/PrototypeSection';

function LoadingFallback() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#F5F3EE',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '28px',
        color: '#390040',
        letterSpacing: '-1px',
      }}>
        Unhoused
      </div>
    </div>
  );
}

function App() {
  useLenis();

  return (
    <>
      <CustomCursor />
      <ScrollProgress />

      {/* Dynamic Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, opacity: 0.57, pointerEvents: 'none' }}>
        <GradientBlinds
          gradientColors={['#F5F3EE', '#EDE9DF']}
          angle={15}
          noise={0.03}
          blindCount={12}
          spotlightOpacity={0}
          mixBlendMode="normal"
        />
      </div>

      <Navbar />

      <main id="main-content">
        <Hero />

        {/* Emotional reality — before the research journey */}
        <RealitySection />

        {/* Interactive affordability calculator */}
        <AffordabilitySection />

        {/* Design thinking journey */}
        <TopicSection />
        <ResearchSection />
        <PersonasSection />
        <JourneyMapsSection />

        {/* EMI stress tool — contextually between RCA and HMW */}
        <RCASection />
        <EMIStressSection />

        <HMWSection />
        <IdeationSection />
        <SynthesisSection />
        <SolutionsSection />
        <PrototypeSection />
      </main>

      {/* Bottom Footer Blur */}
      <GradualBlur position="bottom" height="5rem" strength={0.5} divCount={4} curve="linear" target="page" zIndex={900} />
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;

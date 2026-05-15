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
import TopicSection from './components/sections/TopicSection';
import ResearchSection from './components/sections/ResearchSection';
import PersonasSection from './components/sections/PersonasSection';
import JourneyMapsSection from './components/sections/JourneyMapsSection';
import RCASection from './components/sections/RCASection';
import HMWSection from './components/sections/HMWSection';
import IdeationSection from './components/sections/IdeationSection';
import SynthesisSection from './components/sections/SynthesisSection';
import SolutionsSection from './components/sections/SolutionsSection';

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

      <main>
        <Hero />
        <TopicSection />
        <ResearchSection />
        <PersonasSection />
        <JourneyMapsSection />
        <RCASection />
        <HMWSection />
        <IdeationSection />
        <SynthesisSection />
        <SolutionsSection />
      </main>

      {/* Bottom Footer Blur */}
      <GradualBlur position="bottom" height="5rem" strength={0.5} divCount={8} curve="linear" target="page" zIndex={900} />
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;

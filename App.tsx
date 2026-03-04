import React from 'react';
import Navigation from './components/Navigation.tsx';
import Hero from './components/Hero.tsx';
import Nations from './components/Nations.tsx';
import Pillars from './components/Pillars.tsx';
import MorePillars from './components/MorePillars.tsx';
import Manifesto from './components/Manifesto.tsx';
import Timeline from './components/Timeline.tsx';
import Community from './components/Community.tsx';
import JoinSection from './components/JoinSection.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-white selection:bg-crimson-600/30 selection:text-white">
      <Navigation />
      <Hero />
      <Nations />
      <Pillars />
      <MorePillars />
      <Manifesto />
      <Timeline />
      <Community />
      <JoinSection />
      <Footer />
    </div>
  );
};

export default App;

import React from 'react';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PopularDestinations from './PopularDestinations';
import AppPromotion from './AppPromotion';
// import BecomeHost from './BecomeHost';

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSection />
        <PopularDestinations />
        <AppPromotion /> 
        {/* <BecomeHost /> */}
      </main>

      <Footer />
    </div>
  );
};

export default HomeScreen;
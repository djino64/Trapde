import React from 'react';

import Footer from '../../components/layout/Footer';

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PopularDestinations from './PopularDestinations';
import AppPromotion from './AppPromotion';
// import BecomeHost from './BecomeHost';

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen">
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
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  HeroSection,
  ProductShowcase,
  CompanyStory,
  MissionVision,
  FoundersSection
} from '../components/about';

const AboutUs = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>About Us | Shyam International</title>
        <meta name="description" content="Learn about Shyam International's 60+ years of exporting quality Indian products worldwide" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />
        
        <main>
          <HeroSection />
          <ProductShowcase />
          <CompanyStory />
          <MissionVision />
          <FoundersSection />
        </main>

        <Footer />
      </div>
    </>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;

import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../components/ErrorBoundary'; // Use simple version
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import  LoadingSpinner  from '../components/ui/LoadingSpinner';

// Lazy load sections
const HeroSection = lazy(() => import('../components/sections/HeroSection'));
const ProductsSection = lazy(() => import('../components/sections/ProductsSection'));
const FeaturesSection = lazy(() => import('../components/sections/FeaturesSection'));
const AboutSection = lazy(() => import('../components/sections/AboutSection'));
const StatisticsSection = lazy(() => import('../components/sections/StatisticsSection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));
const FeedbackSection = lazy(() => import('../components/sections/FeedbackSection'));

const Home = React.memo(() => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <ErrorBoundary>
        <main>
          <Suspense fallback={<LoadingSpinner message="Loading hero section..." />}>
            <HeroSection />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner message="Loading products..." />}>
            <ProductsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner message="Loading features..." />}>
            <FeaturesSection />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner message="Loading about section..." />}>
            <AboutSection />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner message="Loading statistics..." />}>
            <StatisticsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner message="Loading contact form..." />}>
            <ContactSection />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner message="Loading feedback form..." />}>
            <FeedbackSection />
          </Suspense>
        </main>
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
});

Home.displayName = 'Home';

export default Home;

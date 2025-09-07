import React, { useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from '../ImageCarousel';
import { useBanners } from '../hooks/useBanners';
import LoadingSpinner from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';

const HeroSection = React.memo(() => {
  const { 
    banners, 
    loading: bannersLoading, 
    error: bannersError, 
    connectionStatus,
    fetchBanners 
  } = useBanners();

  const navigate = useNavigate();

  useEffect(() => {
    if (connectionStatus === 'unknown') {
      fetchBanners();
    }
  }, [fetchBanners, connectionStatus]);

  const carouselImages = useMemo(() => banners, [banners]);

  return (
    <section className="max-w-6xl mx-auto px-2 py-10">
      <div className="text-left mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Welcome to Shyam Global Trade
        </h1>
        <p className="text-gray-600 mb-5 leading-relaxed text-justify">
         At Shyam Internation, we trade in various categories and currently expanding our categories as well. We trade in Unbreakable households, Cowdung product and Attar.
        </p>
        
        <button 
          onClick={() => navigate('/contactus')} 
          className="bg-[#254F7E] text-white px-8 py-3 rounded hover:bg-[#1e3f66] transition-colors duration-200 inline-flex items-center"
        >
          Inquire Now
          <ArrowRight className="ml-3 w-4 h-4" />
        </button>
      </div>

      {/* Banner Carousel */}
      {(carouselImages.length > 0 || bannersLoading) && (
        <div className="relative">
          {bannersLoading && (
            <div className="absolute inset-0 z-10 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
              <LoadingSpinner message="Loading banners..." />
            </div>
          )}
          
          {carouselImages.length > 0 && (
            <ImageCarousel images={carouselImages} />
          )}
          
          {!bannersLoading && carouselImages.length === 0 && bannersError && (
            <EmptyState
              icon="🖼️"
              title="Banner Images Unavailable"
              description="We're having trouble loading our banner images at the moment."
              action={
                <button 
                  onClick={fetchBanners}
                  className="px-6 py-3 bg-[#254F7E] text-white rounded hover:bg-[#1e3f66] transition-colors"
                >
                  Retry Loading
                </button>
              }
            />
          )}
        </div>
      )}
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;

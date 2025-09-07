import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useBanners } from '../components/hooks/useBanners'; // Adjust path as needed
import CarouselSlide from './carousel/CarouselSlide';
import CarouselIndicators from './carousel/CarouselIndicators';
import CarouselControls from './carousel/CarouselControls';

const ImageCarousel = React.memo(({ 
  images: externalImages,
  autoPlay = true, 
  interval = 4000,
  showIndicators = true,
  showControls = true,
  pauseOnHover = true,
  ariaLabel = "Image carousel",
  useBannersData = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  
  const timerRef = useRef(null);
  const carouselRef = useRef(null);

  // Use the banners hook
  const {
    banners,
    loading: bannersLoading,
    error: bannersError,
    connectionStatus
  } = useBanners();

  // Determine which images to use
  const images = useMemo(() => {
    if (useBannersData && banners?.length > 0) {
      return banners;
    }
    return externalImages || [];
  }, [useBannersData, banners, externalImages]);

  // Helper functions - UPDATED to use environment variable
  const getImageUrl = useCallback((imageItem) => {
    if (!imageItem) return '';
    
    if (typeof imageItem === 'string') return imageItem;
    
    // Handle banner data structure from your API
    if (imageItem.image) {
      // If it's already a full URL (Cloudinary), use it directly
      if (imageItem.image.startsWith('http')) return imageItem.image;
      
      // Use environment variable for base URL
      const BASE_URL = process.env.REACT_APP_API_URL || '';
      if (imageItem.image.startsWith('uploads/')) {
        return `${BASE_URL}/${imageItem.image}`;
      }
      return `${BASE_URL}/uploads/${imageItem.image}`;
    }
    
    return imageItem.src || '';
  }, []);

  const getImageKey = useCallback((imageItem, index) => {
    return imageItem._id || imageItem.id || `image-${index}`;
  }, []);

  const processedImages = useMemo(() => {
    return images.map((imageItem, index) => ({
      ...imageItem,
      url: getImageUrl(imageItem),
      key: getImageKey(imageItem, index),
      alt: imageItem.alt || imageItem.title || imageItem.description || `Slide ${index + 1}`
    }));
  }, [images, getImageUrl, getImageKey]);

  // Reset current index when images change
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  // Auto-play timer management
  useEffect(() => {
    if (!isAutoPlayActive || images.length <= 1 || (pauseOnHover && isHovered) || bannersLoading) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlayActive, interval, images.length, isHovered, pauseOnHover, bannersLoading]);

  // Event handlers
  const handleImageLoad = useCallback((index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  }, []);

  const handleImageError = useCallback((index, src) => {
    console.error(`Failed to load image at index ${index}:`, src);
    setImageLoadErrors(prev => ({ ...prev, [index]: true }));
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlayActive(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case ' ':
        e.preventDefault();
        toggleAutoPlay();
        break;
      default:
        break;
    }
  }, [goToPrevious, goToNext, toggleAutoPlay]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  }, [pauseOnHover]);

  // Loading state
  if (useBannersData && bannersLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-lg">Loading banners...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (useBannersData && bannersError && connectionStatus === 'disconnected') {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-lg text-red-600">Unable to load banners</p>
          <p className="text-sm mt-1">{bannersError}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-lg">
            {useBannersData ? 'No banners available' : 'No images to display'}
          </p>
        </div>
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div
      ref={carouselRef}
      className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg bg-gray-200 focus-within:ring-2 focus-within:ring-blue-500"
      role="region"
      aria-label={ariaLabel}
      aria-live="polite"
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing image {currentIndex + 1} of {images.length}
      </div>

      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {processedImages.map((imageItem, index) => (
          <CarouselSlide
            key={imageItem.key}
            image={imageItem}
            index={index}
            isLoaded={imagesLoaded[index]}
            hasError={imageLoadErrors[index]}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index, imageItem.url)}
          />
        ))}
      </div>

      {hasMultipleImages && showControls && (
        <CarouselControls
          onPrevious={goToPrevious}
          onNext={goToNext}
          currentIndex={currentIndex}
          totalImages={images.length}
        />
      )}

      {hasMultipleImages && showIndicators && (
        <CarouselIndicators
          images={images}
          currentIndex={currentIndex}
          onGoToSlide={goToSlide}
        />
      )}
    </div>
  );
});

ImageCarousel.displayName = 'ImageCarousel';

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
        image: PropTypes.string, // Now contains Cloudinary URLs
        src: PropTypes.string,
        alt: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      })
    ])
  ),
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showIndicators: PropTypes.bool,
  showControls: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  ariaLabel: PropTypes.string,
  useBannersData: PropTypes.bool
};

export default ImageCarousel;

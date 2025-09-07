import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCarouselSlide from '../components/carousel/ProductCarouselSlide'; // Import your existing component

// Updated image helper for Cloudinary
const getImageUrl = (imageSource) => {
  // If it's already a full URL (Cloudinary URL), return as is
  if (imageSource?.startsWith('http')) {
    return imageSource;
  }
  // Fallback for any remaining local images
  return imageSource;
};

const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

const ProductCarousel = React.memo(({ 
  products = [], 
  autoPlay = true, 
  interval = 4000,
  showIndicators = true,
  showControls = true,
  pauseOnHover = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  
  const timerRef = useRef(null);
  const carouselRef = useRef(null);

  // Memoize processed products to prevent recalculation
  const processedProducts = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      id: product._id || product.id || `product-${index}`,
      imageUrl: getImageUrl(product.image) || PLACEHOLDER_IMAGE
    }));
  }, [products]);

  // Calculate total slides based on items per view
  const totalSlides = Math.max(0, processedProducts.length - visibleItems + 1);

  // Responsive design handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setVisibleItems(itemsPerView.large);
      } else if (width >= 1024) {
        setVisibleItems(itemsPerView.desktop);
      } else if (width >= 768) {
        setVisibleItems(itemsPerView.tablet);
      } else {
        setVisibleItems(itemsPerView.mobile);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  // Auto-play timer management
  useEffect(() => {
    if (!isAutoPlayActive || totalSlides <= 1 || (pauseOnHover && isHovered)) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlayActive, interval, totalSlides, isHovered, pauseOnHover]);

  // Reset current index when products change
  useEffect(() => {
    if (processedProducts.length > 0 && currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [processedProducts.length, currentIndex, totalSlides]);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
    );
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlayActive(prev => !prev);
  }, []);

  // Keyboard navigation
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

  // Mouse hover handlers
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

  // Empty state
  if (!processedProducts.length) {
    return (
      <div className="text-center py-8 bg-gray-100 rounded-lg">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-gray-600">No products to display.</p>
      </div>
    );
  }

  // Single item or items fit in view - no carousel needed
  if (processedProducts.length <= visibleItems) {
    return (
      <div className="w-full p-4  rounded-lg">
        <div className="flex flex-wrap">
          {processedProducts.map((product) => (
            <ProductCarouselSlide
              key={product.id}
              product={product}
              visibleItems={visibleItems}
              isVisible={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="relative w-full  rounded-lg overflow-hidden  focus-within:ring-2 focus-within:ring-blue-500"
      role="region"
      aria-label="Product carousel"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing products {currentIndex + 1} to {Math.min(currentIndex + visibleItems, processedProducts.length)} of {processedProducts.length}
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden p-4">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {processedProducts.map((product, index) => (
            <ProductCarouselSlide
              key={product.id}
              product={product}
              visibleItems={visibleItems}
              isVisible={index >= currentIndex && index < currentIndex + visibleItems}
            />
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';

ProductCarousel.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      image: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showIndicators: PropTypes.bool,
  showControls: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  itemsPerView: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
    large: PropTypes.number
  })
};

export default ProductCarousel;

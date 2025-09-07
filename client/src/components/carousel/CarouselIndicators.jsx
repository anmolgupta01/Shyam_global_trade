import React from 'react';

const CarouselIndicators = React.memo(({ 
  images = [], // ✅ Add default empty array
  currentIndex = 0, // ✅ Also add default for currentIndex
  onGoToSlide 
}) => {
  // ✅ Add guard clause for extra safety
  if (!images || images.length === 0) {
    return null; // Don't render anything if no images
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
      {images.map((_, index) => (
        <button
          key={`dot-${index}`}
          onClick={() => onGoToSlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            index === currentIndex 
              ? 'bg-white shadow-lg' 
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          }`}
          aria-label={`Go to slide ${index + 1} of ${images.length}`}
          aria-current={index === currentIndex ? 'true' : 'false'}
        />
      ))}
    </div>
  );
});

CarouselIndicators.displayName = 'CarouselIndicators';

export default CarouselIndicators;

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselControls = React.memo(({ 
  onPrevious, 
  onNext, 
  currentIndex, 
  totalImages 
}) => {
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 z-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label={`Previous image (${currentIndex === 0 ? totalImages : currentIndex} of ${totalImages})`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 z-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label={`Next image (${currentIndex + 2 > totalImages ? 1 : currentIndex + 2} of ${totalImages})`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
});

CarouselControls.displayName = 'CarouselControls';

export default CarouselControls;

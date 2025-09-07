import React from 'react';

const CarouselSlide = React.memo(({ 
  image, 
  index, 
  isLoaded, 
  hasError, 
  onLoad, 
  onError 
}) => {
  return (
    <div className="w-full h-full flex-shrink-0 relative">
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      )}
      
      {/* Error placeholder */}
      {hasError && (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-600 p-4">
            <div className="text-3xl mb-2">🚫</div>
            <p className="text-sm font-medium">Image failed to load</p>
            {image.title && (
              <p className="text-xs mt-1 text-gray-500">{image.title}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {!hasError && image.url && (
        <img
          src={image.url}
          alt={image.alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={onLoad}
          onError={onError}
          loading="lazy"
        />
      )}
    </div>
  );
});

CarouselSlide.displayName = 'CarouselSlide';

export default CarouselSlide;

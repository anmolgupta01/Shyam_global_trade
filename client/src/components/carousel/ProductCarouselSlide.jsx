import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../utils/imageHelpers';

const ProductCarouselSlide = React.memo(({ 
  product, 
  visibleItems, 
  isVisible 
}) => {
  const navigate = useNavigate();
  
  // Enhanced width class calculation for better responsive support
  const getWidthClass = (items) => {
    switch (items) {
      case 1:
        return 'w-full';
      case 2:
        return 'w-1/2';
      case 3:
        return 'w-1/3';
      case 4:
        return 'w-1/4';
      case 5:
        return 'w-1/5';
      case 6:
        return 'w-1/6';
      default:
        return 'w-1/3'; // fallback
    }
  };
  
  const widthClass = getWidthClass(visibleItems);
  
  // Handle card click navigation with scroll to top
  const handleCardClick = () => {
    navigate('/products');
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className={`${widthClass} flex-shrink-0 px-2`}>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full border border-gray-200 cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Image Container */}
        <div className="h-48 overflow-hidden relative bg-gray-100">
          <img
            src={product.imageUrl || PLACEHOLDER_IMAGE}
            alt={product.name || 'Product image'}
            className="w-full h-full object-cover transition-opacity duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
            loading={isVisible ? 'eager' : 'lazy'}
          />
          
          {/* Optional overlay for hover effect */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        
        {/* Content Container */}
        <div className="p-4 flex flex-col justify-between h-auto min-h-[120px]">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base leading-tight">
            {product.name || 'Unnamed Product'}
          </h3>
          
          {/* Product Category & Additional Info */}
          <div className="flex flex-col gap-2">
            {product.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full self-start">
                {product.category}
              </span>
            )}
            
            {/* Product Code if available */}
            {product.code && (
              <span className="text-xs text-gray-500 font-mono">
                Code: {product.code}
              </span>
            )}
            
            {/* Price if available */}
            {product.price && (
              <span className="text-sm font-semibold text-green-600">
                {typeof product.price === 'number' ? `$${product.price}` : product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCarouselSlide.displayName = 'ProductCarouselSlide';
export default ProductCarouselSlide;

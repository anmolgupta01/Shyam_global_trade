import React from 'react';

const getImageUrl = (imageSource) => {
  if (imageSource?.startsWith('http')) {
    return imageSource;
  }
  return imageSource;
};

const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

export const ProductCard = React.memo(({ product, viewMode, onClick }) => {
  const productImageUrl = getImageUrl(product.image) || PLACEHOLDER_IMAGE;
  
  return (
    <div 
      onClick={() => onClick(product)}
      className={`bg-white rounded-md shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`${viewMode === 'list' ? 'w-24 flex-shrink-0' : 'aspect-[4/3]'}`}>
        <img
          src={productImageUrl}
          alt={product.name}
          className="w-full h-full object-cover bg-gray-100"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          loading="lazy"
        />
      </div>
      <div className="p-2 flex-1">
        <h3 className="font-medium text-gray-900 mb-0.5 text-sm leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-0.5">Code: {product.code}</p>
        <p className="text-xs text-gray-500 mb-1.5 line-clamp-1">{product.description}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

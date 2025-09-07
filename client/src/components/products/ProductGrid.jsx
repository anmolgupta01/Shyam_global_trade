import React from 'react';
import {ProductCard} from './ProductCard';
import {ProductPagination} from './ProductPagination';

export const ProductGrid = React.memo(({
  products,
  viewMode,
  pagination,
  onProductClick,
  onPageChange,
  onClearFilters,
  searchQuery
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">🔍</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">No products found</h3>
        <p className="text-sm text-gray-600 mb-3">
          Try adjusting your search terms or filter selection.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {pagination.totalProducts} products
          {searchQuery && (
            <span> for "<span className="font-medium">{searchQuery}</span>"</span>
          )}
        </p>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode={viewMode}
            onClick={onProductClick}
          />
        ))}
      </div>

      {/* Pagination */}
      <ProductPagination
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </>
  );
});

ProductGrid.displayName = 'ProductGrid';

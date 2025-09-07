import React from 'react';
import { Link } from 'react-router-dom';
import ProductCarousel from '../ProductCarousel';
import { useProducts } from '../hooks/useProducts';
import  LoadingSpinner  from '../ui/LoadingSpinner';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import { EmptyState } from '../ui/EmptyState';

const ProductsSection = React.memo(() => {
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();

  // Handler to scroll to top on click
  const handleExploreClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-6xl mx-auto px-2 py-4" id="products">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Product Categories we Export
        </h2>
        <Link to='/products' onClick={handleExploreClick}>
          <button className="bg-[#254F7E] text-white px-6 py-3 rounded text-sm hover:bg-[#1e3f66] transition-colors">
            Explore Products
          </button>
        </Link>
      </div>
      
      <div>
        {productsLoading ? (
          <LoadingSpinner message="Loading products..." />
        ) : productsError ? (
          <ErrorDisplay error={productsError} onRetry={refetchProducts} />
        ) : products.length > 0 ? (
          <ProductCarousel products={products} />
        ) : (
          <EmptyState
            icon="📦"
            title="Products Coming Soon"
            description="We're updating our product catalog. Please check back later or contact us directly."
            action={
              <button 
                onClick={refetchProducts}
                className="px-6 py-3 bg-[#254F7E] text-white rounded hover:bg-[#1e3f66] transition-colors"
              >
                Refresh Products
              </button>
            }
          />
        )}
      </div>
    </section>
  );
});

ProductsSection.displayName = 'ProductsSection';
export default ProductsSection;

import React from 'react';
import { useProducts } from '../../components/hooks/useProducts';
import ProductCarousel from '../ProductCarousel';
import { LoadingSpinner, ErrorDisplay } from '../ui';
import { Link } from "react-router-dom";

const ProductShowcase = React.memo(() => {
  const { products, loading, error } = useProducts();
  
  const handleRetry = () => {
    window.location.reload();
  };

  // Function to handle explore products click and scroll to top
  const handleExploreClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-1 bg-gray-50">
      <div className="text-center mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          What We Export
        </h2>
      </div>
      
      <p className="text-gray-600 leading-snug font-semibold text-justify mb-2">
        We export a wide range of Indian products, including unbreakable plastic household items ,cowdung products, Attar and other:
      </p>
      
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={handleRetry} />
      ) : (
        <ProductCarousel products={products} />
      )}
      
      <div className="flex justify-center mt-2">
        <Link 
          to='/products'
          onClick={handleExploreClick}
          className="bg-[#254F7E] text-white px-5 py-2.5 rounded text-sm hover:bg-[#1e3f66] transition-colors inline-block"
        >
          Explore Products
        </Link>
      </div>
    </section>
  );
});

ProductShowcase.displayName = 'ProductShowcase';
export default ProductShowcase;

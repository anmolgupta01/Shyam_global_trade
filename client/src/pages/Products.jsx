import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ProductFilters, ProductGrid, ProductDetailModal } from '../components/products';
import { useProductSearch } from '../components/hooks/useProductSearch';
import { LoadingSpinner, ErrorDisplay } from '../components/ui';

const Products = React.memo(() => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    products, categories, loading, error, pagination, searchQuery, 
    selectedCategory, viewMode, setSearchQuery, setSelectedCategory,
    setViewMode, handlePageChange, clearFilters, refetch
  } = useProductSearch();

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Function to handle enquire click and scroll to top
  const handleEnquireClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Our Products | Shyam International</title>
        <meta name="description" content="Browse our complete product catalog with search and filter options" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filters */}
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalProducts={pagination.totalProducts}
            />
            
            {/* Products */}
            <div className="flex-1">
              {loading ? (
                <LoadingSpinner message="Loading products..." />
              ) : error ? (
                <ErrorDisplay error={error} onRetry={refetch} />
              ) : (
                <ProductGrid
                  products={products}
                  viewMode={viewMode}
                  pagination={pagination}
                  onProductClick={handleProductClick}
                  onPageChange={handlePageChange}
                  onClearFilters={clearFilters}
                  searchQuery={searchQuery}
                />
              )}
              
              <div className="mt-8 text-center">
                <Link 
                  to="/contactus"
                  onClick={handleEnquireClick}
                  className="inline-block bg-[#254F7E] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#1e3f66] transition-colors text-sm"
                >
                  ENQUIRE NOW
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
        
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEnquire={handleEnquireClick} // Updated to use the new function
        />
      </div>
    </>
  );
});

Products.displayName = 'Products';
export default Products;

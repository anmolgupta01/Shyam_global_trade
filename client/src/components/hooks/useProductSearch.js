import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export const useProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });

  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  // Get API base URL with fallback
  const getApiBaseUrl = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:5001';
  };

  // Fetch categories - FIXED: Better error handling and API URL
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = getApiBaseUrl();
        const url = `${API_BASE_URL}/api/products/categories`;
       
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Categories fetch failed: ${response.status} ${response.statusText}`);
          // Don't throw error for categories - just use fallback
          return;
        }
        
        const data = await response.json();
      
        if (data.success && data.data && Array.isArray(data.data.categories)) {
          const validCategories = data.data.categories
            .filter(cat => cat && typeof cat === 'string' && cat.trim().length > 0)
            .map(cat => cat.trim());
          
          // Remove duplicates and filter out 'All' since backend already includes it
          const uniqueCategories = [...new Set(validCategories)];
          
         
          setCategories(uniqueCategories);
        } else {
          console.warn('Categories not in expected format:', data);
          setCategories(['All']); // Fallback
        }
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        setCategories(['All']); // Fallback to prevent empty categories
      }
    };

    fetchCategories();
  }, []); // Run once on mount

  // Fetch products - FIXED: Better error handling and API URL consistency
  useEffect(() => {
    const fetchProducts = async (page = 1, limit = 12) => {
      try {
        setLoading(true);
        setError(null);
        
        const API_BASE_URL = getApiBaseUrl();
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(selectedCategory !== 'All' && { category: selectedCategory })
        });

        const url = `${API_BASE_URL}/api/products?${params}`;
     
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
     
        if (data.success) {
          setProducts(data.data.products || []);
          setPagination(data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: 12
          });
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('❌ Fetch Error:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(currentPage);
  }, [debouncedSearchTerm, selectedCategory, currentPage]);

  // Reset to page 1 when search/category changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedCategory]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setCurrentPage(1);
  }, []);

  const refetch = useCallback(() => {
    setCurrentPage(prev => prev); // Trigger re-fetch with current page
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    pagination,
    searchQuery,
    selectedCategory,
    viewMode,
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    handlePageChange,
    clearFilters,
    refetch
  };
};
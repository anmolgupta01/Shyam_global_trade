import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Move outside component to prevent recreation on each render
const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();
const API_CONFIG = {
  PRODUCTS_URL: `${API_BASE_URL}/api/products`
};

// Constants to prevent recreation
const DEFAULT_OPTIONS = {
  page: 1,
  search: '',
  limit: 10,
  isAdmin: false
};

export const useProducts = (options = DEFAULT_OPTIONS) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Use ref to prevent unnecessary re-renders when options change
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Memoize extracted options to prevent unnecessary re-renders
  const { page, search, limit, isAdmin } = useMemo(() => ({
    page: options.page ?? DEFAULT_OPTIONS.page,
    search: options.search ?? DEFAULT_OPTIONS.search,
    limit: options.limit ?? DEFAULT_OPTIONS.limit,
    isAdmin: options.isAdmin ?? DEFAULT_OPTIONS.isAdmin
  }), [options.page, options.search, options.limit, options.isAdmin]);

  // Memoized helper functions
  const processCategories = useCallback((categoryData) => {
    if (!categoryData) return [];
    
    let categories = Array.isArray(categoryData) 
      ? categoryData 
      : typeof categoryData === 'object' 
        ? Object.values(categoryData) 
        : [];
    
    const validCategories = categories
      .filter(cat => cat && typeof cat === 'string' && cat.trim().length > 0)
      .map(cat => cat.trim());
    
    return [...new Set(validCategories)]; // Remove duplicates
  }, []);

  const processProductsData = useCallback((productsArray) => {
    const productsByCategory = {};
    productsArray.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!productsByCategory[category]) {
        productsByCategory[category] = product;
      }
    });
    return Object.values(productsByCategory);
  }, []);

  // Enhanced error handling
  const handleApiError = useCallback((error, context) => {
    console.error(`❌ Error ${context}:`, error);
    
    if (error.message.includes('Image upload failed') || error.message.includes('cloud storage')) {
      return `Failed to upload image to cloud storage. Please try again.`;
    }
    
    if (error.message.includes('HTTP error')) {
      return `Server error: ${error.message}`;
    }
    
    return `Failed to ${context}: ${error.message}`;
  }, []);

  // Optimized fetch function with better error handling
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = isAdmin 
        ? `${API_CONFIG.PRODUCTS_URL}?${new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search })
          })}`
        : API_CONFIG.PRODUCTS_URL;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Server returned HTML instead of JSON - check if your backend API is running');
      }
      
      const apiResponse = await response.json();

      // Streamlined data extraction
      let productsArray = [];
      if (apiResponse.success && apiResponse.data?.products) {
        productsArray = apiResponse.data.products;
        if (isAdmin && apiResponse.data.pagination) {
          setTotalProducts(apiResponse.data.pagination.totalProducts || 0);
        }
      } else if (Array.isArray(apiResponse)) {
        productsArray = apiResponse;
      } else if (Array.isArray(apiResponse.data)) {
        productsArray = apiResponse.data;
      } else {
        throw new Error('API returned data in unexpected format');
      }

      const finalProducts = isAdmin ? productsArray : processProductsData(productsArray);
      setProducts(finalProducts);
      
    } catch (err) {
      const errorMessage = handleApiError(err, 'loading products');
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, limit, isAdmin, processProductsData, handleApiError]);

  // Optimized categories fetch
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.PRODUCTS_URL}/categories`);
      
      if (!response.ok) {
        console.warn('Categories endpoint failed, skipping...');
        return;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.warn('Categories endpoint returned non-JSON content');
        return;
      }
      
      const data = await response.json();
      
      // Streamlined data extraction
      const categoriesData = 
        data.success && data.data?.categories ? data.data.categories :
        data.success && Array.isArray(data.data) ? data.data :
        Array.isArray(data) ? data :
        Array.isArray(data.categories) ? data.categories :
        [];
      
      const processedCategories = processCategories(categoriesData);
      setCategories(processedCategories);
      
    } catch (err) {
      console.warn('Categories fetch failed:', err.message);
      // Don't throw error - categories are not critical
    }
  }, [processCategories]);

  // Generic CRUD operation handler
  const performCrudOperation = useCallback(async (operation, url, options = {}) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('Image upload failed')) {
          throw new Error('Failed to upload image to cloud storage. Please try again.');
        }
        throw new Error(`Operation failed with status: ${response.status}`);
      }

      // Refresh data after successful operation
      await Promise.all([fetchProducts(), fetchCategories()]);
      
      return response.json();
    } catch (error) {
      throw error;
    }
  }, [isAdmin, fetchProducts, fetchCategories]);

  // Optimized CRUD operations
  const createProduct = useCallback(async (formData) => {
    return performCrudOperation(
      'create',
      API_CONFIG.PRODUCTS_URL,
      { method: 'POST', body: formData }
    );
  }, [performCrudOperation]);

  const updateProduct = useCallback(async (id, formData) => {
    return performCrudOperation(
      'update',
      `${API_CONFIG.PRODUCTS_URL}/${id}`,
      { method: 'PUT', body: formData }
    );
  }, [performCrudOperation]);

  const deleteProduct = useCallback(async (id) => {
    await performCrudOperation(
      'delete',
      `${API_CONFIG.PRODUCTS_URL}/${id}`,
      { method: 'DELETE' }
    );
  }, [performCrudOperation]);

  // Memoized return values to prevent unnecessary re-renders
  const adminReturn = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    totalProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  }), [products, categories, loading, error, totalProducts, createProduct, updateProduct, deleteProduct, fetchProducts]);

  const userReturn = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts
  }), [products, categories, loading, error, fetchProducts]);

  // Effects - run only when necessary
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return isAdmin ? adminReturn : userReturn;
};

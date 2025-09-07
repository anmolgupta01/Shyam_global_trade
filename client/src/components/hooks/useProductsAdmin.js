import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Move constants outside to prevent recreation
const getApiBaseUrl = () => process.env.REACT_APP_API_URL || 'http://localhost:5001';
const API_BASE_URL = getApiBaseUrl();
const API_CONFIG = {
  PRODUCTS_URL: `${API_BASE_URL}/api/products`
};

// Default options to prevent object recreation
const DEFAULT_OPTIONS = { page: 1, search: '', limit: 10 };

export const useProductsAdmin = (options = DEFAULT_OPTIONS) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);

  // Cache for preventing unnecessary refetches
  const lastFetchParams = useRef(null);
  const categoriesCache = useRef(null);

  // Memoize options to prevent unnecessary re-renders
  const { page, search, limit } = useMemo(() => ({
    page: options.page ?? DEFAULT_OPTIONS.page,
    search: options.search ?? DEFAULT_OPTIONS.search,
    limit: options.limit ?? DEFAULT_OPTIONS.limit
  }), [options.page, options.search, options.limit]);

  // Optimized error handling
  const handleError = useCallback((error, operation) => {
    console.error(`Error ${operation}:`, error);
    
    if (error.message?.includes('Image upload failed')) {
      return new Error('Failed to upload image to cloud storage. Please try again.');
    }
    
    if (error.message?.includes('HTTP error')) {
      return new Error(`Server error: ${error.message}`);
    }
    
    return new Error(`Failed to ${operation}: ${error.message}`);
  }, []);

  // Optimized fetch products with caching
  const fetchProducts = useCallback(async () => {
    const currentParams = { page, search, limit };
    const paramsKey = JSON.stringify(currentParams);
    
    // Skip if same parameters as last fetch
    if (lastFetchParams.current === paramsKey) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search.trim() && { search: search.trim() })
      });

      const response = await fetch(`${API_CONFIG.PRODUCTS_URL}?${params}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        const productsData = apiResponse.data?.products || [];
        const paginationData = apiResponse.data?.pagination || {};
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalProducts(paginationData.totalProducts || 0);
        lastFetchParams.current = paramsKey;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      const handledError = handleError(error, 'fetching products');
      setError(handledError.message);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, limit, handleError]);

  // Optimized categories fetch with caching
  const fetchCategories = useCallback(async () => {
    // Return cached categories if available
    if (categoriesCache.current) {
      setCategories(categoriesCache.current);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.PRODUCTS_URL}/categories`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Categories endpoint failed, using empty array');
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.warn('Categories endpoint returned non-JSON content');
        return;
      }

      const data = await response.json();
      let categoriesData = [];
      
      // Streamlined data extraction
      if (data.success && data.data?.categories) {
        categoriesData = data.data.categories;
      } else if (Array.isArray(data)) {
        categoriesData = data;
      } else if (Array.isArray(data.categories)) {
        categoriesData = data.categories;
      }
      
      // Filter and cache categories
      const filteredCategories = categoriesData
        .filter(cat => cat && cat !== 'All' && typeof cat === 'string')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);
      
      const uniqueCategories = [...new Set(filteredCategories)];
      
      categoriesCache.current = uniqueCategories;
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.warn('Error fetching categories:', error.message);
      setCategories([]);
    }
  }, []);

  // Generic CRUD operation handler
  const performCrudOperation = useCallback(async (operation, url, requestOptions = {}) => {
    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers: {
          'Accept': 'application/json',
          ...requestOptions.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        if (errorData.includes('Image upload failed')) {
          throw new Error('Failed to upload image to cloud storage. Please try again.');
        }
        throw new Error(`${operation} failed with status: ${response.status}`);
      }

      // Clear cache and refetch data
      lastFetchParams.current = null;
      categoriesCache.current = null;
      
      // Use Promise.allSettled to ensure both complete even if one fails
      await Promise.allSettled([fetchProducts(), fetchCategories()]);
      
      return response.json();
    } catch (error) {
      throw handleError(error, operation);
    }
  }, [fetchProducts, fetchCategories, handleError]);

  // Optimized CRUD operations
  const createProduct = useCallback(async (formData) => {
    return performCrudOperation('create product', API_CONFIG.PRODUCTS_URL, {
      method: 'POST',
      body: formData
    });
  }, [performCrudOperation]);

  const updateProduct = useCallback(async (id, formData) => {
    if (!id) throw new Error('Product ID is required for update');
    
    return performCrudOperation('update product', `${API_CONFIG.PRODUCTS_URL}/${id}`, {
      method: 'PUT',
      body: formData
    });
  }, [performCrudOperation]);

  const deleteProduct = useCallback(async (id) => {
    if (!id) throw new Error('Product ID is required for deletion');
    
    await performCrudOperation('delete product', `${API_CONFIG.PRODUCTS_URL}/${id}`, {
      method: 'DELETE'
    });
  }, [performCrudOperation]);

  // Manual refetch function that clears cache
  const refetch = useCallback(async () => {
    lastFetchParams.current = null;
    categoriesCache.current = null;
    await Promise.allSettled([fetchProducts(), fetchCategories()]);
  }, [fetchProducts, fetchCategories]);

  // Memoized return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    totalProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch
  }), [
    products,
    categories,
    loading,
    error,
    totalProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch
  ]);

  // Effects with dependency optimization
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return returnValue;
};

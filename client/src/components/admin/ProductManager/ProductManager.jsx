import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProductsAdmin } from '../../hooks/useProductsAdmin';
import { useDebounce } from '../../hooks/useDebounce';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import ProductModal from './ProductModal';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Toast from '../../ui/Toast';

// Constants moved outside component
const PRODUCTS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 500;
const TOAST_DURATION = 3000;

// Custom hook for toast management
const useToast = () => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, type });
    
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast(null);
  }, []);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { toast, showToast, hideToast };
};

// Custom hook for modal state management
const useModalState = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openModal = useCallback((product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
  }, []);

  return {
    showModal,
    editingProduct,
    openModal,
    closeModal
  };
};

// Custom hook for pagination and search
const usePaginationAndSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    searchTerm,
    debouncedSearchTerm,
    handleSearch,
    handlePageChange
  };
};

const ProductManager = () => {
  const { toast, showToast, hideToast } = useToast();
  const { showModal, editingProduct, openModal, closeModal } = useModalState();
  const { 
    currentPage, 
    searchTerm, 
    debouncedSearchTerm, 
    handleSearch, 
    handlePageChange 
  } = usePaginationAndSearch();

  // Memoized API parameters to prevent unnecessary hook re-runs
  const apiParams = useMemo(() => ({
    page: currentPage,
    search: debouncedSearchTerm,
    limit: PRODUCTS_PER_PAGE,
    isAdmin: true
  }), [currentPage, debouncedSearchTerm]);

  // Custom hook for product management
  const {
    products,
    categories,
    loading,
    totalProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch
  } = useProductsAdmin(apiParams);

  // Memoized total pages calculation
  const totalPages = useMemo(() => 
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE) || 1,
    [totalProducts]
  );

  // Optimized error message extraction
  const getErrorMessage = useCallback((error, isImageOperation = false) => {
    const message = error?.message || 'An error occurred';
    
    if (isImageOperation) {
      if (message.includes('cloud storage')) {
        return 'Failed to upload image to cloud storage. Please try again.';
      }
      if (message.includes('Image upload failed')) {
        return 'Image upload failed. Please try again with a different image.';
      }
    }
    
    return message;
  }, []);

  // Delete handler with optimized error handling
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      showToast('Product deleted successfully!');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  }, [deleteProduct, showToast, getErrorMessage]);

  // Optimized form submission handler
  const handleSubmit = useCallback(async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        showToast('Product updated successfully!');
      } else {
        await createProduct(formData);
        showToast('Product created successfully!');
      }
      
      closeModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error, true);
      showToast(errorMessage, 'error');
    }
  }, [editingProduct, updateProduct, createProduct, showToast, closeModal, getErrorMessage]);

  // Memoized modal props to prevent unnecessary re-renders
  const modalProps = useMemo(() => ({
    isOpen: showModal,
    onClose: closeModal,
    onSubmit: handleSubmit,
    product: editingProduct,
    categories,
    loading
  }), [showModal, closeModal, handleSubmit, editingProduct, categories, loading]);

  // Memoized table props
  const tableProps = useMemo(() => ({
    products,
    currentPage,
    totalPages,
    onEdit: (product) => openModal(product),
    onDelete: handleDelete,
    onPageChange: handlePageChange
  }), [products, currentPage, totalPages, openModal, handleDelete, handlePageChange]);

  // Memoized filter props
  const filterProps = useMemo(() => ({
    searchTerm,
    onSearchChange: handleSearch,
    onAddProduct: () => openModal(),
    totalProducts,
    loading
  }), [searchTerm, handleSearch, openModal, totalProducts, loading]);

  return (
    <>
      <Helmet>
        <title>Product Management | Admin Dashboard</title>
        <meta name="description" content="Manage products, categories, and inventory" />
      </Helmet>

      <div className="space-y-6">
        {/* Header & Filters */}
        <ProductFilters {...filterProps} />

        {/* Products Table */}
        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : (
          <ProductTable {...tableProps} />
        )}

        {/* Product Modal - Only render when needed */}
        {showModal && <ProductModal {...modalProps} />}

        {/* Toast Notifications - Only render when needed */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </>
  );
};

ProductManager.displayName = 'ProductManager';

export default React.memo(ProductManager);
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';

// Memoized form field component to prevent unnecessary re-renders
const FormField = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = 'text', 
  placeholder, 
  disabled, 
  rows, 
  accept,
  required = false 
}) => {
  const inputProps = {
    name,
    value: type === 'file' ? undefined : value,
    onChange,
    className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      error ? 'border-red-500' : 'border-gray-300'
    }`,
    placeholder,
    disabled,
    ...(type === 'file' && { accept })
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      {type === 'textarea' ? (
        <textarea rows={rows} {...inputProps} />
      ) : (
        <input type={type} {...inputProps} />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

FormField.displayName = 'FormField';

// Optimized loading button component
const LoadingButton = React.memo(({ loading, isEdit, disabled }) => (
  <button
    type="submit"
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    disabled={disabled || loading}
  >
    {loading ? (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {isEdit ? 'Updating...' : 'Adding...'}
      </span>
    ) : (
      isEdit ? 'Update Product' : 'Add Product'
    )}
  </button>
));

LoadingButton.displayName = 'LoadingButton';

// Constants moved outside component to prevent recreating on each render
const INITIAL_FORM_STATE = {
  name: '',
  code: '',
  category: '',
  description: '',
  image: null
};

const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: 'image/*'
};

const ProductModal = ({ isOpen, onClose, onSubmit, product, loading }) => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize initial form data to prevent unnecessary effect runs
  const initialFormData = useMemo(() => {
    if (product) {
      return {
        name: product.name || '',
        code: product.code || '',
        category: product.category || '',
        description: product.description || '',
        image: null // Don't populate file input
      };
    }
    return INITIAL_FORM_STATE;
  }, [product]);

  // Extracted file validation function
  const validateImageFile = useCallback((file) => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
      return 'File size must be less than 5MB';
    }
    return '';
  }, []);

  // Memoized field configurations
  const fieldConfigs = useMemo(() => [
    {
      label: 'Product Name',
      name: 'name',
      placeholder: 'Enter product name',
      required: true
    },
    {
      label: 'Product Code',
      name: 'code',
      placeholder: 'Enter product code (e.g., SIT-001)',
      required: true
    },
    {
      label: 'Category',
      name: 'category',
      placeholder: 'Enter category (e.g., Unbreakable Households, Crocklings)',
      required: true
    },
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      rows: 4,
      placeholder: 'Enter product description',
      required: true
    },
    {
      label: 'Product Image',
      name: 'image',
      type: 'file',
      accept: FILE_CONSTRAINTS.ACCEPTED_TYPES,
      required: !product
    }
  ], [product]);

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, initialFormData]);

  // Reset submitting state when external loading changes
  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading]);

  // FIXED: Improved change handler with proper file validation and string conversion
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      const file = files?.[0];
      
      if (file) {
        const validationError = validateImageFile(file);
        
        if (!validationError) {
          setFormData(prev => ({ ...prev, [name]: file }));
          setErrors(prev => ({ ...prev, image: '' }));
        } else {
          // Clear invalid file from state and reset input
          setFormData(prev => ({ ...prev, [name]: null }));
          setErrors(prev => ({ ...prev, image: validationError }));
          e.target.value = '';
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: null }));
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } else {
      // Convert value to string to handle numbers/other types
      const stringValue = value != null ? String(value) : '';
      setFormData(prev => ({ ...prev, [name]: stringValue }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  }, [errors, validateImageFile]);

  // FIXED: Enhanced form validation with better error handling
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Required field validation with string conversion and trimming
    const trimmedName = formData.name ? String(formData.name).trim() : '';
    const trimmedCode = formData.code ? String(formData.code).trim() : '';
    const trimmedCategory = formData.category ? String(formData.category).trim() : '';
    const trimmedDescription = formData.description ? String(formData.description).trim() : '';
    
    if (!trimmedName) {
      newErrors.name = 'Product name is required';
    }
    if (!trimmedCode) {
      newErrors.code = 'Product code is required';
    }
    if (!trimmedCategory) {
      newErrors.category = 'Category is required';
    }
    if (!trimmedDescription) {
      newErrors.description = 'Description is required';
    }

    // Image validation for new products only
    if (!product && !formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, product]);

  // FIXED: Enhanced submit handler with proper loading state management
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    // Set internal loading state
    setIsSubmitting(true);
    
    // Create FormData with proper field handling
    const submitData = new FormData();
    
    // Add text fields with safe string conversion and trimming
    const textFields = {
      name: formData.name ? String(formData.name).trim() : '',
      code: formData.code ? String(formData.code).trim() : '',
      category: formData.category ? String(formData.category).trim() : '',
      description: formData.description ? String(formData.description).trim() : ''
    };

    // Add non-empty fields to FormData
    Object.entries(textFields).forEach(([key, value]) => {
      if (value) {
        submitData.append(key, value);
      }
    });
    
    // Add image if present
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      await onSubmit(submitData);
      // Success - parent should handle closing modal
    } catch (error) {
      console.error('Error calling onSubmit:', error);
      // Reset loading state on error since parent might not
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  // Determine current loading state
  const currentlyLoading = loading || isSubmitting;

  // FIXED: Early return MUST BE AFTER ALL HOOKS
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={currentlyLoading}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldConfigs.map(config => (
            <FormField
              key={config.name}
              {...config}
              value={formData[config.name]}
              onChange={handleChange}
              error={errors[config.name]}
              disabled={currentlyLoading}
            />
          ))}

          {/* Helper text for image upload */}
          <p className="text-gray-500 text-xs -mt-2">
            {product ? 'Upload new image to replace current one' : 'Choose an image file (max 5MB)'}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={currentlyLoading}
            >
              Cancel
            </button>
            <LoadingButton 
              loading={currentlyLoading}
              isEdit={!!product}
              disabled={currentlyLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

ProductModal.displayName = 'ProductModal';

export default React.memo(ProductModal);

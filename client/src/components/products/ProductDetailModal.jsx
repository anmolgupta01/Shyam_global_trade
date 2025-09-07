import React, { useEffect } from 'react';
import { X, Package, Tag, Hash, FileText, Calendar, Edit, Trash2 } from 'lucide-react';

export const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onDelete }) => {
  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // UPDATED: Simplified for Cloudinary integration
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (Cloudinary URL), return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Fallback for any remaining local images
    const baseUrl = process.env.REACT_APP_BASE_URL || 'https://shyam-international.onrender.com';
    return `${baseUrl}/uploads/products/${imagePath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Product Image</h3>
            {product.image ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Product Name
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {product.name || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Product Code
                  </label>
                  <p className="text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                    {product.code || product.productCode || 'Not assigned'} {/* UPDATED: Added product.code fallback */}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {product.category || 'Uncategorized'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Description
              </h3>
              <div className="bg-white p-4 rounded border">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {product.description || 'No description provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Close
          </button>
          
          {onEdit && (
            <button
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors inline-flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this product?')) {
                  onDelete(product._id || product.id);
                  onClose();
                }
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors inline-flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

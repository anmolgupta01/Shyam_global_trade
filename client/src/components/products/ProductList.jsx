import React, { useState } from 'react';
import { Eye, Edit, Trash2, Package } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';

export const ProductList = ({ 
  products = [], 
  onEdit, 
  onDelete, 
  loading = false,
  searchTerm = '',
  viewMode = 'grid'
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-product.png';
    if (imagePath.startsWith('http')) return imagePath;
    
    const baseUrl = process.env.REACT_APP_API_URL;
    return `${baseUrl}/uploads/${imagePath}`;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No description';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-6">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-600 mb-1">
          {searchTerm ? 'No products found' : 'No products available'}
        </h3>
        <p className="text-sm text-gray-500">
          {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first product'}
        </p>
      </div>
    );
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {filteredProducts.map(product => (
        <div key={product._id || product.id} className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
          {/* Reduced image height from h-40 to h-28 */}
          <div className="relative h-28 bg-gray-100 rounded-t-md overflow-hidden">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
              }}
            />
            <div className="absolute top-1 right-1">
              <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                {product.category || 'Uncategorized'}
              </span>
            </div>
          </div>

          {/* Reduced padding from p-3 to p-2 */}
          <div className="p-2">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-gray-900 truncate text-sm" title={product.name}>
                {product.name}
              </h3>
              {product.code && (
                <span className="text-xs text-gray-500 font-mono ml-2">
                  {product.code}
                </span>
              )}
            </div>
            
            {/* Reduced margin from mb-3 to mb-2 and line-clamp-2 to line-clamp-1 */}
            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
              {truncateText(product.description, 40)}
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleViewProduct(product)}
                className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </button>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(product)}
                  className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(product._id || product.id)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TableView = () => (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.map(product => (
            <tr key={product._id || product.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <img
                      className="h-8 w-8 rounded-md object-cover"
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 font-mono">
                {product.code || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {product.category || 'Uncategorized'}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-900 max-w-xs truncate" title={product.description}>
                {truncateText(product.description, 50)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center space-x-1">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Edit Product"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(product._id || product.id)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Products</h2>
              <p className="text-xs text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? <GridView /> : <TableView />}
      </div>

      <ProductDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
};

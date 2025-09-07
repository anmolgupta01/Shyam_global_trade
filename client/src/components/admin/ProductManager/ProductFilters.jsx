import React from 'react';
import { Search, Plus } from 'lucide-react';

const ProductFilters = React.memo(({
  searchTerm,
  onSearchChange,
  onAddProduct,
  totalProducts,
  loading
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h2>
        <p className="text-gray-600">
          Manage your product catalog ({totalProducts} products)
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#254F7E] focus:border-transparent w-64"
          />
        </div>
        
        {/* Add Button */}
        <button
          onClick={onAddProduct}
          disabled={loading}
          className="px-4 py-2 bg-[#254F7E] text-white rounded-lg hover:bg-[#1e3f66] 
                   transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
});

ProductFilters.displayName = 'ProductFilters';

export default ProductFilters;

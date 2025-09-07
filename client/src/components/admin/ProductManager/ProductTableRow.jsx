import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/api/placeholder/40/40';

const ProductTableRow = React.memo(({ product, onEdit, onDelete }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    
    const filename = imagePath.split('/').pop();
    return `${process.env.REACT_APP_API_URL}/products/image/${filename}`;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {product.description}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {product.category || 'Uncategorized'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.code || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

ProductTableRow.displayName = 'ProductTableRow';

export default ProductTableRow;

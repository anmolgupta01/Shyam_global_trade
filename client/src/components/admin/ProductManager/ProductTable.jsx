import React from 'react';
import ProductTableRow from './ProductTableRow';
import Pagination from '../../ui/Pagination';
import { EmptyState } from '../../ui/EmptyState';
import { Package } from 'lucide-react';

const ProductTable = React.memo(({
  products,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-12 h-12 text-gray-400" />}
        title="No products found"
        description="Create your first product to get started."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <ProductTableRow
                key={product._id}
                product={product}
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

ProductTable.displayName = 'ProductTable';

export default ProductTable;

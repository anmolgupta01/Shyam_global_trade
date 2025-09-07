import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export const ProductPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems = 0,
  itemsPerPage = 10,
  showSummary = true,
  showFirstLast = true,
  maxVisiblePages = 7
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate visible page numbers with ellipsis
  const getVisiblePages = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for showing pages with ellipsis
      const delta = Math.floor(maxVisiblePages / 2);
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      // Always show first page
      pages.push(1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis-start');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  // Calculate summary info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const PageButton = ({ page, children, isActive = false, disabled = false, onClick }) => (
    <button
      onClick={() => onClick && onClick(page)}
      disabled={disabled}
      className={`
        px-3 py-2 text-sm font-medium border transition-colors duration-200
        ${isActive 
          ? 'bg-blue-600 text-white border-blue-600' 
          : disabled 
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
        }
        ${!isActive && !disabled ? 'hover:border-gray-400' : ''}
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 bg-white px-4 py-3 border-t border-gray-200">
      {/* Summary Information */}
      {showSummary && (
        <div className="text-sm text-gray-700">
          
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page Button */}
        {showFirstLast && currentPage > 2 && (
          <PageButton
            page={1}
            onClick={handlePageChange}
            disabled={currentPage === 1}
          >
            First
          </PageButton>
        )}

        {/* Previous Button */}
        <PageButton
          page={currentPage - 1}
          onClick={handlePageChange}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="w-4 h-4" />
        </PageButton>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={page}
                  className="px-3 py-2 text-sm text-gray-400"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            return (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                onClick={handlePageChange}
              >
                {page}
              </PageButton>
            );
          })}
        </div>

        {/* Next Button */}
        <PageButton
          page={currentPage + 1}
          onClick={handlePageChange}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="w-4 h-4" />
        </PageButton>

        {/* Last Page Button */}
        {showFirstLast && currentPage < totalPages - 1 && (
          <PageButton
            page={totalPages}
            onClick={handlePageChange}
            disabled={currentPage === totalPages}
          >
            Last
          </PageButton>
        )}
      </div>


      <div className="hidden sm:block">
      </div>
    </div>
  );
};



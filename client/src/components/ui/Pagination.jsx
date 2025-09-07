import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  showSummary = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = 'md'
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
      const delta = Math.floor(maxVisiblePages / 2);
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);

      // Adjust start and end to always show maxVisiblePages when possible
      if (end - start + 1 < maxVisiblePages - 2) {
        if (start === 2) {
          end = Math.min(totalPages - 1, start + maxVisiblePages - 3);
        } else if (end === totalPages - 1) {
          start = Math.max(2, end - maxVisiblePages + 3);
        }
      }

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

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Calculate summary info
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const PageButton = ({ page, children, isActive = false, disabled = false, onClick, ariaLabel }) => (
    <button
      onClick={() => onClick && onClick(page)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${sizeClasses[size]} font-medium border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${isActive 
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
          : disabled 
            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 px-4 py-3">
      {/* Summary Information */}
      {showSummary && totalItems > 0 && (
        <div className={`${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'} text-gray-700`}>
          Showing{' '}
          <span className="font-medium">{startItem.toLocaleString()}</span>
          {' '}to{' '}
          <span className="font-medium">{endItem.toLocaleString()}</span>
          {' '}of{' '}
          <span className="font-medium">{totalItems.toLocaleString()}</span>
          {' '}results
        </div>
      )}

      {/* Pagination Controls */}
      <nav aria-label="Pagination" role="navigation">
        <div className="flex items-center space-x-1">
          {/* First Page Button */}
          {showFirstLast && currentPage > 2 && (
            <PageButton
              page={1}
              onClick={handlePageChange}
              disabled={currentPage === 1}
              ariaLabel="Go to first page"
            >
              <ChevronsLeft className={iconSizes[size]} />
              {size === 'lg' && <span className="ml-1 hidden sm:inline">First</span>}
            </PageButton>
          )}

          {/* Previous Button */}
          <PageButton
            page={currentPage - 1}
            onClick={handlePageChange}
            disabled={currentPage === 1}
            ariaLabel="Go to previous page"
          >
            <ChevronLeft className={iconSizes[size]} />
            {size === 'lg' && <span className="ml-1 hidden sm:inline">Previous</span>}
          </PageButton>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span
                    key={page}
                    className={`${sizeClasses[size]} text-gray-400 cursor-default`}
                    aria-hidden="true"
                  >
                    <MoreHorizontal className={iconSizes[size]} />
                  </span>
                );
              }

              return (
                <PageButton
                  key={page}
                  page={page}
                  isActive={page === currentPage}
                  onClick={handlePageChange}
                  ariaLabel={`Go to page ${page}`}
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
            ariaLabel="Go to next page"
          >
            {size === 'lg' && <span className="mr-1 hidden sm:inline">Next</span>}
            <ChevronRight className={iconSizes[size]} />
          </PageButton>

          {/* Last Page Button */}
          {showFirstLast && currentPage < totalPages - 1 && (
            <PageButton
              page={totalPages}
              onClick={handlePageChange}
              disabled={currentPage === totalPages}
              ariaLabel="Go to last page"
            >
              {size === 'lg' && <span className="mr-1 hidden sm:inline">Last</span>}
              <ChevronsRight className={iconSizes[size]} />
            </PageButton>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Pagination;

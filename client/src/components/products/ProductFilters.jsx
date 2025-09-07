import React, { useMemo } from 'react';
import { Filter } from 'lucide-react';
import { SearchBar, ViewToggle } from '../ui';

export const ProductFilters = React.memo(({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  const uniqueCategories = useMemo(() => {
    let processedCategories = [];
    
    if (Array.isArray(categories)) {
      processedCategories = categories;
    } else if (categories && typeof categories === 'object') {
      processedCategories = Object.values(categories);
    } else {
      console.warn('Categories is not in expected format:', categories);
      return ['All'];
    }
    
    const validCategories = processedCategories
      .filter(cat => cat && typeof cat === 'string' && cat.trim().length > 0)
      .map(cat => cat.trim());
    
    return [...new Set(validCategories)];
  }, [categories]);

  const SearchSection = () => (
    <>
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search products..."
      />
      <div className="mt-3 flex justify-end">
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Search */}
      <div className="lg:hidden mb-3">
        <SearchSection />
      </div>

      <div className="lg:w-56 flex-shrink-0">
        {/* Desktop Search */}
        <div className="hidden lg:block mb-4">
          <SearchSection />
        </div>

        {/* Categories as Dropdown */}
        <div className="bg-white rounded-md shadow-sm border p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Categories
          </h2>
          {uniqueCategories.length > 0 ? (
            <select
              className="w-full rounded border-gray-300 text-gray-700 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-gray-500 text-xs px-3 py-2">
              No categories available
            </div>
          )}
        </div>
      </div>
    </>
  );
});

ProductFilters.displayName = 'ProductFilters';

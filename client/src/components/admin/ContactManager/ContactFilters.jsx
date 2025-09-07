import React, { useCallback } from 'react';
import { Search } from 'lucide-react';

const ContactFilters = React.memo(({
  statusFilter,
  searchTerm,
  onFilterChange,
  onSearchChange,
  filterOptions
}) => {
  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Search is debounced, so no need for manual trigger
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === option.value
                  ? 'bg-[#254F7E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label} {option.count > 0 && `(${option.count})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#254F7E] focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>
    </div>
  );
});

ContactFilters.displayName = 'ContactFilters';

export default ContactFilters;

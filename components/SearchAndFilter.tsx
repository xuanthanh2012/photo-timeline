import React, { useState } from 'react';
import { Filters, Photo } from '../types';
import FilterPanel from './FilterPanel';
import { FilterIcon } from './icons/FilterIcon';
import { XIcon } from './icons/XIcon';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  allPhotos: Photo[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  allPhotos,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const clearFilters = () => {
    onFilterChange({
        dateRange: { start: '', end: '' },
    });
  };

  const activeFilterCount = [
    filters.dateRange.start || filters.dateRange.end,
  ].filter(Boolean).length;

  return (
    <div className="mb-8 relative">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search captions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-secondary border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-shadow"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
          </div>
        </div>
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-white dark:bg-secondary border border-gray-300 dark:border-gray-600 hover:border-accent dark:hover:border-accent hover:text-accent dark:hover:text-accent transition-colors relative"
        >
          <FilterIcon />
          <span className="ml-2">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-text-secondary">Active filters:</span>
            { (filters.dateRange.start || filters.dateRange.end) && <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">Date</span>}
            <button onClick={clearFilters} className="text-accent text-sm hover:underline">Clear all</button>
        </div>
      )}

      {isPanelOpen && (
        <FilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
          allPhotos={allPhotos}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchAndFilter;
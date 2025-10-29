import React from 'react';
import { Filters, MediaItem } from '../types';
import { XIcon } from './icons/XIcon';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  allMedia: MediaItem[];
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClose }) => {

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: e.target.value },
    });
  };

  const clearFilters = () => {
    onFilterChange({
        dateRange: { start: '', end: '' },
    });
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-full max-w-sm bg-white dark:bg-secondary rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-30 animate-fade-in-up p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Filters</h3>
        <button onClick={onClose}><XIcon /></button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">Date Range</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateChange(e, 'start')}
              className="w-full bg-gray-100 dark:bg-primary p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-accent"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateChange(e, 'end')}
              className="w-full bg-gray-100 dark:bg-primary p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-accent"
            />
          </div>
        </div>
      </div>
       <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
            <button 
                onClick={clearFilters}
                className="text-sm text-accent hover:underline"
            >
                Clear All Filters
            </button>
       </div>
    </div>
  );
};

export default FilterPanel;
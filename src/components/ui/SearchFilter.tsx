import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterOption } from '../../types';

interface SearchFilterProps {
  placeholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  placeholder = "Search...",
  searchTerm,
  onSearchChange,
  filterOptions = [],
  activeFilter,
  onFilterChange,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          aria-label="Search items"
          type="text" 
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-soft-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {filterOptions.length > 0 && onFilterChange && (
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            aria-label="Filter items"
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none shadow-soft-sm cursor-pointer"
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="All">All Status</option>
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
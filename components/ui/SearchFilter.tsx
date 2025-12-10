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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {filterOptions.length > 0 && onFilterChange && (
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none shadow-sm cursor-pointer text-slate-700"
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
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchMeetsProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchMeets: React.FC<SearchMeetsProps> = ({ 
  onSearch, 
  placeholder = "Search meets..." 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-slate-400" size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="absolute inset-0 w-full h-full opacity-0"
        aria-label="Search"
      >
        Search
      </button>
    </form>
  );
};
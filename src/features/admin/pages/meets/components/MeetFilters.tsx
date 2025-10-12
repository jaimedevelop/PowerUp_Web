import React, { useState } from 'react';
import { Filter, Calendar, MapPin, ChevronDown } from 'lucide-react';

interface MeetFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export const MeetFilters: React.FC<MeetFiltersProps> = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'registration-open', label: 'Registration Open' },
    { value: 'registration-closed', label: 'Registration Closed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'tampa', label: 'Tampa' },
    { value: 'miami', label: 'Miami' },
    { value: 'orlando', label: 'Orlando' },
    { value: 'jacksonville', label: 'Jacksonville' }
  ];

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        status: statusFilter,
        date: dateFilter,
        location: locationFilter
      });
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="mr-2" size={20} />
          Filters
        </h3>
        <button 
          onClick={() => {
            setStatusFilter('all');
            setDateFilter('all');
            setLocationFilter('all');
            handleFilterChange();
          }}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
            <Calendar className="mr-2" size={16} />
            Status
          </label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="text-slate-400" size={16} />
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
            <Calendar className="mr-2" size={16} />
            Date Range
          </label>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="text-slate-400" size={16} />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
            <MapPin className="mr-2" size={16} />
            Location
          </label>
          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="text-slate-400" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
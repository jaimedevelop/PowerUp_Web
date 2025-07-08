import React from 'react';
import { Home, Users, Trophy, Medal, Bell } from 'lucide-react';

type FilterType = 'all' | 'following' | 'competitions' | 'achievements' | 'announcements';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all' as FilterType, name: 'All Posts', icon: Home },
    { id: 'following' as FilterType, name: 'Following', icon: Users },
    { id: 'competitions' as FilterType, name: 'Competitions', icon: Trophy },
    { id: 'achievements' as FilterType, name: 'Achievements', icon: Medal },
    { id: 'announcements' as FilterType, name: 'Announcements', icon: Bell },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-2 border border-slate-700 mb-6">
      <div className="flex space-x-1 overflow-x-auto">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {filter.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
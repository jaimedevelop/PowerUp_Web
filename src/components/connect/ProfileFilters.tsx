import React from 'react';
import { Filter, Users, GraduationCap, Building, Award } from 'lucide-react';

type ProfileType = 'all' | 'athlete' | 'coach' | 'brand' | 'team';

interface ProfileFiltersProps {
  activeFilter: ProfileType;
  onFilterChange: (filter: ProfileType) => void;
}

export const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  activeFilter,
  onFilterChange
}) => {
  const filters = [
    { id: 'all' as ProfileType, name: 'All', icon: Filter },
    { id: 'athlete' as ProfileType, name: 'Athletes', icon: Users },
    { id: 'coach' as ProfileType, name: 'Coaches', icon: GraduationCap },
    { id: 'team' as ProfileType, name: 'Teams', icon: Building },
    { id: 'brand' as ProfileType, name: 'Brands', icon: Award },
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {filter.name}
          </button>
        );
      })}
    </div>
  );
};
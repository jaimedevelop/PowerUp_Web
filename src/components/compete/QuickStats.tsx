import React from 'react';
import { Trophy, Medal, Target } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const stats = [
    {
      icon: Trophy,
      label: 'Total Meets',
      value: '7',
      subtitle: 'lifetime',
      color: 'text-yellow-500'
    },
    {
      icon: Medal,
      label: 'Best Total',
      value: '1,247',
      subtitle: 'lbs',
      color: 'text-purple-500'
    },
    {
      icon: Target,
      label: 'Next Meet',
      value: '28',
      subtitle: 'days',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <IconComponent className={`w-6 h-6 ${stat.color} mr-3`} />
                <span className="text-slate-300 font-medium">{stat.label}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
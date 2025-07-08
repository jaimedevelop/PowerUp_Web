// StatCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className = ''
}) => {
  return (
    <div className={`bg-slate-800 rounded-xl p-6 border border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
          <Icon size={24} className="text-purple-400" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-slate-400 text-sm">{title}</p>
        {trend && (
          <p className="text-xs text-slate-500">{trend.label}</p>
        )}
      </div>
    </div>
  );
};
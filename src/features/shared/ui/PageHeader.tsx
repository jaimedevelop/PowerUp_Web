// PageHeader.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  actions
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
            <Icon size={28} className="text-purple-400" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};
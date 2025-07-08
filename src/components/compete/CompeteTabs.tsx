import React from 'react';
import { Search, Calendar, Trophy, Zap } from 'lucide-react';

type CompeteTabType = 'discover' | 'register' | 'my-competitions' | 'competition-mode';

interface CompeteTabsProps {
  activeTab: CompeteTabType;
  onTabChange: (tab: CompeteTabType) => void;
  competitionModeActive?: boolean;
}

export const CompeteTabs: React.FC<CompeteTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  competitionModeActive = false 
}) => {
  const tabs = [
    {
      id: 'discover' as CompeteTabType,
      label: 'Discover',
      icon: Search,
      description: 'Find competitions'
    },
    {
      id: 'register' as CompeteTabType,
      label: 'Register',
      icon: Calendar,
      description: 'Sign up for meets'
    },
    {
      id: 'my-competitions' as CompeteTabType,
      label: 'My Competitions',
      icon: Trophy,
      description: 'Track your meets'
    },
    {
      id: 'competition-mode' as CompeteTabType,
      label: 'Competition Mode',
      icon: Zap,
      description: 'Live meet tracking',
      isSpecial: true
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 mb-8">
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const isCompetitionMode = tab.id === 'competition-mode';
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 px-6 py-4 text-left border-r border-slate-700 last:border-r-0 transition-all duration-200
                ${isActive 
                  ? isCompetitionMode 
                    ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b-2 border-red-500' 
                    : 'bg-slate-700 border-b-2 border-purple-500'
                  : 'hover:bg-slate-700/50'
                }
              `}
            >
              <div className="flex items-center mb-2">
                <IconComponent 
                  className={`w-5 h-5 mr-3 ${
                    isActive 
                      ? isCompetitionMode 
                        ? competitionModeActive 
                          ? 'text-red-400' 
                          : 'text-orange-400'
                        : 'text-purple-400'
                      : 'text-slate-400'
                  }`} 
                />
                <span className={`font-medium ${
                  isActive ? 'text-white' : 'text-slate-300'
                }`}>
                  {tab.label}
                </span>
                {isCompetitionMode && competitionModeActive && (
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className={`text-sm ${
                isActive ? 'text-slate-300' : 'text-slate-400'
              }`}>
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
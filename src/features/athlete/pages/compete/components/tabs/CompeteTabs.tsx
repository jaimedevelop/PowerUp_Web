import React from 'react';
import { Search, Calendar, Trophy, Zap } from 'lucide-react';
import { tw } from '../../../../../../styles/theme';

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
      description: 'Find competitions',
      color: 'blue'
    },
    {
      id: 'register' as CompeteTabType,
      label: 'Register',
      icon: Calendar,
      description: 'Sign up for meets',
      color: 'green'
    },
    {
      id: 'my-competitions' as CompeteTabType,
      label: 'My Competitions',
      icon: Trophy,
      description: 'Track your meets',
      color: 'yellow'
    },
    {
      id: 'competition-mode' as CompeteTabType,
      label: 'Competition Mode',
      icon: Zap,
      description: 'Live meet tracking',
      color: 'red',
      isSpecial: true
    }
  ];

  const getActiveColor = (color: string) => {
    switch(color) {
      case 'blue': return 'border-blue-500 text-blue-400';
      case 'green': return 'border-green-500 text-green-400';
      case 'yellow': return 'border-yellow-500 text-yellow-400';
      case 'red': return 'border-red-500 text-red-400';
      default: return 'border-blue-500 text-blue-400';
    }
  };

  return (
    <div className={`${tw.glassCard} mb-8`}>
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
                ${tw.tabButton}
                ${isActive 
                  ? `${tw.tabButtonActive} ${getActiveColor(tab.color)}` 
                  : tw.tabButtonInactive
                }
              `}
            >
              <div className="flex items-center mb-2">
                <IconComponent 
                  className={`w-5 h-5 mr-3 ${
                    isActive 
                      ? isCompetitionMode && competitionModeActive 
                        ? 'text-red-400' 
                        : getActiveColor(tab.color).split(' ')[1]
                      : 'text-white/40'
                  }`} 
                />
                <span className={`font-medium ${
                  isActive ? 'text-white' : 'text-white/70'
                }`}>
                  {tab.label}
                </span>
                {isCompetitionMode && competitionModeActive && (
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className={`text-sm ${
                isActive ? 'text-white/70' : 'text-white/50'
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
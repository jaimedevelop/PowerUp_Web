import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { CompeteTabs } from '../components/compete/CompeteTabs';
import { DiscoverTab } from '../components/compete/DiscoverTab';
import { RegisterTab } from '../components/compete/RegisterTab';
import { MyCompetitionsTab } from '../components/compete/MyCompetitionsTab';
import { CompetitionModeTab } from '../components/compete/CompetitionModeTab';

type CompeteTabType = 'discover' | 'register' | 'my-competitions' | 'competition-mode';

export const CompetePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CompeteTabType>('discover');
  const [competitionModeActive, setCompetitionModeActive] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverTab />;
      case 'register':
        return <RegisterTab />;
      case 'my-competitions':
        return <MyCompetitionsTab />;
      case 'competition-mode':
        return <CompetitionModeTab />;
      default:
        return <DiscoverTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-white">Compete</h1>
      </div>

      {/* Tab Navigation */}
      <CompeteTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        competitionModeActive={competitionModeActive}
      />

      {/* Tab Content */}
      <div className="min-h-screen">
        {renderTabContent()}
      </div>
    </div>
  );
};
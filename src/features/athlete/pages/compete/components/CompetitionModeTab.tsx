import React, { useState } from 'react';
import { CompetitionMode } from './CompetitionMode';

export const CompetitionModeTab: React.FC = () => {
  const [competitionModeActive, setCompetitionModeActive] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <CompetitionMode 
        isActive={competitionModeActive}
        onToggle={setCompetitionModeActive}
      />
    </div>
  );
};
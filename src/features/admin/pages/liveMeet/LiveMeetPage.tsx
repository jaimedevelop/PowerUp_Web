// src/admin/pages/LiveMeetPage.tsx
import React, { useState } from 'react';
import { Radio } from 'lucide-react';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { LiveMeetDashboard } from './components/LiveMeetDashboard';
import { LiveMeetSelector } from './components/LiveMeetSelector';
import { MeetDaySetup } from './components/MeetDaySetup';
import { FlightControl } from './components/FlightControl';
import { AttemptTracking } from './components/AttemptTracking';
import { TimerManagement } from './components/TimerManagement';
import { ScoreboardDisplay } from './components/ScoreboardDisplay';
import { LiveMeetCommunication } from './components/LiveMeetCommunication';
import { AnnouncementCenter } from './components/AnnouncementCenter';

type LiveMeetView = 'selector' | 'setup' | 'live' | 'communication';

export const LiveMeetPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<LiveMeetView>('selector');
  const [selectedMeetId, setSelectedMeetId] = useState<string | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case 'selector':
        return (
          <LiveMeetSelector
            onSelectMeet={(meetId) => {
              setSelectedMeetId(meetId);
              setCurrentView('setup');
            }}
          />
        );
      
      case 'setup':
        return (
          <div className="space-y-6">
            <button onClick={() => setCurrentView('selector')} className="mb-4">
              ← Back to Meet Selection
            </button>
            {selectedMeetId && (
              <MeetDaySetup
                meetId={selectedMeetId}
                onStartMeet={() => setCurrentView('live')}
              />
            )}
          </div>
        );
      
      case 'live':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('setup')} className="mb-4">
                ← Back to Setup
              </button>
              <button onClick={() => setCurrentView('communication')}>
                Communications
              </button>
            </div>
            {selectedMeetId && (
              <LiveMeetDashboard meetId={selectedMeetId}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <FlightControl meetId={selectedMeetId} />
                    <AttemptTracking meetId={selectedMeetId} />
                    <TimerManagement meetId={selectedMeetId} />
                  </div>
                  <div className="space-y-6">
                    <ScoreboardDisplay meetId={selectedMeetId} />
                    <AnnouncementCenter meetId={selectedMeetId} />
                  </div>
                </div>
              </LiveMeetDashboard>
            )}
          </div>
        );
      
      case 'communication':
        return (
          <div className="space-y-6">
            <button onClick={() => setCurrentView('live')} className="mb-4">
              ← Back to Live Meet
            </button>
            {selectedMeetId && <LiveMeetCommunication meetId={selectedMeetId} />}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Meet"
        subtitle="Real-time meet day operations and control"
        icon={Radio}
      />
      {renderContent()}
    </div>
  );
};
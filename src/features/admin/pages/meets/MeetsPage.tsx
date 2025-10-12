// src/admin/pages/MeetsPage.tsx
import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { MeetsList } from './components/MeetsList';
import { CreateMeetWizard } from './components/CreateMeetWizard';
import { EditMeet } from './components/EditMeet';
import MeetDashboard from './components/MeetDashboard';
import { MeetOverview } from './components/MeetOverview';
import { MeetFilters } from './components/MeetFilters';
import { SearchMeets } from './components/SearchMeets';
import { MeetTemplates } from './components/MeetTemplates';
import { FlightOrganization } from './components/FlightOrganization';
import { RegistrationManagement } from './components/RegistrationManagement';

type MeetsPageView = 'list' | 'create' | 'edit' | 'dashboard' | 'manage';

export const MeetsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<MeetsPageView>('list');
  const [selectedMeetId, setSelectedMeetId] = useState<string | null>(null);

  const handleEditMeet = (meetId: string) => {
    setSelectedMeetId(meetId);
    setCurrentView('edit');
  };

  const handleCompleteEdit = () => {
    setCurrentView('list');
    setSelectedMeetId(null);
  };

  const handleCompleteCreate = () => {
    setCurrentView('list');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setCurrentView('list')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors mb-4"
            >
              ← Back to Meets
            </button>
            <CreateMeetWizard onComplete={handleCompleteCreate} />
          </div>
        );
      
      case 'edit':
        return (
          <EditMeet 
            meetId={selectedMeetId} 
            onComplete={handleCompleteEdit} 
          />
        );
      
      case 'dashboard':
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setCurrentView('list')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors mb-4"
            >
              ← Back to Meets
            </button>
            {selectedMeetId && <MeetDashboard />}
          </div>
        );
      
      case 'manage':
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setCurrentView('list')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors mb-4"
            >
              ← Back to Meets
            </button>
            {selectedMeetId && (
              <>
                <MeetOverview meetId={selectedMeetId} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FlightOrganization meetId={selectedMeetId} />
                  <RegistrationManagement meetId={selectedMeetId} />
                </div>
              </>
            )}
          </div>
        );
      
      case 'list':
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <SearchMeets />
              <button 
                onClick={() => setCurrentView('create')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Create New Meet
              </button>
            </div>
            {/* <MeetFilters />
            <MeetTemplates /> */}
            <MeetsList
              onCreateMeet={() => setCurrentView('create')}
              onEditMeet={handleEditMeet}
            />
          </div>
        );
    }
  };

  // Don't show PageHeader for edit view since EditMeet has its own header
  if (currentView === 'edit') {
    return renderContent();
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Meets" subtitle="Manage your powerlifting competitions" icon={Trophy} />
      {renderContent()}
    </div>
  );
};
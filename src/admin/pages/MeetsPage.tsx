// src/admin/pages/MeetsPage.tsx
import React, { useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { MeetsList } from '../components/meets/MeetsList';
import { CreateMeetWizard } from '../components/meets/CreateMeetWizard';

type MeetsPageView = 'list' | 'create' | 'edit';

export const MeetsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<MeetsPageView>('list');
  const [editingMeetId, setEditingMeetId] = useState<string | null>(null);

  const handleCreateMeet = () => {
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingMeetId(null);
  };

  const handleEditMeet = (meetId: string) => {
    setEditingMeetId(meetId);
    setCurrentView('edit');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="space-y-6">
            {/* Back to List Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Meets</span>
              </button>
            </div>
            
            {/* Create Meet Wizard */}
            <CreateMeetWizard onComplete={handleBackToList} />
          </div>
        );
      
      case 'edit':
        return (
          <div className="space-y-6">
            {/* Back to List Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Meets</span>
              </button>
            </div>
            
            {/* Edit Meet Wizard - would use same wizard with pre-filled data */}
            <CreateMeetWizard 
              editMode={true} 
              meetId={editingMeetId} 
              onComplete={handleBackToList} 
            />
          </div>
        );
      
      case 'list':
      default:
        return (
          <MeetsList 
            onCreateMeet={handleCreateMeet}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'create':
        return 'Create New Meet';
      case 'edit':
        return 'Edit Meet';
      case 'list':
      default:
        return 'Meets';
    }
  };

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'create':
        return 'Set up a new powerlifting competition';
      case 'edit':
        return 'Update competition details';
      case 'list':
      default:
        return 'Create and manage your powerlifting competitions';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        icon={Trophy}
      />
      {renderContent()}
    </div>
  );
};
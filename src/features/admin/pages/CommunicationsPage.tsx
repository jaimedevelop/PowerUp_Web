// src/admin/pages/CommunicationsPage.tsx
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { MessageCenter } from '../components/communications/MessageCenter';
import { EmailCampaigns } from '../components/communications/EmailCampaigns';
import { SMSNotifications } from '../components/communications/SMSNotifications';
import { Announcements } from '../components/communications/Announcements';
import { CommunicationTemplates } from '../components/communications/CommunicationTemplates';

type CommunicationsTab = 'messages' | 'email' | 'sms' | 'announcements' | 'templates';

export const CommunicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CommunicationsTab>('messages');

  const tabs = [
    { id: 'messages', label: 'Message Center' },
    { id: 'email', label: 'Email Campaigns' },
    { id: 'sms', label: 'SMS Notifications' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'templates', label: 'Templates' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return <MessageCenter />;
      case 'email':
        return <EmailCampaigns />;
      case 'sms':
        return <SMSNotifications />;
      case 'announcements':
        return <Announcements />;
      case 'templates':
        return <CommunicationTemplates />;
      default:
        return <MessageCenter />;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Communications"
        subtitle="Send updates and messages to athletes and participants"
        icon={MessageSquare}
      />

      {/* Tab Navigation */}
      <div className="border-b border-slate-700">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CommunicationsTab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

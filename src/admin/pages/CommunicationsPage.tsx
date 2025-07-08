// src/admin/pages/CommunicationsPage.tsx
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { MessageCenter } from '../components/communications/MessageCenter';

export const CommunicationsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Communications"
        subtitle="Send updates and messages to athletes and participants"
        icon={MessageSquare}
      />
      <MessageCenter />
    </div>
  );
};

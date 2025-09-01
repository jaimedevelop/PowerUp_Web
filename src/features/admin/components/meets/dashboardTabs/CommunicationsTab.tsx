import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MeetData } from '../../../../../firebase';

interface CommunicationsTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ meet, meetId, onRefresh }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Communications</h3>
      <div className="text-slate-400 text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-600" />
        <p>Communication tools coming soon</p>
        <p className="text-sm">Send messages to participants, manage announcements, automated notifications</p>
      </div>
    </div>
  );
};

export default CommunicationsTab;
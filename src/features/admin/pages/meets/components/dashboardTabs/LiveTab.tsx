import React from 'react';
import { Zap } from 'lucide-react';
import { MeetData } from '../../../../../../firebase';

interface LiveTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const LiveTab: React.FC<LiveTabProps> = ({ meet, meetId, onRefresh }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Live Meet Management</h3>
      <div className="text-slate-400 text-center py-8">
        <Zap className="h-12 w-12 mx-auto mb-4 text-slate-600" />
        <p>Live meet features coming soon</p>
        <p className="text-sm">Real-time attempt tracking, scoreboard management, live announcements</p>
      </div>
    </div>
  );
};

export default LiveTab;
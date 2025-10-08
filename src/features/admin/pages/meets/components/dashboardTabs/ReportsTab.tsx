import React from 'react';
import { BarChart3 } from 'lucide-react';
import { MeetData } from '../../../../../../firebase';

interface ReportsTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ meet, meetId, onRefresh }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Reports & Analytics</h3>
      <div className="text-slate-400 text-center py-8">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-600" />
        <p>Reporting features coming soon</p>
        <p className="text-sm">Financial reports, participation analytics, performance metrics</p>
      </div>
    </div>
  );
};

export default ReportsTab;
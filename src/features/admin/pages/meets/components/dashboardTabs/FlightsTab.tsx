import React from 'react';
import { Users, Settings } from 'lucide-react';
import { MeetData } from '../../../../../../firebase';

interface FlightsTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const FlightsTab: React.FC<FlightsTabProps> = ({ meet, meetId, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Flight Organization Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Flight Organization</h3>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        <div className="text-slate-400 text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-4 text-slate-600" />
          <p className="text-lg mb-2">Flight Management Coming Soon</p>
          <p className="text-sm">Organize athletes into flights based on weight class, division, and equipment</p>
          <p className="text-sm mt-1">Configure flight priorities with drag-and-drop ordering</p>
        </div>
      </div>

      {/* Future Flight Display */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h4 className="text-md font-medium text-white mb-4">Flight Assignments</h4>
        <div className="text-slate-400 text-center py-4">
          <p className="text-sm">Flight assignments will appear here once organization is configured</p>
        </div>
      </div>
    </div>
  );
};

export default FlightsTab;
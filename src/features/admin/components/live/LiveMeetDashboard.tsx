import React from 'react';

interface LiveMeetDashboardProps {
  meetId: string;
  children: React.ReactNode;
}

export const LiveMeetDashboard: React.FC<LiveMeetDashboardProps> = ({ meetId, children }) => {
  return (
    <div className="space-y-6">
      {/* Live Status Bar */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-medium">LIVE</span>
            </div>
            <div className="text-white font-medium">Tampa Bay Open - Live Management</div>
          </div>
          <div className="text-sm text-slate-300">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {children}
    </div>
  );
};
// LiveMeetStatus.tsx
import React from 'react';
import { Radio, Clock, Users, Play } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';

export const LiveMeetStatus: React.FC = () => {
  const isLive = true; // Mock data
  const currentMeet = {
    name: 'Tampa Bay Open',
    currentFlight: 'Flight B - Men 83kg',
    nextLifter: 'John Smith',
    timeRemaining: '2:15'
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Live Meet Status</h3>
        {isLive && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium">LIVE</span>
          </div>
        )}
      </div>
      
      {isLive ? (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30">
            <h4 className="font-semibold text-white mb-3">{currentMeet.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-slate-300">
                <Radio size={16} />
                <span>{currentMeet.currentFlight}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Users size={16} />
                <span>Next: {currentMeet.nextLifter}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock size={16} />
                <span>{currentMeet.timeRemaining} remaining</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium">
            Access Live Controls
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio size={32} className="text-slate-500" />
          </div>
          <p className="text-slate-400 mb-4">No active meets</p>
          <button className="flex items-center space-x-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors mx-auto">
            <Play size={16} />
            <span>Start Live Meet</span>
          </button>
        </div>
      )}
    </Card>
  );
};
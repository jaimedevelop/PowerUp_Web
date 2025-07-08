import React from 'react';
import { Zap, Trophy, Calendar, MapPin, Clock } from 'lucide-react';

interface CompetitionAlertProps {
  isActive: boolean;
}

export const CompetitionAlert: React.FC<CompetitionAlertProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 mb-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Zap className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Competition Mode Active</h3>
            <p className="text-red-100">You're registered for an upcoming meet</p>
          </div>
        </div>
        <button className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-medium transition-colors">
          View Details
        </button>
      </div>
      
      <div className="bg-red-700/30 rounded-lg p-4 border border-red-500/30">
        <div className="flex items-center mb-3">
          <Trophy className="w-5 h-5 mr-2" />
          <h4 className="font-semibold">Spring Classic 2025</h4>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-red-200" />
            <span>March 15, 2025</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-200" />
            <span>Austin Convention Center</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-red-200" />
            <span>Flight B • 2:30 PM</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-red-500/30">
          <p className="text-sm text-red-100">
            <strong>Attempts:</strong> 365/385/405 SQ • 275/290/305 BP • 405/425/445 DL
          </p>
        </div>
      </div>
    </div>
  );
};
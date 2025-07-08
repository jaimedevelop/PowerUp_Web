import React, { useState } from 'react';
import { Zap, Trophy, Calendar, MapPin, Clock, Target, Timer, CheckCircle, AlertCircle } from 'lucide-react';

interface CompetitionModeProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const CompetitionMode: React.FC<CompetitionModeProps> = ({ isActive, onToggle }) => {
  const [currentLift, setCurrentLift] = useState('squat');
  const [currentAttempt, setCurrentAttempt] = useState(1);

  if (!isActive) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 text-red-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Competition Mode</h3>
        </div>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mb-4 border border-red-700/30">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Activate Competition Mode</h4>
          <p className="text-slate-400 mb-4">Transform your interface for live meet tracking with simplified controls and quick attempt logging.</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-slate-300">Simplified interface for meet day</span>
          </div>
          <div className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-slate-300">Quick attempt selection and changes</span>
          </div>
          <div className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-slate-300">Real-time flight tracking</span>
          </div>
          <div className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-slate-300">Automatic attempt logging</span>
          </div>
        </div>

        <button 
          onClick={() => onToggle(true)}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-200"
        >
          Activate Competition Mode
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Competition Mode Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Zap className="w-6 h-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Competition Mode Active</h3>
              <p className="text-red-100">Spring Classic 2025</p>
            </div>
          </div>
          <button 
            onClick={() => onToggle(false)}
            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Deactivate
          </button>
        </div>
        
        <div className="bg-red-700/30 rounded-lg p-4 border border-red-500/30">
          <div className="flex items-center mb-3">
            <Trophy className="w-5 h-5 mr-2" />
            <h4 className="font-semibold">Meet Details</h4>
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
              <strong>Planned Attempts:</strong> 365/385/405 SQ • 275/290/305 BP • 405/425/445 DL
            </p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h4 className="font-semibold text-white mb-4">Current Status</h4>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <p className="text-2xl font-bold text-white capitalize">{currentLift}</p>
            <p className="text-sm text-slate-400">Current Lift</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{currentAttempt}</p>
            <p className="text-sm text-slate-400">Attempt</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">12</p>
            <p className="text-sm text-slate-400">Minutes Left</p>
          </div>
        </div>

        {/* Current Attempt */}
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 mb-4">
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-white mb-2">365 lbs</p>
            <p className="text-slate-400 capitalize">{currentLift} - Attempt {currentAttempt}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Good Lift
            </button>
            <button className="bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              No Lift
            </button>
          </div>

          <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
            Change Attempt Weight
          </button>
        </div>

        {/* Flight Progress */}
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-white">Flight Progress</h5>
            <span className="text-sm text-slate-400">8 of 15 completed</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '53%' }}></div>
          </div>
          <p className="text-xs text-slate-400">You're up in approximately 12 minutes</p>
        </div>
      </div>

      {/* Next Attempts */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h4 className="font-semibold text-white mb-4">Planned Attempts</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
            <span className="font-medium text-white">Squat 2nd</span>
            <span className="text-slate-300">385 lbs</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
            <span className="font-medium text-white">Squat 3rd</span>
            <span className="text-slate-300">405 lbs</span>
          </div>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Update Attempts
          </button>
        </div>
      </div>
    </div>
  );
};
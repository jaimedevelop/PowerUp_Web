import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, CheckCircle } from 'lucide-react';

export const MeetRegistration: React.FC = () => {
  const [selectedMeet, setSelectedMeet] = useState('spring-classic');
  const [weightClass, setWeightClass] = useState('');
  const [division, setDivision] = useState('open');
  const [attempts, setAttempts] = useState({
    squat: '',
    bench: '',
    deadlift: ''
  });

  const meets = [
    {
      id: 'spring-classic',
      name: 'Spring Classic 2025',
      date: 'March 15, 2025',
      location: 'Iron Palace Gym, Austin TX',
      federation: 'USAPL',
      entryFee: 85,
      processingFee: 3.50
    }
  ];

  const currentMeet = meets.find(m => m.id === selectedMeet);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 text-blue-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Meet Registration</h3>
      </div>

      {currentMeet && (
        <div className="space-y-6">
          {/* Meet Info */}
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <h4 className="font-semibold text-white mb-2">{currentMeet.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">Date:</span> {currentMeet.date}
              </div>
              <div>
                <span className="text-slate-400">Federation:</span> {currentMeet.federation}
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Location:</span> {currentMeet.location}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight Class</label>
                <select 
                  value={weightClass}
                  onChange={(e) => setWeightClass(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select weight class...</option>
                  <option value="59kg">59kg</option>
                  <option value="66kg">66kg</option>
                  <option value="74kg">74kg</option>
                  <option value="83kg">83kg</option>
                  <option value="93kg">93kg</option>
                  <option value="105kg">105kg</option>
                  <option value="120kg">120kg</option>
                  <option value="120kg+">120kg+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Division</label>
                <select 
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="open">Open</option>
                  <option value="junior">Junior (20-23)</option>
                  <option value="sub-junior">Sub-Junior (14-19)</option>
                  <option value="masters1">Masters 1 (40-49)</option>
                  <option value="masters2">Masters 2 (50-59)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Opening Attempts</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Squat (lbs)</label>
                  <input 
                    type="number" 
                    value={attempts.squat}
                    onChange={(e) => setAttempts({...attempts, squat: e.target.value})}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" 
                    placeholder="315" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bench (lbs)</label>
                  <input 
                    type="number" 
                    value={attempts.bench}
                    onChange={(e) => setAttempts({...attempts, bench: e.target.value})}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" 
                    placeholder="225" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Deadlift (lbs)</label>
                  <input 
                    type="number" 
                    value={attempts.deadlift}
                    onChange={(e) => setAttempts({...attempts, deadlift: e.target.value})}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" 
                    placeholder="405" 
                  />
                </div>
              </div>
            </div>

            {/* Registration Summary */}
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <h4 className="font-medium text-white mb-3">Registration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Entry Fee</span>
                  <span>${currentMeet.entryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Processing Fee</span>
                  <span>${currentMeet.processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-600 pt-2 text-white">
                  <span>Total</span>
                  <span>${(currentMeet.entryFee + currentMeet.processingFee).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Agreements */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 mt-1" />
                <span className="ml-2 text-sm text-slate-300">I agree to the competition rules and waiver</span>
              </label>
              <label className="flex items-start">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 mt-1" />
                <span className="ml-2 text-sm text-slate-300">I have read the equipment specifications</span>
              </label>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Complete Registration & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
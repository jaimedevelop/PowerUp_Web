import React from 'react';
import { BarChart3, Medal, Trophy, TrendingUp } from 'lucide-react';

export const MeetHistory: React.FC = () => {
  const meetHistory = [
    {
      id: 1,
      name: 'Winter Championships 2024',
      date: 'December 10, 2024',
      federation: 'USAPL',
      total: 1247,
      squat: 425,
      bench: 275,
      deadlift: 547,
      placement: '2nd Place',
      weightClass: '83kg Open',
      isPR: true
    },
    {
      id: 2,
      name: 'Fall Classic 2024',
      date: 'September 15, 2024',
      federation: 'USPA',
      total: 1198,
      squat: 405,
      bench: 265,
      deadlift: 528,
      placement: '1st Place',
      weightClass: '83kg Open',
      isPR: false
    },
    {
      id: 3,
      name: 'Summer Showdown 2024',
      date: 'June 22, 2024',
      federation: 'RPS',
      total: 1156,
      squat: 385,
      bench: 255,
      deadlift: 516,
      placement: '3rd Place',
      weightClass: '83kg Open',
      isPR: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Progress Overview</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-sm text-slate-400">Total Meets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">1,247</p>
            <p className="text-sm text-slate-400">Best Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">+91</p>
            <p className="text-sm text-slate-400">Total Gain</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">3</p>
            <p className="text-sm text-slate-400">PRs Set</p>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <h4 className="font-medium text-white mb-3">Progress Chart</h4>
          <div className="h-32 bg-slate-600 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-400">
              <BarChart3 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Total progression chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet History Table */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Meet History</h3>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            Export Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Meet</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Total</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Squat</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Bench</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Deadlift</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Placement</th>
              </tr>
            </thead>
            <tbody>
              {meetHistory.map((meet) => (
                <tr key={meet.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-white">{meet.name}</h4>
                        {meet.isPR && (
                          <span className="ml-2 bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full border border-green-700/30">
                            PR
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{meet.federation} • {meet.date}</p>
                      <p className="text-xs text-slate-500">{meet.weightClass}</p>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <p className="font-bold text-white">{meet.total}</p>
                    <p className="text-xs text-slate-400">lbs</p>
                  </td>
                  <td className="text-center py-4 px-4">
                    <p className="font-medium text-red-400">{meet.squat}</p>
                  </td>
                  <td className="text-center py-4 px-4">
                    <p className="font-medium text-blue-400">{meet.bench}</p>
                  </td>
                  <td className="text-center py-4 px-4">
                    <p className="font-medium text-green-400">{meet.deadlift}</p>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center">
                      <Medal className={`w-4 h-4 mr-1 ${
                        meet.placement.includes('1st') ? 'text-yellow-400' : 
                        meet.placement.includes('2nd') ? 'text-gray-400' : 
                        'text-orange-400'
                      }`} />
                      <span className="text-sm text-slate-300">{meet.placement}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
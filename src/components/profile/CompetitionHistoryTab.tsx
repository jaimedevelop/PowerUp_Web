import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Medal, Plus } from 'lucide-react';

interface Competition {
  id: number;
  name: string;
  date: string;
  federation: string;
  location: string;
  weightClass: string;
  total: string;
  placement: string;
  squat: { attempts: number[]; best: number };
  bench: { attempts: number[]; best: number };
  deadlift: { attempts: number[]; best: number };
  wilks: number;
  isPR: boolean;
}

interface CompetitionHistoryTabProps {
  competitionHistory: Competition[];
}

export const CompetitionHistoryTab: React.FC<CompetitionHistoryTabProps> = ({ competitionHistory }) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-white">{competitionHistory.length}</p>
          <p className="text-slate-400">Total Meets</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-yellow-400">1,247</p>
          <p className="text-slate-400">Best Total</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-green-400">+91</p>
          <p className="text-slate-400">Total Gain</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-purple-400">3</p>
          <p className="text-slate-400">PRs Set</p>
        </div>
      </div>

      {/* Competition Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Competition History</h3>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Meet</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-slate-300">Total</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-slate-300">Squat</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-slate-300">Bench</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-slate-300">Deadlift</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-slate-300">Placement</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-slate-300">Details</th>
              </tr>
            </thead>
            <tbody>
              {competitionHistory.map((meet) => (
                <React.Fragment key={meet.id}>
                  <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-6">
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
                        <p className="text-xs text-slate-500">{meet.location}</p>
                        <p className="text-xs text-slate-500">{meet.weightClass}</p>
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <p className="font-bold text-white text-lg">{meet.total}</p>
                      <p className="text-xs text-slate-400">Wilks: {meet.wilks}</p>
                    </td>
                    <td className="text-center py-4 px-6">
                      <p className="font-medium text-red-400">{meet.squat.best}</p>
                    </td>
                    <td className="text-center py-4 px-6">
                      <p className="font-medium text-blue-400">{meet.bench.best}</p>
                    </td>
                    <td className="text-center py-4 px-6">
                      <p className="font-medium text-green-400">{meet.deadlift.best}</p>
                    </td>
                    <td className="text-center py-4 px-6">
                      <div className="flex items-center justify-center">
                        <Medal className={`w-4 h-4 mr-1 ${
                          meet.placement.includes('1st') ? 'text-yellow-400' : 
                          meet.placement.includes('2nd') ? 'text-gray-400' : 
                          'text-orange-400'
                        }`} />
                        <span className="text-sm text-slate-300">{meet.placement}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <button 
                        onClick={() => toggleRow(meet.id)}
                        className="p-2 hover:bg-slate-600 rounded-full transition-colors"
                      >
                        {expandedRows.includes(meet.id) ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows.includes(meet.id) && (
                    <tr className="bg-slate-700/50">
                      <td colSpan={7} className="py-4 px-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
                            <h5 className="font-medium text-red-400 mb-2">Squat Attempts</h5>
                            <div className="space-y-1">
                              {meet.squat.attempts.map((attempt, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-slate-400">Attempt {index + 1}:</span>
                                  <span className="text-white">{attempt} lbs</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
                            <h5 className="font-medium text-blue-400 mb-2">Bench Attempts</h5>
                            <div className="space-y-1">
                              {meet.bench.attempts.map((attempt, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-slate-400">Attempt {index + 1}:</span>
                                  <span className="text-white">{attempt} lbs</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
                            <h5 className="font-medium text-green-400 mb-2">Deadlift Attempts</h5>
                            <div className="space-y-1">
                              {meet.deadlift.attempts.map((attempt, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-slate-400">Attempt {index + 1}:</span>
                                  <span className="text-white">{attempt} lbs</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
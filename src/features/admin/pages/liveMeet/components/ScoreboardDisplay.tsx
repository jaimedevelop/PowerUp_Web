import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Eye, Settings } from 'lucide-react';

interface LifterScore {
  id: string;
  name: string;
  team?: string;
  weightClass: string;
  total: number;
  bodyweight: number;
  wilks: number;
  bestSquat: number;
  bestBench: number;
  bestDeadlift: number;
}

interface ScoreboardDisplayProps {
  meetId: string;
}

const mockScores: LifterScore[] = [
  {
    id: '1',
    name: 'John Smith',
    team: 'Powerlifting Gym',
    weightClass: 'Male 83kg',
    total: 705,
    bodyweight: 82.5,
    wilks: 452.3,
    bestSquat: 280,
    bestBench: 170,
    bestDeadlift: 255
  },
  {
    id: '2',
    name: 'Mike Johnson',
    team: 'Iron Warriors',
    weightClass: 'Male 83kg',
    total: 680,
    bodyweight: 81.2,
    wilks: 441.7,
    bestSquat: 270,
    bestBench: 160,
    bestDeadlift: 250
  },
  {
    id: '3',
    name: 'David Wilson',
    team: 'Strength Academy',
    weightClass: 'Male 83kg',
    total: 665,
    bodyweight: 82.8,
    wilks: 428.9,
    bestSquat: 265,
    bestBench: 155,
    bestDeadlift: 245
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    team: 'Powerlifting Gym',
    weightClass: 'Female 57kg',
    total: 425,
    bodyweight: 56.8,
    wilks: 385.2,
    bestSquat: 160,
    bestBench: 95,
    bestDeadlift: 170
  },
  {
    id: '5',
    name: 'Lisa Chen',
    team: 'Strength Academy',
    weightClass: 'Female 57kg',
    total: 410,
    bodyweight: 56.5,
    wilks: 372.8,
    bestSquat: 155,
    bestBench: 90,
    bestDeadlift: 165
  }
];

export const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({ meetId }) => {
  const [sortBy, setSortBy] = useState<'total' | 'wilks' | 'weightClass'>('wilks');
  const [showWeightClass, setShowWeightClass] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-400" size={20} />;
      case 1:
        return <Medal className="text-gray-300" size={20} />;
      case 2:
        return <Award className="text-amber-700" size={20} />;
      default:
        return <span className="text-slate-400 font-bold">{index + 1}</span>;
    }
  };

  const sortedScores = [...mockScores]
    .filter(score => showWeightClass === 'all' || score.weightClass === showWeightClass)
    .sort((a, b) => {
      if (sortBy === 'total') {
        return b.total - a.total;
      } else if (sortBy === 'wilks') {
        return b.wilks - a.wilks;
      } else {
        return a.weightClass.localeCompare(b.weightClass) || b.wilks - a.wilks;
      }
    });

  const weightClasses = Array.from(new Set(mockScores.map(score => score.weightClass)));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Trophy className="mr-2" size={20} />
          Live Scoreboard
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Scoreboard Settings */}
      {showSettings && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="wilks">Wilks Score</option>
                <option value="total">Total Kg</option>
                <option value="weightClass">Weight Class</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Weight Class</label>
              <select
                value={showWeightClass}
                onChange={(e) => setShowWeightClass(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {weightClasses.map(wc => (
                  <option key={wc} value={wc}>{wc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Scoreboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
              <th className="pb-3 w-12">Rank</th>
              <th className="pb-3">Lifter</th>
              <th className="pb-3">Class</th>
              <th className="pb-3 text-right">Total</th>
              <th className="pb-3 text-right">Wilks</th>
              <th className="pb-3 text-right">Squat</th>
              <th className="pb-3 text-right">Bench</th>
              <th className="pb-3 text-right">Deadlift</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map((score, index) => (
              <tr key={score.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-3">
                  <div className="flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                </td>
                <td className="py-3">
                  <div>
                    <div className="font-medium text-white">{score.name}</div>
                    {score.team && (
                      <div className="text-sm text-slate-400">{score.team}</div>
                    )}
                  </div>
                </td>
                <td className="py-3 text-sm text-slate-400">{score.weightClass}</td>
                <td className="py-3 text-right font-medium text-white">{score.total}kg</td>
                <td className="py-3 text-right font-medium text-white">{score.wilks.toFixed(1)}</td>
                <td className="py-3 text-right text-sm text-slate-300">{score.bestSquat}kg</td>
                <td className="py-3 text-right text-sm text-slate-300">{score.bestBench}kg</td>
                <td className="py-3 text-right text-sm text-slate-300">{score.bestDeadlift}kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scoreboard Summary */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Top Wilks</div>
              <TrendingUp className="text-purple-400" size={16} />
            </div>
            <div className="text-lg font-bold text-white">
              {sortedScores.length > 0 ? sortedScores[0].wilks.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-slate-500">
              {sortedScores.length > 0 ? sortedScores[0].name : 'N/A'}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Top Total</div>
              <Trophy className="text-yellow-400" size={16} />
            </div>
            <div className="text-lg font-bold text-white">
              {sortedScores.length > 0 ? `${sortedScores[0].total}kg` : '0kg'}
            </div>
            <div className="text-xs text-slate-500">
              {sortedScores.length > 0 ? sortedScores[0].name : 'N/A'}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Lifters</div>
              <Eye className="text-blue-400" size={16} />
            </div>
            <div className="text-lg font-bold text-white">{sortedScores.length}</div>
            <div className="text-xs text-slate-500">
              {showWeightClass === 'all' ? 'All classes' : showWeightClass}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
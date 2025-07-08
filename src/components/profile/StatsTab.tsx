import React from 'react';
import { BarChart3, Download, Share, TrendingUp } from 'lucide-react';

interface StatsTabProps {
  personalStats: {
    currentTotal: string;
    squat: { current: number; pr: number; prDate: string };
    bench: { current: number; pr: number; prDate: string };
    deadlift: { current: number; pr: number; prDate: string };
    wilks: number;
    dots: number;
    bodyweight: number;
    totalWorkouts: number;
  };
}

export const StatsTab: React.FC<StatsTabProps> = ({ personalStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Current Lifts */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Current Lifts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-700/30">
              <div>
                <p className="text-red-400 font-medium">Squat</p>
                <p className="text-2xl font-bold text-white">{personalStats.squat.current} lbs</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">PR: {personalStats.squat.pr} lbs</p>
                <p className="text-xs text-slate-500">{personalStats.squat.prDate}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
              <div>
                <p className="text-blue-400 font-medium">Bench Press</p>
                <p className="text-2xl font-bold text-white">{personalStats.bench.current} lbs</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">PR: {personalStats.bench.pr} lbs</p>
                <p className="text-xs text-slate-500">{personalStats.bench.prDate}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-700/30">
              <div>
                <p className="text-green-400 font-medium">Deadlift</p>
                <p className="text-2xl font-bold text-white">{personalStats.deadlift.current} lbs</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">PR: {personalStats.deadlift.pr} lbs</p>
                <p className="text-xs text-slate-500">{personalStats.deadlift.prDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-700/30">
              <p className="text-2xl font-bold text-purple-400">{personalStats.wilks}</p>
              <p className="text-purple-300">Wilks Score</p>
            </div>
            <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
              <p className="text-2xl font-bold text-blue-400">{personalStats.dots}</p>
              <p className="text-blue-300">DOTS Score</p>
            </div>
            <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-700/30">
              <p className="text-2xl font-bold text-green-400">{personalStats.bodyweight}</p>
              <p className="text-green-300">Body Weight (lbs)</p>
            </div>
            <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-700/30">
              <p className="text-2xl font-bold text-orange-400">{personalStats.totalWorkouts}</p>
              <p className="text-orange-300">Total Workouts</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Export Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
              <Download className="w-5 h-5 mr-2 text-slate-300" />
              <span className="font-medium text-white">Export CSV</span>
            </button>
            <button className="flex items-center justify-center p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
              <Share className="w-5 h-5 mr-2 text-slate-300" />
              <span className="font-medium text-white">Share Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Progress Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Total Progression</h3>
          <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
            <div className="text-center text-slate-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p className="font-medium">Progress Chart</p>
              <p className="text-sm">Shows total progression over time</p>
            </div>
          </div>
        </div>

        {/* Lift Breakdown */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Lift Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-slate-300 font-medium">Squat</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{personalStats.squat.current} lbs</p>
                <p className="text-sm text-slate-400">34.1% of total</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-slate-300 font-medium">Bench Press</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{personalStats.bench.current} lbs</p>
                <p className="text-sm text-slate-400">22.1% of total</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-slate-300 font-medium">Deadlift</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{personalStats.deadlift.current} lbs</p>
                <p className="text-sm text-slate-400">43.8% of total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Volume Progress</span>
                <span className="text-white font-medium">85% of target</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Intensity Progress</span>
                <span className="text-white font-medium">92% of target</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Frequency</span>
                <span className="text-white font-medium">100% of target</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
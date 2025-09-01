import React from 'react';
import { TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';

export const TrainingStats: React.FC = () => {
  const stats = [
    {
      icon: TrendingUp,
      label: 'This Week',
      value: '4',
      subtitle: 'workouts',
      color: 'text-green-400'
    },
    {
      icon: Target,
      label: 'PRs Set',
      value: '2',
      subtitle: 'this month',
      color: 'text-blue-400'
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: '12h',
      subtitle: 'this week',
      color: 'text-orange-400'
    }
  ];

  const recentPRs = [
    {
      exercise: 'Squat',
      weight: '365 lbs',
      date: '2 days ago',
      improvement: '+10 lbs',
      color: 'text-red-400'
    },
    {
      exercise: 'Bench Press',
      weight: '275 lbs',
      date: '1 week ago',
      improvement: '+5 lbs',
      color: 'text-blue-400'
    },
    {
      exercise: 'Deadlift',
      weight: '425 lbs',
      date: '2 weeks ago',
      improvement: '+15 lbs',
      color: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Training Stats</h3>
        </div>
        
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center">
                  <IconComponent className={`w-5 h-5 ${stat.color} mr-3`} />
                  <span className="text-slate-300 font-medium">{stat.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent PRs */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Award className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Recent PRs</h3>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentPRs.map((pr, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div>
                <p className={`font-semibold ${pr.color}`}>{pr.exercise}</p>
                <p className="text-sm text-slate-400">{pr.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{pr.weight}</p>
                <p className="text-sm text-green-400">{pr.improvement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Volume</span>
            <span className="text-white font-medium">85% of target</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Intensity</span>
            <span className="text-white font-medium">92% of target</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Frequency</span>
            <span className="text-white font-medium">100% of target</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
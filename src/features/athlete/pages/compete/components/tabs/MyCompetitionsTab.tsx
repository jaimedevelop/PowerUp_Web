import React from 'react';
import { UpcomingMeets } from '../UpcomingMeets';
import { MeetHistory } from '../MeetHistory';
import { TrendingUp, Calendar, Trophy, Target, Award, Zap } from 'lucide-react';

export const MyCompetitionsTab: React.FC = () => {
  const progressStats = [
    {
      label: 'Total Progression',
      value: '+147 lbs',
      subtitle: 'since first meet',
      trend: 'up',
      color: 'text-green-400'
    },
    {
      label: 'Average Placement',
      value: '2.1',
      subtitle: 'across all meets',
      trend: 'up',
      color: 'text-blue-400'
    },
    {
      label: 'Success Rate',
      value: '87%',
      subtitle: 'successful attempts',
      trend: 'up',
      color: 'text-purple-400'
    },
    {
      label: 'PR Frequency',
      value: '2.3',
      subtitle: 'PRs per meet',
      trend: 'up',
      color: 'text-yellow-400'
    }
  ];

  const recentAchievements = [
    {
      title: '1000 lb Club',
      description: 'Achieved total over 1000 lbs',
      date: 'December 2024',
      icon: Trophy,
      color: 'text-yellow-400'
    },
    {
      title: 'Perfect Meet',
      description: 'Went 9/9 at Fall Classic',
      date: 'September 2024',
      icon: Target,
      color: 'text-green-400'
    },
    {
      title: 'First Place Finish',
      description: '1st in 83kg Open division',
      date: 'September 2024',
      icon: Award,
      color: 'text-purple-400'
    }
  ];

  const quickActions = [
    {
      label: 'Activate Competition Mode',
      description: 'For upcoming Spring Classic',
      icon: Zap,
      color: 'bg-red-600 hover:bg-red-700',
      available: true
    },
    {
      label: 'Update Attempts',
      description: 'Modify planned attempts',
      icon: Target,
      color: 'bg-blue-600 hover:bg-blue-700',
      available: true
    },
    {
      label: 'Export Meet Data',
      description: 'Download competition history',
      icon: Calendar,
      color: 'bg-green-600 hover:bg-green-700',
      available: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Progress Overview Section */}
      <div>
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Progress Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {progressStats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-center">
                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-sm font-medium text-white mb-1">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Chart Placeholder */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h4 className="font-semibold text-white mb-4">Total Progression Over Time</h4>
          <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
            <div className="text-center text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm">Interactive progression chart</p>
              <p className="text-xs">Shows total, individual lifts, and Wilks score over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Award className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Recent Achievements</h3>
          </div>
          <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {recentAchievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div key={index} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center mb-3">
                  <IconComponent className={`w-5 h-5 ${achievement.color} mr-3`} />
                  <span className="font-medium text-white">{achievement.title}</span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{achievement.description}</p>
                <p className="text-xs text-slate-400">{achievement.date}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className={`${action.color} text-white p-4 rounded-xl text-left transition-colors ${
                  !action.available ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!action.available}
              >
                <div className="flex items-center mb-2">
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="font-medium">{action.label}</span>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout for Upcoming Meets and History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Meets */}
        <div>
          <UpcomingMeets />
        </div>

        {/* Meet History Summary */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Recent Competition History</h3>
            </div>
            <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
              View Full History
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">Winter Championships 2024</h4>
                <span className="bg-gray-900/50 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700/30">
                  2nd Place
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-red-400 font-medium">425</p>
                  <p className="text-slate-400 text-xs">SQ</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-medium">275</p>
                  <p className="text-slate-400 text-xs">BP</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-medium">547</p>
                  <p className="text-slate-400 text-xs">DL</p>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-slate-600">
                <p className="text-white font-bold">1,247 lbs</p>
                <p className="text-slate-400 text-xs">Total • December 10, 2024</p>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">Fall Classic 2024</h4>
                <span className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded-full border border-yellow-700/30">
                  1st Place
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-red-400 font-medium">405</p>
                  <p className="text-slate-400 text-xs">SQ</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-medium">265</p>
                  <p className="text-slate-400 text-xs">BP</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-medium">528</p>
                  <p className="text-slate-400 text-xs">DL</p>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-slate-600">
                <p className="text-white font-bold">1,198 lbs</p>
                <p className="text-slate-400 text-xs">Total • September 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
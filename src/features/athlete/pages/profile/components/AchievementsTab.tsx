import React from 'react';
import { Trophy, Medal, Star, Target, Calendar, TrendingUp } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: any;
  color: string;
}

interface AchievementsTabProps {
  achievements: Achievement[];
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  const colorClasses = {
    yellow: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30',
    blue: 'bg-blue-900/20 text-blue-400 border-blue-700/30',
    purple: 'bg-purple-900/20 text-purple-400 border-purple-700/30',
    green: 'bg-green-900/20 text-green-400 border-green-700/30',
    orange: 'bg-orange-900/20 text-orange-400 border-orange-700/30',
    red: 'bg-red-900/20 text-red-400 border-red-700/30'
  };

  return (
    <div className="space-y-8">
      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          
          return (
            <div 
              key={achievement.id} 
              className={`p-6 rounded-xl border-2 ${colorClasses[achievement.color as keyof typeof colorClasses]} hover:scale-105 transition-transform duration-200`}
            >
              <div className="text-center">
                <IconComponent className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                <p className="text-sm mb-3 opacity-90">{achievement.description}</p>
                <p className="text-xs opacity-75">{achievement.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress to Next Achievements */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Progress to Next Achievement</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="font-medium text-white">Elite Total (1400+ lbs)</span>
                </div>
                <span className="text-sm text-slate-400">153 lbs to go</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '89%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">89% complete</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-medium text-white">Century Club (100 workouts)</span>
                </div>
                <span className="text-sm text-green-400">Completed!</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">100% complete</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="font-medium text-white">Social Butterfly (50 followers)</span>
                </div>
                <span className="text-sm text-slate-400">12 to go</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '76%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">76% complete</p>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Achievement Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
                <span className="text-slate-300">Total Earned</span>
              </div>
              <span className="text-2xl font-bold text-white">{achievements.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-blue-400 mr-3" />
                <span className="text-slate-300">This Month</span>
              </div>
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
                <span className="text-slate-300">Completion Rate</span>
              </div>
              <span className="text-2xl font-bold text-white">85%</span>
            </div>
          </div>
          
          {/* Recent Achievement Highlight */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-700/30">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="font-medium text-yellow-300">Latest Achievement</span>
            </div>
            <h4 className="font-semibold text-white">PR Machine</h4>
            <p className="text-sm text-yellow-200">Earned for 20+ personal records</p>
            <p className="text-xs text-yellow-300 mt-1">Jan 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};
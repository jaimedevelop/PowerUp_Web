import React from 'react';
import { Activity, TrendingUp, Award, Users, Calendar } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'achievement',
      icon: Award,
      title: 'New PR Set',
      description: 'Deadlift: 425 lbs (+10)',
      time: '2 hours ago',
      color: 'text-yellow-400'
    },
    {
      id: 2,
      type: 'social',
      icon: Users,
      title: 'New Follower',
      description: '@mike_powerlifter started following you',
      time: '4 hours ago',
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'training',
      icon: TrendingUp,
      title: 'Workout Completed',
      description: 'Upper Body Power - Week 3',
      time: '1 day ago',
      color: 'text-green-400'
    },
    {
      id: 4,
      type: 'competition',
      icon: Calendar,
      title: 'Meet Registration',
      description: 'Registered for Texas State Championships',
      time: '2 days ago',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-slate-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <IconComponent className={`w-4 h-4 ${activity.color}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{activity.title}</p>
                <p className="text-sm text-slate-400 truncate">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">12</p>
            <p className="text-xs text-slate-400">This Week</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">3</p>
            <p className="text-xs text-slate-400">PRs Set</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-400">8</p>
            <p className="text-xs text-slate-400">Workouts</p>
          </div>
        </div>
      </div>
    </div>
  );
};
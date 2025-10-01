import React from 'react';
import { UpcomingMeets } from './UpcomingMeets';
import { MeetHistory } from './MeetHistory';
import { TrendingUp, Calendar, Trophy, Target, Award, Zap, MapPin } from 'lucide-react';
import { tw, getButtonClass } from '../../../../styles/theme';

export const MyCompetitionsTab: React.FC = () => {
  const progressStats = [
    {
      label: 'Total Progression',
      value: '+147 lbs',
      subtitle: 'since first meet',
      trend: 'up',
      color: 'var(--action-green-to)',
    },
    {
      label: 'Average Placement',
      value: '2.1',
      subtitle: 'across all meets',
      trend: 'up',
      // neutral (was blue): use primary text color
      color: 'var(--text-primary)',
    },
    {
      label: 'Success Rate',
      value: '87%',
      subtitle: 'successful attempts',
      trend: 'up',
      color: 'var(--action-yellow-to)',
    },
    {
      label: 'PR Frequency',
      value: '2.3',
      subtitle: 'PRs per meet',
      trend: 'up',
      color: 'var(--action-green-to)',
    },
  ];

  const recentAchievements = [
    {
      title: '1000 lb Club',
      description: 'Achieved total over 1000 lbs',
      date: 'December 2024',
      icon: Trophy,
      color: 'var(--action-yellow-to)',
    },
    {
      title: 'Perfect Meet',
      description: 'Went 9/9 at Fall Classic',
      date: 'September 2024',
      icon: Target,
      color: 'var(--action-green-to)',
    },
    {
      title: 'First Place Finish',
      description: '1st in 83kg Open division',
      date: 'September 2024',
      icon: Award,
      color: 'var(--text-primary)',
    },
  ];

  const quickActions = [
    {
      label: 'Activate Competition Mode',
      description: 'For upcoming Spring Classic',
      icon: Zap,
      variant: 'red' as const,
      available: true,
    },
    {
      label: 'Update Attempts',
      description: 'Modify planned attempts',
      icon: Target,
      variant: 'yellow' as const,
      available: true,
    },
    {
      label: 'Export Meet Data',
      description: 'Download competition history',
      icon: Calendar,
      variant: 'green' as const,
      available: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Progress Overview Section */}
      <div>
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 mr-3 text-[color:var(--text-primary)]" />
          <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Progress Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {progressStats.map((stat, index) => (
            <div key={index} className={`${tw.glassCard} ${tw.glassCardHover} rounded-xl p-4`}>
              <div className="text-center">
                <p className="text-2xl font-bold mb-1" style={{ color: `var(--override, ${stat.color})` } as React.CSSProperties}>{stat.value}</p>
                <p className="text-sm font-medium text-[color:var(--text-primary)] mb-1">{stat.label}</p>
                <p className="text-xs text-[color:var(--text-tertiary)]">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Chart Placeholder */}
        <div className={`${tw.glassCard} ${tw.glassCardHover} rounded-xl p-6 mb-8`}>
          <h4 className="font-semibold text-[color:var(--text-primary)] mb-4">Total Progression Over Time</h4>
          <div className="h-48 rounded-lg flex items-center justify-center border border-[color:var(--glass-border)] bg-[var(--glass-bg)]">
            <div className="text-center text-[color:var(--text-secondary)]">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm">Interactive progression chart</p>
              <p className="text-xs text-[color:var(--text-tertiary)]">Shows total, individual lifts, and Wilks score over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Award className="w-6 h-6 mr-3" style={{ color: 'var(--action-yellow-to)' }} />
            <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Recent Achievements</h3>
          </div>
          <button className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm font-medium transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {recentAchievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div key={index} className={`${tw.glassCard} ${tw.glassCardHover} rounded-xl p-4`}>
                <div className="flex items-center mb-3">
                  <IconComponent className="w-5 h-5 mr-3" style={{ color: achievement.color }} />
                  <span className="font-medium text-[color:var(--text-primary)]">{achievement.title}</span>
                </div>
                <p className="text-sm text-[color:var(--text-secondary)] mb-2">{achievement.description}</p>
                <p className="text-xs text-[color:var(--text-tertiary)]">{achievement.date}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className={`text-white p-4 rounded-xl text-left transition-transform hover:scale-[1.01] ${getButtonClass(action.variant)}`}
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
        <div className={`${tw.glassCard} ${tw.glassCardHover} rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Trophy className="w-6 h-6 mr-3" style={{ color: 'var(--action-yellow-to)' }} />
              <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Recent Competition History</h3>
            </div>
            <button className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm font-medium transition-colors">
              View Full History
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border border-[color:var(--glass-border)] bg-[var(--glass-bg)]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-[color:var(--text-primary)]">Winter Championships 2024</h4>
                <span className="bg-black/40 text-[color:var(--text-secondary)] text-xs px-2 py-1 rounded-full border border-[color:var(--glass-border)]">
                  2nd Place
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium" style={{ color: 'var(--action-red-to)' }}>425</p>
                  <p className="text-[color:var(--text-tertiary)] text-xs">SQ</p>
                </div>
                <div className="text-center">
                  <p className="font-medium" style={{ color: 'var(--action-yellow-to)' }}>275</p>
                  <p className="text-[color:var(--text-tertiary)] text-xs">BP</p>
                </div>
                <div className="text-center">
                  <p className="font-medium" style={{ color: 'var(--action-green-to)' }}>547</p>
                  <p className="text-[color:var(--text-tertiary)] text-xs">DL</p>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-[color:var(--glass-border)]">
                <p className="text-[color:var(--text-primary)] font-bold">1,247 lbs</p>
                <p className="text-[color:var(--text-tertiary)] text-xs">Total • December 10, 2024</p>
              </div>
            </div>

            <div className="rounded-lg p-4 border border-[color:var(--glass-border)] bg-[var(--glass-bg)]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-[color:var(--text-primary)]">Fall Classic 2024</h4>
                <span className="bg-black/40 text-[color:var(--text-secondary)] text-xs px-2 py-1 rounded-full border border-[color:var(--glass-border)]">
                  1st Place
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium" style={{ color: 'var(--action-red-to)' }}>405</p>
                  <p className="text-[color:var(--text-tertiary)] text-xs">SQ</p>
                </div>
                <div className="text-center">
                  <p className="font-medium" style={{ color: 'var(--action-yellow-to)' }}>265</p>
                  <p className="text-[color:var(--text-tertiary)] text-xs">BP</p>
                </div>
                <div className="text-center">
                  <p className="font-medium" style={{ color: 'var(--action-green-to)' }}>528</p>
                  <p className="text-[color:var(--text-tertiary)] text-xs">DL</p>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-[color:var(--glass-border)]">
                <p className="text-[color:var(--text-primary)] font-bold">1,198 lbs</p>
                <p className="text-[color:var(--text-tertiary)] text-xs">Total • September 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
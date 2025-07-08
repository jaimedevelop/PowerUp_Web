import React, { useState } from 'react';
import { User, BarChart3, Trophy, Award, Settings } from 'lucide-react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsTab } from '../components/profile/StatsTab';
import { CompetitionHistoryTab } from '../components/profile/CompetitionHistoryTab';
import { AchievementsTab } from '../components/profile/AchievementsTab';
import { SettingsTab } from '../components/profile/SettingsTab';

type TabType = 'stats' | 'competition-history' | 'achievements' | 'settings';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    username: '@alexlifts',
    bio: 'Passionate powerlifter chasing that 1500 total 💪',
    location: 'Austin, TX',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    weightClass: '83kg',
    division: 'Open',
    federation: 'USAPL',
    coach: 'Sarah Johnson',
    gym: 'Iron Palace Gym'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    workoutReminders: true,
    competitionUpdates: true,
    socialActivity: false,
    coachMessages: true
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    statsPublic: true,
    competitionHistory: true,
    workoutData: false
  });

  const [theme, setTheme] = useState('dark');

  const personalStats = {
    currentTotal: '1,247 lbs',
    squat: { current: 425, pr: 435, prDate: 'Dec 2024' },
    bench: { current: 275, pr: 285, prDate: 'Nov 2024' },
    deadlift: { current: 547, pr: 555, prDate: 'Jan 2025' },
    wilks: 387.5,
    dots: 412.3,
    bodyweight: 181,
    workoutsThisMonth: 16,
    totalWorkouts: 234,
    prCount: 23
  };

  const competitionHistory = [
    {
      id: 1,
      name: 'Winter Championships 2024',
      date: 'Dec 10, 2024',
      federation: 'USAPL',
      location: 'Dallas, TX',
      weightClass: '83kg Open',
      total: '1,247 lbs',
      placement: '2nd Place',
      squat: { attempts: [405, 425, 435], best: 425 },
      bench: { attempts: [255, 275, 285], best: 275 },
      deadlift: { attempts: [525, 547, 560], best: 547 },
      wilks: 387.5,
      isPR: true
    },
    {
      id: 2,
      name: 'Fall Classic 2024',
      date: 'Sep 15, 2024',
      federation: 'USPA',
      location: 'Austin, TX',
      weightClass: '83kg Open',
      total: '1,198 lbs',
      placement: '1st Place',
      squat: { attempts: [385, 405, 415], best: 405 },
      bench: { attempts: [245, 265, 275], best: 265 },
      deadlift: { attempts: [505, 528, 540], best: 528 },
      wilks: 372.1,
      isPR: false
    },
    {
      id: 3,
      name: 'Summer Showdown 2024',
      date: 'Jun 22, 2024',
      federation: 'RPS',
      location: 'Houston, TX',
      weightClass: '83kg Open',
      total: '1,156 lbs',
      placement: '3rd Place',
      squat: { attempts: [365, 385, 400], best: 385 },
      bench: { attempts: [235, 255, 265], best: 255 },
      deadlift: { attempts: [495, 516, 530], best: 516 },
      wilks: 358.2,
      isPR: false
    }
  ];

  const achievements = [
    { id: 1, title: '1000 lb Club', description: 'First powerlifter milestone', date: 'Mar 2023', icon: Trophy, color: 'yellow' },
    { id: 2, title: 'Competition Debut', description: 'First powerlifting meet', date: 'Jun 2023', icon: Award, color: 'blue' },
    { id: 3, title: 'State Record', description: '83kg Deadlift Record', date: 'Dec 2024', icon: Trophy, color: 'purple' },
    { id: 4, title: 'Perfect Meet', description: '9/9 successful attempts', date: 'Sep 2024', icon: Award, color: 'green' },
    { id: 5, title: 'Consistency King', description: '50 consecutive workouts', date: 'Nov 2024', icon: Trophy, color: 'orange' },
    { id: 6, title: 'PR Machine', description: '20+ personal records', date: 'Jan 2025', icon: Award, color: 'red' }
  ];

  const subscriptions = [
    {
      id: 1,
      name: 'Sarah Johnson Coaching',
      type: 'Personal Coaching',
      price: '$150/month',
      nextBilling: 'Feb 15, 2025',
      status: 'active',
      features: ['Custom Programming', '24/7 Support', 'Video Analysis', 'Meet Prep']
    },
    {
      id: 2,
      name: 'Juggernaut Training Systems',
      type: 'Program Access',
      price: '$29/month',
      nextBilling: 'Feb 12, 2025',
      status: 'active',
      features: ['All Programs', 'Exercise Library', 'Progress Tracking']
    },
    {
      id: 3,
      name: 'PowerLift Pro',
      type: 'App Premium',
      price: '$9.99/month',
      nextBilling: 'Feb 20, 2025',
      status: 'active',
      features: ['Advanced Analytics', 'Cloud Sync', 'Priority Support']
    }
  ];

  const socialConnections = {
    instagram: { connected: true, handle: '@alexlifts', followers: '2.1K' },
    youtube: { connected: false, handle: '', followers: '0' },
    twitter: { connected: true, handle: '@alex_powerlifts', followers: '456' },
    website: { connected: false, url: '' }
  };

  const tabs = [
    { id: 'stats' as TabType, name: 'Stats', icon: BarChart3 },
    { id: 'competition-history' as TabType, name: 'Competition History', icon: Trophy },
    { id: 'achievements' as TabType, name: 'Achievements', icon: Award },
    { id: 'settings' as TabType, name: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsTab personalStats={personalStats} />;
      case 'competition-history':
        return <CompetitionHistoryTab competitionHistory={competitionHistory} />;
      case 'achievements':
        return <AchievementsTab achievements={achievements} />;
      case 'settings':
        return (
          <SettingsTab
            profileData={profileData}
            notifications={notifications}
            privacy={privacy}
            theme={theme}
            subscriptions={subscriptions}
            socialConnections={socialConnections}
            onProfileUpdate={setProfileData}
            onNotificationUpdate={setNotifications}
            onPrivacyUpdate={setPrivacy}
            onThemeChange={setTheme}
          />
        );
      default:
        return <StatsTab personalStats={personalStats} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <User className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-white">Profile</h1>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        profileData={profileData}
        personalStats={personalStats}
        competitionCount={competitionHistory.length}
        onEdit={() => setActiveTab('settings')}
      />

      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-xl p-2 border border-slate-700">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
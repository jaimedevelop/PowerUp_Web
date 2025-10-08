// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { User, BarChart3, Trophy, Award, Settings, AlertCircle } from 'lucide-react';
import { ProfileHeader } from './components/ProfileHeader';
import { StatsTab } from './components/StatsTab';
import { CompetitionHistoryTab } from './components/CompetitionHistoryTab';
import { AchievementsTab } from './components/AchievementsTab';
import { SettingsTab } from './components/SettingsTab';
import { useAuth } from '../../../../contexts/shared/AuthContext';
import { updateUserProfile, hasRequiredRegistrationInfo, getMissingRegistrationFields } from '../../../../services/shared/auth';

type TabType = 'stats' | 'competition-history' | 'achievements' | 'settings';

export const ProfilePage: React.FC = () => {
  const { userProfile, currentUser, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Check for missing registration fields
  useEffect(() => {
    if (userProfile) {
      const missing = getMissingRegistrationFields(userProfile);
      setMissingFields(missing);
    }
  }, [userProfile]);

  // Initialize profile data from userProfile
  const initializeProfileData = (profile: any) => {
    if (!profile) return null;
    
    return {
      name: profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '',
      username: profile.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
      email: profile.email || '',
      phone: profile.phone || '',
      weightClass: profile.weightClass || '83kg',
      division: profile.division || 'Open',
      federation: profile.federation || 'USAPL',
      coach: profile.coach || '',
      gym: profile.gym || '',
      
      // Required for meet registration
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      gender: profile.gender || '',
      
      // Emergency Contact
      emergencyContact: profile.emergencyContact || {
        name: '',
        phone: '',
        relationship: '',
        email: ''
      },
      
      // Federation Membership
      federationMembership: profile.federationMembership ? {
        federation: profile.federationMembership.federation || '',
        membershipNumber: profile.federationMembership.membershipNumber || '',
        expirationDate: profile.federationMembership.expirationDate ? 
          new Date(profile.federationMembership.expirationDate).toISOString().split('T')[0] : ''
      } : {
        federation: '',
        membershipNumber: '',
        expirationDate: ''
      },
      
      // Coach Info (if applicable)
      coachPhone: profile.coachPhone || '',
      coachPowerUpUsername: profile.coachPowerUpUsername || '',
      teamName: profile.teamName || '',
      teamPowerUpUsername: profile.teamPowerUpUsername || ''
    };
  };

  // Profile data state
  const [profileData, setProfileData] = useState(() => 
    initializeProfileData(userProfile) || {
      name: '',
      username: '',
      bio: '',
      location: '',
      email: '',
      phone: '',
      weightClass: '83kg',
      division: 'Open',
      federation: 'USAPL',
      coach: '',
      gym: '',
      dateOfBirth: '',
      gender: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
        email: ''
      },
      federationMembership: {
        federation: '',
        membershipNumber: '',
        expirationDate: ''
      },
      coachPhone: '',
      coachPowerUpUsername: '',
      teamName: '',
      teamPowerUpUsername: ''
    }
  );

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: userProfile?.notifications?.email ?? true,
    push: userProfile?.notifications?.push ?? true,
    workoutReminders: userProfile?.notifications?.workoutReminders ?? true,
    coachMessages: userProfile?.notifications?.coachMessages ?? true
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profilePublic: userProfile?.privacy?.profilePublic ?? true,
    statsPublic: userProfile?.privacy?.statsPublic ?? true,
    competitionHistory: userProfile?.privacy?.competitionHistory ?? true
  });

  // Theme state
  const [theme, setTheme] = useState(userProfile?.theme || 'dark');
  
  // Update states when userProfile changes (e.g., after refresh or auth state change)
  useEffect(() => {
    if (userProfile) {
      const newProfileData = initializeProfileData(userProfile);
      if (newProfileData) {
        setProfileData(newProfileData);
      }
      
      // Update notifications
      setNotifications({
        email: userProfile.notifications?.email ?? true,
        push: userProfile.notifications?.push ?? true,
        workoutReminders: userProfile.notifications?.workoutReminders ?? true,
        coachMessages: userProfile.notifications?.coachMessages ?? true
      });
      
      // Update privacy
      setPrivacy({
        profilePublic: userProfile.privacy?.profilePublic ?? true,
        statsPublic: userProfile.privacy?.statsPublic ?? true,
        competitionHistory: userProfile.privacy?.competitionHistory ?? true
      });
      
      // Update theme
      setTheme(userProfile.theme || 'dark');
      
      // Update social connections
      setSocialConnections({
        instagram: { 
          connected: !!userProfile.socialMedia?.instagram, 
          handle: userProfile.socialMedia?.instagram || '' 
        },
        youtube: { 
          connected: !!userProfile.socialMedia?.youtube, 
          handle: userProfile.socialMedia?.youtube || '' 
        },
        twitter: { 
          connected: !!userProfile.socialMedia?.twitter, 
          handle: userProfile.socialMedia?.twitter || '' 
        },
        website: { 
          connected: !!userProfile.socialMedia?.website, 
          url: userProfile.socialMedia?.website || '' 
        }
      });
    }
  }, [userProfile]);

  // Social connections
  const [socialConnections, setSocialConnections] = useState({
    instagram: { 
      connected: !!userProfile?.socialMedia?.instagram, 
      handle: userProfile?.socialMedia?.instagram || '' 
    },
    youtube: { 
      connected: !!userProfile?.socialMedia?.youtube, 
      handle: userProfile?.socialMedia?.youtube || '' 
    },
    twitter: { 
      connected: !!userProfile?.socialMedia?.twitter, 
      handle: userProfile?.socialMedia?.twitter || '' 
    },
    website: { 
      connected: !!userProfile?.socialMedia?.website, 
      url: userProfile?.socialMedia?.website || '' 
    }
  });

  // Mock data for stats (will be replaced with real data later)
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

  // Mock competition history (will be replaced with real data later)
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
    }
  ];

  // Mock achievements (will be replaced with real data later)
  const achievements = [
    { id: 1, title: '1000 lb Club', description: 'First milestone', date: 'Mar 2023', icon: Trophy, color: 'yellow' },
    { id: 2, title: 'Competition Debut', description: 'First meet', date: 'Jun 2023', icon: Award, color: 'blue' }
  ];

  // Mock subscriptions (will be replaced with real data later)
  const subscriptions: any[] = [];

  // Handle profile update
  const handleProfileUpdate = async (data: any) => {
    if (!currentUser) return;
    
    setLoading(true);
    setSaveMessage('');
    
    try {
      // Prepare update data
      const updateData: any = {
        displayName: data.name || `${currentUser.displayName || ''}`,
        username: data.username,
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        weightClass: data.weightClass,
        division: data.division,
        federation: data.federation,
        coach: data.coach,
        gym: data.gym,
        gender: data.gender,
        emergencyContact: data.emergencyContact,
        coachPhone: data.coachPhone,
        coachPowerUpUsername: data.coachPowerUpUsername,
        teamName: data.teamName,
        teamPowerUpUsername: data.teamPowerUpUsername,
        // Also update firstName and lastName if using split name
        firstName: data.name ? data.name.split(' ')[0] : userProfile?.firstName,
        lastName: data.name ? data.name.split(' ').slice(1).join(' ') : userProfile?.lastName,
      };
      
      // Handle date of birth
      if (data.dateOfBirth) {
        updateData.dateOfBirth = new Date(data.dateOfBirth);
      }
      
      // Handle federation membership
      if (data.federationMembership) {
        updateData.federationMembership = {
          ...data.federationMembership,
          expirationDate: data.federationMembership.expirationDate ? 
            new Date(data.federationMembership.expirationDate) : undefined
        };
      }
      
      await updateUserProfile(currentUser.uid, updateData);
      
      // Refresh the profile from AuthContext
      await refreshProfile();
      
      setSaveMessage('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Handle notification update
  const handleNotificationUpdate = async (newNotifications: any) => {
    if (!currentUser) return;
    
    try {
      await updateUserProfile(currentUser.uid, { notifications: newNotifications });
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  // Handle privacy update
  const handlePrivacyUpdate = async (newPrivacy: any) => {
    if (!currentUser) return;
    
    try {
      await updateUserProfile(currentUser.uid, { privacy: newPrivacy });
      setPrivacy(newPrivacy);
    } catch (error) {
      console.error('Error updating privacy:', error);
    }
  };

  // Handle theme change
  const handleThemeChange = async (newTheme: string) => {
    if (!currentUser) return;
    
    try {
      await updateUserProfile(currentUser.uid, { theme: newTheme as 'light' | 'dark' });
      setTheme(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  // Handle social connection update
  const handleSocialUpdate = async (platform: string, handle: string, connected: boolean) => {
    if (!currentUser) return;
    
    try {
      const updatedSocialMedia = {
        ...userProfile?.socialMedia,
        [platform]: connected ? handle : undefined
      };
      
      await updateUserProfile(currentUser.uid, { socialMedia: updatedSocialMedia });
      
      setSocialConnections(prev => ({
        ...prev,
        [platform]: { connected, handle: connected ? handle : '' }
      }));
    } catch (error) {
      console.error('Error updating social media:', error);
    }
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
            onProfileUpdate={handleProfileUpdate}
            onNotificationUpdate={handleNotificationUpdate}
            onPrivacyUpdate={handlePrivacyUpdate}
            onThemeChange={handleThemeChange}
            onSocialUpdate={handleSocialUpdate}
            loading={loading}
            saveMessage={saveMessage}
          />
        );
      default:
        return <StatsTab personalStats={personalStats} />;
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <User className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-white">Profile</h1>
      </div>

      {/* Missing Fields Alert */}
      {missingFields.length > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-400 mb-1">Complete Your Profile for Meet Registration</h3>
              <p className="text-yellow-300 text-sm mb-2">
                You need to add the following information before you can register for meets:
              </p>
              <ul className="text-yellow-200 text-sm space-y-1">
                {missingFields.map((field, index) => (
                  <li key={index}>• {field}</li>
                ))}
              </ul>
              <button
                onClick={() => setActiveTab('settings')}
                className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

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
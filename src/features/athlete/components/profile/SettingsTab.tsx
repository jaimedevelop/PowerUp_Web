import React, { useState } from 'react';
import { 
  User, Bell, Shield, CreditCard, Share, Moon, Sun, 
  Mail, Phone, MapPin, Edit3, Save, X, Trash2, LogOut,
  Instagram, Youtube, Twitter, Globe, ExternalLink
} from 'lucide-react';

interface SettingsTabProps {
  profileData: any;
  notifications: any;
  privacy: any;
  theme: string;
  subscriptions: any[];
  socialConnections: any;
  onProfileUpdate: (data: any) => void;
  onNotificationUpdate: (notifications: any) => void;
  onPrivacyUpdate: (privacy: any) => void;
  onThemeChange: (theme: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profileData,
  notifications,
  privacy,
  theme,
  subscriptions,
  socialConnections,
  onProfileUpdate,
  onNotificationUpdate,
  onPrivacyUpdate,
  onThemeChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profileData);

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profileData);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </h3>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input 
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input 
                  type="text"
                  value={editedProfile.username}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white disabled:opacity-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea 
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white disabled:opacity-50 h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight Class</label>
                <select 
                  value={editedProfile.weightClass}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, weightClass: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white disabled:opacity-50"
                >
                  <option>59kg</option>
                  <option>66kg</option>
                  <option>74kg</option>
                  <option>83kg</option>
                  <option>93kg</option>
                  <option>105kg</option>
                  <option>120kg</option>
                  <option>120kg+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Federation</label>
                <select 
                  value={editedProfile.federation}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, federation: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white disabled:opacity-50"
                >
                  <option>USAPL</option>
                  <option>USPA</option>
                  <option>IPF</option>
                  <option>RPS</option>
                  <option>SPF</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-slate-400">Receive updates via email</p>
              </div>
              <button 
                onClick={() => onNotificationUpdate({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-slate-400">Mobile app notifications</p>
              </div>
              <button 
                onClick={() => onNotificationUpdate({ ...notifications, push: !notifications.push })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Workout Reminders</p>
                <p className="text-sm text-slate-400">Get reminded about scheduled workouts</p>
              </div>
              <button 
                onClick={() => onNotificationUpdate({ ...notifications, workoutReminders: !notifications.workoutReminders })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.workoutReminders ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.workoutReminders ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Coach Messages</p>
                <p className="text-sm text-slate-400">Messages from your coach</p>
              </div>
              <button 
                onClick={() => onNotificationUpdate({ ...notifications, coachMessages: !notifications.coachMessages })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.coachMessages ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.coachMessages ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Public Profile</p>
                <p className="text-sm text-slate-400">Allow others to view your profile</p>
              </div>
              <button 
                onClick={() => onPrivacyUpdate({ ...privacy, profilePublic: !privacy.profilePublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.profilePublic ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.profilePublic ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Public Stats</p>
                <p className="text-sm text-slate-400">Show your lifting stats publicly</p>
              </div>
              <button 
                onClick={() => onPrivacyUpdate({ ...privacy, statsPublic: !privacy.statsPublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.statsPublic ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.statsPublic ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Competition History</p>
                <p className="text-sm text-slate-400">Share your meet results</p>
              </div>
              <button 
                onClick={() => onPrivacyUpdate({ ...privacy, competitionHistory: !privacy.competitionHistory })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.competitionHistory ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.competitionHistory ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-blue-400 mr-3" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400 mr-3" />
              )}
              <div>
                <p className="font-medium text-white">Theme</p>
                <p className="text-sm text-slate-400">
                  {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Social Media Connections */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Share className="w-5 h-5 mr-2" />
            Social Media
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <Instagram className="w-5 h-5 text-pink-500 mr-3" />
                <div>
                  <p className="font-medium text-white">Instagram</p>
                  <p className="text-sm text-slate-400">
                    {socialConnections.instagram.connected ? socialConnections.instagram.handle : 'Not connected'}
                  </p>
                </div>
              </div>
              <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                socialConnections.instagram.connected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}>
                {socialConnections.instagram.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <Youtube className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <p className="font-medium text-white">YouTube</p>
                  <p className="text-sm text-slate-400">
                    {socialConnections.youtube.connected ? socialConnections.youtube.handle : 'Not connected'}
                  </p>
                </div>
              </div>
              <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                socialConnections.youtube.connected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}>
                {socialConnections.youtube.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <p className="font-medium text-white">Twitter</p>
                  <p className="text-sm text-slate-400">
                    {socialConnections.twitter.connected ? socialConnections.twitter.handle : 'Not connected'}
                  </p>
                </div>
              </div>
              <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                socialConnections.twitter.connected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}>
                {socialConnections.twitter.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Active Subscriptions
          </h3>
          
          <div className="space-y-3">
            {subscriptions.slice(0, 3).map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
                <div>
                  <p className="font-medium text-white">{subscription.name}</p>
                  <p className="text-sm text-slate-400">{subscription.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{subscription.price}</p>
                  <span className="inline-block bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-700/30 text-center">
            <p className="text-purple-300 font-medium">Monthly Total: $188.99</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 rounded-xl p-6 border border-red-700/30">
          <h3 className="text-xl font-semibold text-red-400 mb-6">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center p-3 border border-red-600 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors">
              <Trash2 className="w-5 h-5 mr-2" />
              <span className="font-medium">Delete Account</span>
            </button>
            <button className="w-full flex items-center justify-center p-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
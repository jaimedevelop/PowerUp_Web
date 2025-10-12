// src/admin/pages/SettingsPage.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { ProfileSettings } from './components/ProfileSettings';
import { IntegrationSettings } from './components/IntegrationSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { GeneralSettings } from './components/GeneralSettings';
import { UserManagement } from './components/UserManagement';
import { Card } from '../../../shared/ui/Card';

type SettingsTab = 'profile' | 'general' | 'integrations' | 'security' | 'users' | 'notifications';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('profile');

  const [notifications, setNotifications] = React.useState({
    emailRegistrations: true,
    emailPayments: true,
    emailMeetUpdates: false,
    pushNotifications: true,
    smsReminders: false,
    weeklyReports: true
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
        icon={Settings}
      />

      {/* Settings Navigation */}
      <Card>
        <div className="flex flex-wrap gap-1 p-1 bg-slate-900 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'integrations'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Notifications
          </button>
        </div>
      </Card>

      {/* Settings Content */}
      {activeTab === 'profile' && <ProfileSettings />}
      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'integrations' && <IntegrationSettings />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'notifications' && (
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-white mb-4">Email Notifications</h4>
              <div className="space-y-3">
                {[
                  {
                    key: 'emailRegistrations',
                    label: 'New registrations',
                    description: 'Get notified when athletes register for your meets'
                  },
                  {
                    key: 'emailPayments',
                    label: 'Payment confirmations',
                    description: 'Receive confirmation when payments are processed'
                  },
                  {
                    key: 'emailMeetUpdates',
                    label: 'Meet updates',
                    description: 'Automatic reminders about upcoming meet deadlines'
                  },
                  {
                    key: 'weeklyReports',
                    label: 'Weekly summary reports',
                    description: 'Weekly digest of your meet activities and stats'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-4 bg-slate-900 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">{item.label}</h5>
                      <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                      className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Mobile Notifications</h4>
              <div className="space-y-3">
                {[
                  {
                    key: 'pushNotifications',
                    label: 'Push notifications',
                    description: 'Receive notifications on your mobile device'
                  },
                  {
                    key: 'smsReminders',
                    label: 'SMS reminders',
                    description: 'Text message reminders for important events'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-4 bg-slate-900 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">{item.label}</h5>
                      <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                      className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Notification Timing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-lg">
                  <label className="block text-sm font-medium text-white mb-2">
                    Registration deadline reminders
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>7 days before</option>
                    <option>3 days before</option>
                    <option>1 day before</option>
                    <option>Never</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <label className="block text-sm font-medium text-white mb-2">
                    Payment due reminders
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Immediately</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
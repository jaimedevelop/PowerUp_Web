import React, { useState } from 'react';
import { Settings, Globe, Clock, DollarSign, Palette, Save } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';
import { Button } from '../../../../shared/ui/Button';

interface GeneralSettingsProps {}

export const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  const [settings, setSettings] = useState({
    siteName: 'PowerUp Powerlifting',
    siteUrl: 'https://powerup.powerlifting.com',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    weekStartsOn: 'sunday',
    registrationDeadline: 7,
    paymentGracePeriod: 3,
    theme: 'dark',
    primaryColor: '#8B5CF6',
    logoUrl: '',
    faviconUrl: '',
    enablePublicRegistration: true,
    enableWaitlist: true,
    enableRefunds: true,
    refundPolicy: '14 days before event',
    defaultFlightSize: 10,
    defaultPlatformType: 'single'
  });

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const themes = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'system', label: 'System Default' }
  ];

  const platformTypes = [
    { value: 'single', label: 'Single Platform' },
    { value: 'multi', label: 'Multi-Platform' }
  ];

  const handleSubmit = () => {
    console.log('Saving general settings:', settings);
    // In a real app, this would save to the backend
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Settings size={24} className="text-purple-400" />
          <h3 className="text-xl font-bold text-white">General Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Information */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-white mb-4">Site Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Site URL</label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div>
            <h4 className="font-medium text-white mb-4 flex items-center">
              <Globe size={18} className="mr-2" />
              Regional Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {dateFormats.map(format => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Week Starts On</label>
                <select
                  value={settings.weekStartsOn}
                  onChange={(e) => setSettings({...settings, weekStartsOn: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </div>
            </div>
          </div>

          {/* Meet Settings */}
          <div>
            <h4 className="font-medium text-white mb-4 flex items-center">
              <Clock size={18} className="mr-2" />
              Meet Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Registration Deadline (days before meet)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.registrationDeadline}
                  onChange={(e) => setSettings({...settings, registrationDeadline: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Payment Grace Period (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={settings.paymentGracePeriod}
                  onChange={(e) => setSettings({...settings, paymentGracePeriod: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Flight Size</label>
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={settings.defaultFlightSize}
                  onChange={(e) => setSettings({...settings, defaultFlightSize: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Platform Type</label>
                <select
                  value={settings.defaultPlatformType}
                  onChange={(e) => setSettings({...settings, defaultPlatformType: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {platformTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div>
            <h4 className="font-medium text-white mb-4 flex items-center">
              <DollarSign size={18} className="mr-2" />
              Financial Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Refund Policy</label>
                <input
                  type="text"
                  value={settings.refundPolicy}
                  onChange={(e) => setSettings({...settings, refundPolicy: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 14 days before event"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableRefunds"
                  checked={settings.enableRefunds}
                  onChange={(e) => setSettings({...settings, enableRefunds: e.target.checked})}
                  className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="enableRefunds" className="text-sm text-slate-300">
                  Enable refunds
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h4 className="font-medium text-white mb-4 flex items-center">
              <Palette size={18} className="mr-2" />
              Appearance Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {themes.map(theme => (
                    <option key={theme.value} value={theme.value}>{theme.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="w-10 h-10 border border-slate-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Favicon URL</label>
                <input
                  type="text"
                  value={settings.faviconUrl}
                  onChange={(e) => setSettings({...settings, faviconUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          {/* Registration Settings */}
          <div>
            <h4 className="font-medium text-white mb-4">Registration Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enablePublicRegistration"
                  checked={settings.enablePublicRegistration}
                  onChange={(e) => setSettings({...settings, enablePublicRegistration: e.target.checked})}
                  className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="enablePublicRegistration" className="text-sm text-slate-300">
                  Enable public registration
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableWaitlist"
                  checked={settings.enableWaitlist}
                  onChange={(e) => setSettings({...settings, enableWaitlist: e.target.checked})}
                  className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="enableWaitlist" className="text-sm text-slate-300">
                  Enable waitlist when full
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="flex items-center space-x-2" onClick={handleSubmit}>
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
// src/admin/components/settings/ProfileSettings.tsx
import React from 'react';
import { User, Camera, Save } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';
import { Button } from '../../../../shared/ui/Button';

export const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = React.useState({
    name: 'John Director',
    email: 'john@powerlift.com',
    phone: '+1 (555) 123-4567',
    organization: 'Florida Powerlifting Association',
    bio: 'Experienced meet director with 10+ years in powerlifting competition management.',
    certifications: ['USAPL Certified', 'IPF Category 1 Referee', 'CPR Certified'],
    location: 'Tampa, FL'
  });

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <User size={24} className="text-purple-400" />
        <h3 className="text-xl font-bold text-white">Profile Information</h3>
      </div>

      {/* Profile Photo */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <User size={32} className="text-white" />
        </div>
        <div>
          <h4 className="font-medium text-white mb-1">Profile Photo</h4>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Camera size={16} />
            <span>Change Photo</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Organization</label>
        <input
          type="text"
          value={profile.organization}
          onChange={(e) => setProfile({...profile, organization: e.target.value})}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Certifications</label>
        <div className="space-y-2">
          {profile.certifications.map((cert, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-900 rounded">
              <span className="text-white">{cert}</span>
              <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
            </div>
          ))}
          <button className="text-purple-400 hover:text-purple-300 text-sm">+ Add Certification</button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button className="flex items-center space-x-2">
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>
    </Card>
  );
};
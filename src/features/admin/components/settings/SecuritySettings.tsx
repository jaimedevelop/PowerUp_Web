// src/admin/components/settings/SecuritySettings.tsx
import React from 'react';
import { Shield, Key, Smartphone, Clock } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

export const SecuritySettings: React.FC = () => {
  const [twoFactor, setTwoFactor] = React.useState(false);
  
  const loginHistory = [
    { device: 'MacBook Pro (Current)', location: 'Tampa, FL', time: '2 hours ago', status: 'active' },
    { device: 'iPhone 15', location: 'Tampa, FL', time: '1 day ago', status: 'inactive' },
    { device: 'Windows PC', location: 'Orlando, FL', time: '3 days ago', status: 'inactive' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Shield size={24} className="text-purple-400" />
          <h3 className="text-xl font-bold text-white">Security Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Password Section */}
          <div>
            <h4 className="font-medium text-white mb-3">Password</h4>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <Key size={20} className="text-slate-400" />
                <div>
                  <span className="text-white">Password</span>
                  <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <h4 className="font-medium text-white mb-3">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone size={20} className="text-slate-400" />
                <div>
                  <span className="text-white">Two-Factor Authentication</span>
                  <p className="text-sm text-slate-400">
                    {twoFactor ? 'Enabled with authenticator app' : 'Add extra security to your account'}
                  </p>
                </div>
              </div>
              <Button 
                variant={twoFactor ? "outline" : "primary"} 
                size="sm"
                onClick={() => setTwoFactor(!twoFactor)}
              >
                {twoFactor ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Login History */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Clock size={24} className="text-purple-400" />
          <h3 className="text-xl font-bold text-white">Recent Login Activity</h3>
        </div>

        <div className="space-y-3">
          {loginHistory.map((login, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{login.device}</span>
                  {login.status === 'active' && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-400">
                  {login.location} • {login.time}
                </div>
              </div>
              {login.status === 'inactive' && (
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
// src/features/shared/auth/AdminSignup.tsx - FIXED
import React, { useState, useEffect } from 'react';

interface AdminSignupProps {
  onSignup: (data: AdminData) => void;
  onDataChange?: (data: AdminData) => void; // For parent to track form data
}

interface AdminData {
  organization: string;
  role: string;
  federations: string[];
}

const AdminSignup: React.FC<AdminSignupProps> = ({ onSignup, onDataChange }) => {
  const [formData, setFormData] = useState<AdminData>({
    organization: '',
    role: '',
    federations: []
  });

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      console.log('Admin data changed:', formData);
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Admin field changed:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFederationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log('Admin federation changed:', { value, checked });
    
    setFormData(prev => ({
      ...prev,
      federations: checked 
        ? [...prev.federations, value]
        : prev.federations.filter(fed => fed !== value)
    }));
  };

  // No form element - just the content
  return (
    <div className="space-y-6">
      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Admin Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">
              Organization/Federation
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              value={formData.organization}
              onChange={handleChange}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="USAPL Tampa, Local Powerlifting Club, etc."
              required
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
              Administrative Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              required
            >
              <option value="">Select role</option>
              <option value="meet-director">Meet Director</option>
              <option value="head-referee">Head Referee</option>
              <option value="referee">Referee</option>
              <option value="federation-admin">Federation Administrator</option>
              <option value="event-coordinator">Event Coordinator</option>
              <option value="technical-official">Technical Official</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-md font-medium text-white mb-3">Federation Affiliations</h4>
        <p className="text-sm text-slate-400 mb-3">Select all federations you're affiliated with:</p>
        
        <div className="grid grid-cols-2 gap-2">
          {['USAPL', 'USPA', 'IPF', 'CPU', 'SPF', 'IPA', 'WPC', 'Other'].map((federation) => (
            <div key={federation} className="flex items-center">
              <input
                id={`federation-${federation}`}
                type="checkbox"
                value={federation}
                checked={formData.federations.includes(federation)}
                onChange={handleFederationChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 rounded bg-slate-700"
              />
              <label htmlFor={`federation-${federation}`} className="ml-2 block text-sm text-slate-300">
                {federation}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-md font-medium text-white mb-3">Admin Permissions</h4>
        <div className="text-sm text-slate-400 space-y-1">
          <div>✓ Create and manage powerlifting meets</div>
          <div>✓ Handle athlete registrations and approvals</div>
          <div>✓ Access financial reports and analytics</div>
          <div>✓ Manage live meet operations</div>
          <div>✓ Post announcements and updates</div>
          <div>✓ Coordinate with officials and venues</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
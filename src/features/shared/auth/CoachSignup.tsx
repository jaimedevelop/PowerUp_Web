// src/features/shared/auth/CoachSignup.tsx - FIXED
import React, { useState, useEffect } from 'react';

interface CoachSignupProps {
  onSignup: (data: CoachData) => void;
  onDataChange?: (data: CoachData) => void; // For parent to track form data
}

interface CoachData {
  teamName: string;
  position: string;
  certification: {
    hasCertification: boolean;
    certificationNumber: string;
    expirationDate: string;
  };
}

const CoachSignup: React.FC<CoachSignupProps> = ({ onSignup, onDataChange }) => {
  const [formData, setFormData] = useState<CoachData>({
    teamName: '',
    position: '',
    certification: {
      hasCertification: false,
      certificationNumber: '',
      expirationDate: ''
    }
  });

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      console.log('Coach data changed:', formData);
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    console.log('Coach field changed:', { name, value, type, checked });
    
    if (name.startsWith('certification.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        certification: {
          ...prev.certification,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // No form element - just the content
  return (
    <div className="space-y-6">
      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Coach Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-slate-300 mb-2">
              Team/Organization Name
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="Team or organization name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-slate-300 mb-2">
              Coaching Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              required
            >
              <option value="">Select position</option>
              <option value="head-coach">Head Coach</option>
              <option value="assistant-coach">Assistant Coach</option>
              <option value="strength-coach">Strength & Conditioning Coach</option>
              <option value="events-coach">Events Coach</option>
              <option value="volunteer-coach">Volunteer Coach</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-md font-medium text-white mb-3">Certification Information</h4>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="certification.hasCertification"
              name="certification.hasCertification"
              type="checkbox"
              checked={formData.certification.hasCertification}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 rounded bg-slate-700"
            />
            <label htmlFor="certification.hasCertification" className="ml-2 block text-sm text-slate-300">
              I have a coaching certification
            </label>
          </div>
          
          {formData.certification.hasCertification && (
            <>
              <div>
                <label htmlFor="certification.certificationNumber" className="block text-sm font-medium text-slate-300 mb-2">
                  Certification Number
                </label>
                <input
                  id="certification.certificationNumber"
                  name="certification.certificationNumber"
                  type="text"
                  value={formData.certification.certificationNumber}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Certification number"
                />
              </div>
              
              <div>
                <label htmlFor="certification.expirationDate" className="block text-sm font-medium text-slate-300 mb-2">
                  Expiration Date
                </label>
                <input
                  id="certification.expirationDate"
                  name="certification.expirationDate"
                  type="date"
                  value={formData.certification.expirationDate}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-md font-medium text-white mb-3">Coach Benefits</h4>
        <div className="text-sm text-slate-400 space-y-1">
          <div>✓ Post training content and educational material</div>
          <div>✓ Build and manage your athlete roster</div>
          <div>✓ Create and share training programs</div>
          <div>✓ Access coaching analytics and progress tracking</div>
          <div>✓ Connect with other coaches and teams</div>
        </div>
      </div>
    </div>
  );
};

export default CoachSignup;
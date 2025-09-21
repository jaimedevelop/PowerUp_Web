// src/features/shared/auth/AthleteSignup.tsx
import React, { useState } from 'react';
import { User, Calendar, Phone, MapPin, UserPlus } from 'lucide-react';

interface AthleteSpecificData {
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  city: string;
  state: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface AthleteSignupProps {
  onSignup: (data: any) => void;
  onDataChange?: (data: AthleteSpecificData) => void;
}

const AthleteSignup: React.FC<AthleteSignupProps> = ({ onSignup, onDataChange }) => {
  const [formData, setFormData] = useState<AthleteSpecificData>({
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    city: '',
    state: '',
  });

  const [includeEmergencyContact, setIncludeEmergencyContact] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleInputChange = (field: keyof AthleteSpecificData, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedData);
    
    // Notify parent component of data changes
    if (onDataChange) {
      const dataToSend = {
        ...updatedData,
        emergencyContact: includeEmergencyContact ? emergencyContact : undefined,
      };
      onDataChange(dataToSend);
    }
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    const updatedEmergencyContact = {
      ...emergencyContact,
      [field]: value,
    };
    setEmergencyContact(updatedEmergencyContact);
    
    // Notify parent component of emergency contact changes
    if (onDataChange) {
      const dataToSend = {
        ...formData,
        emergencyContact: includeEmergencyContact ? updatedEmergencyContact : undefined,
      };
      onDataChange(dataToSend);
    }
  };

  const handleEmergencyContactToggle = (checked: boolean) => {
    setIncludeEmergencyContact(checked);
    
    // Notify parent component
    if (onDataChange) {
      const dataToSend = {
        ...formData,
        emergencyContact: checked ? emergencyContact : undefined,
      };
      onDataChange(dataToSend);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      formData.dateOfBirth,
      formData.phone,
      formData.city,
      formData.state,
    ];

    const basicValid = requiredFields.every(field => field.trim() !== '');

    if (includeEmergencyContact) {
      return basicValid && 
        emergencyContact.name.trim() !== '' &&
        emergencyContact.phone.trim() !== '' &&
        emergencyContact.relationship.trim() !== '';
    }

    return basicValid;
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <div>
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Personal Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date of Birth *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <div className="flex items-center mb-4">
          <Phone className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Contact Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              City *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your city"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              State *
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select state</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contact (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <UserPlus className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Emergency Contact (Optional)</h3>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeEmergencyContact}
              onChange={(e) => handleEmergencyContactToggle(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-slate-300">Add now</span>
          </label>
        </div>

        {!includeEmergencyContact ? (
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">
              You can add this information now or later. Emergency contact details are required when registering for competitions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Full name"
                required={includeEmergencyContact}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="(555) 123-4567"
                required={includeEmergencyContact}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Relationship *
              </label>
              <select
                value={emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required={includeEmergencyContact}
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Account Benefits */}
      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Athlete Account Benefits</h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p>✓ Browse and register for powerlifting competitions</p>
          <p>✓ Track your training progress and PRs</p>
          <p>✓ Connect with coaches and other athletes</p>
          <p>✓ Follow powerlifting news and achievements</p>
        </div>
      </div>

      {/* Form Validation Helper */}
      {!isFormValid() && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <p className="text-sm text-yellow-300">
            Please fill in all required athlete details to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default AthleteSignup;
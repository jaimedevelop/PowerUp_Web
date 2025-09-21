// src/features/athlete/components/compete/registrationSteps/EmergencyContactStep.tsx
import React from 'react';
import { Phone, Edit, User } from 'lucide-react';
import { RegistrationFormData } from '../../../../../services/athlete/registration';

interface EmergencyContactStepProps {
  formData: RegistrationFormData;
  userProfile: any; // User profile from AuthContext
  handleInputChange: (field: string, value: any, nested?: string) => void;
  emergencyContactEditing: boolean;
  setEmergencyContactEditing: (editing: boolean) => void;
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  formData,
  userProfile,
  handleInputChange,
  emergencyContactEditing,
  setEmergencyContactEditing,
}) => {
  const hasExistingContact = userProfile?.emergencyContact && 
    userProfile.emergencyContact.name && 
    userProfile.emergencyContact.phone;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Phone className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Emergency Contact</h3>
        <p className="text-slate-400">Required for safety during competition</p>
      </div>

      {/* Existing Emergency Contact Display */}
      {hasExistingContact && !emergencyContactEditing && (
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-white">Current Emergency Contact</h4>
            <button
              onClick={() => setEmergencyContactEditing(true)}
              className="flex items-center px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Name:</span>
              <div className="text-white font-medium">{formData.emergencyContact.name}</div>
            </div>
            <div>
              <span className="text-slate-400">Phone:</span>
              <div className="text-white font-medium">{formData.emergencyContact.phone}</div>
            </div>
            <div>
              <span className="text-slate-400">Relationship:</span>
              <div className="text-white font-medium capitalize">{formData.emergencyContact.relationship}</div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact Form (New or Editing) */}
      {(!hasExistingContact || emergencyContactEditing) && (
        <div className="space-y-4">
          {emergencyContactEditing && (
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-white">Update Emergency Contact</h4>
              <button
                onClick={() => setEmergencyContactEditing(false)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'emergencyContact')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Relationship *
              </label>
              <select
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value, 'emergencyContact')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="coach">Coach</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleInputChange('phone', e.target.value, 'emergencyContact')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          {emergencyContactEditing && (
            <div className="flex justify-end">
              <button
                onClick={() => setEmergencyContactEditing(false)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Information Notice */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <User className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">Emergency Contact Information</p>
            <p>
              {emergencyContactEditing || !hasExistingContact 
                ? "Any changes made here will be saved to your profile and used for future registrations."
                : "This information is saved in your profile. You can edit it if needed, and changes will apply to future registrations as well."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
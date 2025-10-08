// src/features/athlete/components/compete/registrationSteps/ReviewAgreementStep.tsx
import React from 'react';
import { Shield, AlertTriangle, User, Users, Phone, Trophy } from 'lucide-react';
import { RegistrationFormData } from '../../../../../../services/athlete/registration';
import { MeetData } from '../../../../../../firebase/database';

interface ReviewAgreementStepProps {
  formData: RegistrationFormData;
  meet: MeetData;
  userProfile: any;
  handleInputChange: (field: string, value: any, nested?: string) => void;
  calculateRegistrationFee: () => number;
}

export const ReviewAgreementStep: React.FC<ReviewAgreementStepProps> = ({
  formData,
  meet,
  userProfile,
  handleInputChange,
  calculateRegistrationFee,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Review & Agreement</h3>
        <p className="text-slate-400">Review your registration details and agree to terms</p>
      </div>

      {/* Registration Summary */}
      <div className="bg-slate-800 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold text-white mb-4">Registration Summary</h4>
        
        {/* Personal Information */}
        <div className="border-b border-slate-700 pb-4">
          <div className="flex items-center mb-3">
            <User className="w-4 h-4 text-purple-400 mr-2" />
            <h5 className="font-medium text-white">Personal Information</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Name:</span>
              <span className="ml-2 text-white font-medium">
                {userProfile?.firstName} {userProfile?.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Email:</span>
              <span className="ml-2 text-white font-medium">{userProfile?.email}</span>
            </div>
          </div>
        </div>

        {/* Federation Membership */}
        <div className="border-b border-slate-700 pb-4">
          <div className="flex items-center mb-3">
            <Shield className="w-4 h-4 text-purple-400 mr-2" />
            <h5 className="font-medium text-white">Federation Membership</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Federation:</span>
              <span className="ml-2 text-white font-medium">{formData.federationMembership.federation}</span>
            </div>
            <div>
              <span className="text-slate-400">Member ID:</span>
              <span className="ml-2 text-white font-medium">{formData.federationMembership.membershipNumber}</span>
            </div>
            <div>
              <span className="text-slate-400">Expires:</span>
              <span className="ml-2 text-white font-medium">
                {new Date(formData.federationMembership.expirationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Competition Details */}
        <div className="border-b border-slate-700 pb-4">
          <div className="flex items-center mb-3">
            <Trophy className="w-4 h-4 text-purple-400 mr-2" />
            <h5 className="font-medium text-white">Competition Details</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Weight Class:</span>
              <span className="ml-2 text-white font-medium">{formData.weightClass}</span>
            </div>
            <div>
              <span className="text-slate-400">Division:</span>
              <span className="ml-2 text-white font-medium">{formData.division}</span>
            </div>
            <div>
              <span className="text-slate-400">Equipment:</span>
              <span className="ml-2 text-white font-medium">{formData.equipment}</span>
            </div>
          </div>
        </div>

        {/* Coach/Team Information */}
        <div className="border-b border-slate-700 pb-4">
          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 text-purple-400 mr-2" />
            <h5 className="font-medium text-white">Coach & Team</h5>
          </div>
          {formData.hasCoach ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Coach:</span>
                <span className="ml-2 text-white font-medium">{formData.coachInfo?.coachName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400">Team:</span>
                <span className="ml-2 text-white font-medium">{formData.coachInfo?.teamName || 'Not specified'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Competing independently (no coach/team)</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="pb-4">
          <div className="flex items-center mb-3">
            <Phone className="w-4 h-4 text-purple-400 mr-2" />
            <h5 className="font-medium text-white">Emergency Contact</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Name:</span>
              <span className="ml-2 text-white font-medium">{formData.emergencyContact.name}</span>
            </div>
            <div>
              <span className="text-slate-400">Phone:</span>
              <span className="ml-2 text-white font-medium">{formData.emergencyContact.phone}</span>
            </div>
            <div>
              <span className="text-slate-400">Relationship:</span>
              <span className="ml-2 text-white font-medium capitalize">{formData.emergencyContact.relationship}</span>
            </div>
          </div>
        </div>

        {/* Registration Fee */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Registration Fee:</span>
            <span className="text-xl font-bold text-white">
              ${calculateRegistrationFee()}
            </span>
          </div>
          {meet.earlyBirdDeadline && new Date() < new Date(meet.earlyBirdDeadline) && (
            <div className="text-sm text-green-400 text-right">
              Early bird pricing applied!
            </div>
          )}
        </div>
      </div>

      {/* Agreement Checkboxes */}
      <div className="space-y-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreedToWaiver}
            onChange={(e) => handleInputChange('agreedToWaiver', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 mt-1"
            required
          />
          <span className="ml-3 text-sm text-slate-300">
            I agree to the <button type="button" className="text-purple-400 hover:text-purple-300 underline">liability waiver</button> and understand the risks associated with powerlifting competition.
          </span>
        </label>
        
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreedToRules}
            onChange={(e) => handleInputChange('agreedToRules', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 mt-1"
            required
          />
          <span className="ml-3 text-sm text-slate-300">
            I agree to abide by the <button type="button" className="text-purple-400 hover:text-purple-300 underline">competition rules</button> and {meet.federation} regulations.
          </span>
        </label>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">Next Step: Payment</p>
            <p>After agreeing to the terms, you'll proceed to secure payment processing to complete your registration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
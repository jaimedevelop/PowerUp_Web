// src/features/athlete/components/compete/registrationSteps/FederationMembershipStep.tsx
import React from 'react';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { RegistrationFormData } from '../../../../../../services/athlete/registration';

interface FederationMembershipStepProps {
  formData: RegistrationFormData;
  handleInputChange: (field: string, value: any, nested?: string) => void;
}

export const FederationMembershipStep: React.FC<FederationMembershipStepProps> = ({
  formData,
  handleInputChange,
}) => {
  const federations = ['USAPL', 'USPA', 'IPF', 'RPS', 'SPF', 'WRPF', 'CPU', 'Other'];

  const isExpired = () => {
    if (!formData.federationMembership.expirationDate) return false;
    const expirationDate = new Date(formData.federationMembership.expirationDate);
    const today = new Date();
    return expirationDate <= today;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Federation Membership</h3>
        <p className="text-slate-400">Valid federation membership is required to compete</p>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">Federation Membership Required</p>
            <p>You must have a valid, current federation membership to register for this competition. Registration cannot proceed without valid membership information.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Federation *
          </label>
          <select
            value={formData.federationMembership.federation}
            onChange={(e) => handleInputChange('federation', e.target.value, 'federationMembership')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select your federation</option>
            {federations.map(fed => (
              <option key={fed} value={fed}>{fed}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Membership Number *
          </label>
          <input
            type="text"
            value={formData.federationMembership.membershipNumber}
            onChange={(e) => handleInputChange('membershipNumber', e.target.value, 'federationMembership')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your membership number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Membership Expiration Date *
          </label>
          <input
            type="date"
            value={formData.federationMembership.expirationDate}
            onChange={(e) => handleInputChange('expirationDate', e.target.value, 'federationMembership')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          {isExpired() && (
            <p className="text-red-400 text-sm mt-1">
              ⚠️ This membership appears to be expired. You cannot register with an expired membership.
            </p>
          )}
        </div>
      </div>

      {/* Future API Integration Notice */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <p className="font-medium mb-1">Development Note</p>
            <p>Federation membership validation is currently manual. In future releases, membership will be automatically verified against federation databases.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
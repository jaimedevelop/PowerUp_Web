// src/features/athlete/components/compete/registrationSteps/CompetitionDetailsStep.tsx
import React from 'react';
import { Trophy } from 'lucide-react';
import { RegistrationFormData } from '../../../../../services/athlete/registration';
import { MeetData } from '../../../../../firebase/database';

interface CompetitionDetailsStepProps {
  formData: RegistrationFormData;
  meet: MeetData;
  handleInputChange: (field: string, value: any, nested?: string) => void;
}

export const CompetitionDetailsStep: React.FC<CompetitionDetailsStepProps> = ({
  formData,
  meet,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Trophy className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Competition Details</h3>
        <p className="text-slate-400">Select your competition category and equipment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Weight Class *
          </label>
          <select
            value={formData.weightClass}
            onChange={(e) => handleInputChange('weightClass', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select weight class</option>
            {meet.weightClasses.map((wc) => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Division *
          </label>
          <select
            value={formData.division}
            onChange={(e) => handleInputChange('division', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select division</option>
            {meet.divisions.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Equipment *
          </label>
          <select
            value={formData.equipment}
            onChange={(e) => handleInputChange('equipment', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select equipment</option>
            {meet.equipment.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Competition Information */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="font-medium text-white mb-3">Competition Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Federation:</span>
            <span className="ml-2 text-white font-medium">{meet.federation}</span>
          </div>
          <div>
            <span className="text-slate-400">Registration Fee:</span>
            <span className="ml-2 text-white font-medium">${meet.registrationFee}</span>
          </div>
          {meet.earlyBirdFee && meet.earlyBirdDeadline && (
            <>
              <div>
                <span className="text-slate-400">Early Bird Fee:</span>
                <span className="ml-2 text-green-400 font-medium">${meet.earlyBirdFee}</span>
              </div>
              <div>
                <span className="text-slate-400">Early Bird Deadline:</span>
                <span className="ml-2 text-white font-medium">
                  {new Date(meet.earlyBirdDeadline).toLocaleDateString()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weight Class Information */}
      {formData.weightClass && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <Trophy className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Weight Class: {formData.weightClass}</p>
              <p>You must make weight for this class at the official weigh-ins. Weigh-in details will be provided closer to the competition date.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
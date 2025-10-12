// src/features/athlete/components/compete/registrationSteps/CoachTeamInfoStep.tsx
import React from 'react';
import { Users, User } from 'lucide-react';
import { RegistrationFormData } from '../../../../../../services/athlete/registration';

interface CoachTeamInfoStepProps {
  formData: RegistrationFormData;
  handleInputChange: (field: string, value: any, nested?: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
}

export const CoachTeamInfoStep: React.FC<CoachTeamInfoStepProps> = ({
  formData,
  handleInputChange,
  setFormData,
}) => {
  const handleHasCoachChange = (hasCoach: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasCoach,
      coachInfo: hasCoach ? prev.coachInfo : {
        coachName: '',
        coachPhone: '',
        coachPowerUpUsername: '',
        teamName: '',
        teamPowerUpUsername: '',
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Coach & Team Information</h3>
        <p className="text-slate-400">Connect with your coaching support system</p>
      </div>

      {/* Has Coach Toggle */}
      <div className="bg-slate-800 rounded-lg p-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.hasCoach}
            onChange={(e) => handleHasCoachChange(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
          />
          <span className="ml-3 text-sm text-slate-300">
            I have a coach or am part of a team
          </span>
        </label>
        <p className="text-xs text-slate-400 mt-2 ml-7">
          Check this box if you work with a coach or are representing a team. Leave unchecked if you're competing independently.
        </p>
      </div>

      {/* Coach Information Section */}
      {formData.hasCoach && (
        <div className="space-y-6">
          {/* Coach Details */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-purple-400 mr-2" />
              <h4 className="font-medium text-white">Coach Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Coach Name *
                </label>
                <input
                  type="text"
                  value={formData.coachInfo?.coachName || ''}
                  onChange={(e) => handleInputChange('coachName', e.target.value, 'coachInfo')}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter coach's full name"
                  required={formData.hasCoach}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Coach Phone *
                </label>
                <input
                  type="tel"
                  value={formData.coachInfo?.coachPhone || ''}
                  onChange={(e) => handleInputChange('coachPhone', e.target.value, 'coachInfo')}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                  required={formData.hasCoach}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Coach PowerUp Username (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">@</span>
                  <input
                    type="text"
                    value={formData.coachInfo?.coachPowerUpUsername || ''}
                    onChange={(e) => handleInputChange('coachPowerUpUsername', e.target.value, 'coachInfo')}
                    className="w-full pl-8 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="coachusername"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  If your coach has a PowerUp account, enter their username to connect
                </p>
              </div>
            </div>
          </div>

          {/* Team Information */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-purple-400 mr-2" />
              <h4 className="font-medium text-white">Team Information (Optional)</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.coachInfo?.teamName || ''}
                  onChange={(e) => handleInputChange('teamName', e.target.value, 'coachInfo')}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team PowerUp Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">@</span>
                  <input
                    type="text"
                    value={formData.coachInfo?.teamPowerUpUsername || ''}
                    onChange={(e) => handleInputChange('teamPowerUpUsername', e.target.value, 'coachInfo')}
                    className="w-full pl-8 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="teamusername"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Official team PowerUp account username
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Coach Selected */}
      {!formData.hasCoach && (
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <User className="mx-auto h-8 w-8 text-slate-400 mb-3" />
          <h4 className="font-medium text-white mb-2">Competing Independently</h4>
          <p className="text-sm text-slate-400">
            You've indicated that you don't have a coach or aren't representing a team. 
            You can always update this information later in your profile.
          </p>
        </div>
      )}
    </div>
  );
};
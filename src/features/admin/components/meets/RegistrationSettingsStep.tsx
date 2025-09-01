// src/admin/components/meets/RegistrationSettingsStep.tsx
import React, { useEffect } from 'react';
import { DollarSign, Calendar, Users, Clock } from 'lucide-react';
import { StepComponentProps } from '../../../../types/admin/meet-types';

export const RegistrationSettingsStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
}) => {
  // Set default registration deadline to 1 month before competition date if not already set
  useEffect(() => {
    if (data.date && !data.registrationDeadline) {
      const competitionDate = new Date(data.date);
      const oneMonthBefore = new Date(competitionDate);
      oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
      
      // Format as YYYY-MM-DD for input[type="date"]
      const formattedDate = oneMonthBefore.toISOString().split('T')[0];
      updateData({ registrationDeadline: formattedDate });
    }
  }, [data.date, data.registrationDeadline, updateData]);

  const handleInputChange = (field: keyof typeof data, value: string | number) => {
    updateData({ [field]: value });
  };

  const isValid = () => {
    // Check if registration deadline is before competition date
    if (data.registrationDeadline && data.date) {
      const registrationDeadline = new Date(data.registrationDeadline);
      const competitionDate = new Date(data.date);
      
      if (registrationDeadline >= competitionDate) {
        return false;
      }
    }
    
    return (
      data.registrationDeadline &&
      data.registrationFee >= 0 &&
      data.maxParticipants > 0 &&
      (!data.earlyBirdDeadline || data.earlyBirdFee >= 0)
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Check if registration deadline is after competition date for error message
  const isRegistrationDeadlineInvalid = data.registrationDeadline && data.date && 
    new Date(data.registrationDeadline) >= new Date(data.date);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Registration Settings</h2>
        <p className="text-slate-400">
          Configure registration deadlines, fees, and participant limits.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Deadline */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Calendar size={16} className="inline mr-1" />
            Registration Deadline *
          </label>
          <input
            type="date"
            value={data.registrationDeadline}
            onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isRegistrationDeadlineInvalid ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          <p className="text-xs text-slate-400 mt-1">
            Last day athletes can register for the meet
          </p>
          {isRegistrationDeadlineInvalid && (
            <p className="text-xs text-red-400 mt-1">
              Registration deadline must be before the competition date
            </p>
          )}
          {data.date && !isRegistrationDeadlineInvalid && (
            <p className="text-xs text-green-400 mt-1">
              Automatically set to 1 month before competition
            </p>
          )}
        </div>
        {/* Max Participants */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Users size={16} className="inline mr-1" />
            Maximum Participants *
          </label>
          <input
            type="number"
            value={data.maxParticipants || ''}
            onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
            placeholder="150"
            min="1"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1">
            Total number of athletes that can register
          </p>
        </div>
        {/* Registration Fee */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <DollarSign size={16} className="inline mr-1" />
            Registration Fee *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={data.registrationFee || ''}
              onChange={(e) => handleInputChange('registrationFee', parseFloat(e.target.value) || 0)}
              placeholder="85.00"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard registration fee per athlete
          </p>
        </div>
        {/* Early Bird Deadline */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Clock size={16} className="inline mr-1" />
            Early Bird Deadline (Optional)
          </label>
          <input
            type="date"
            value={data.earlyBirdDeadline}
            onChange={(e) => handleInputChange('earlyBirdDeadline', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1">
            Deadline for discounted early registration
          </p>
        </div>
        {/* Early Bird Fee */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            <DollarSign size={16} className="inline mr-1" />
            Early Bird Fee (Optional)
          </label>
          <div className="relative max-w-md">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={data.earlyBirdFee || ''}
              onChange={(e) => handleInputChange('earlyBirdFee', parseFloat(e.target.value) || 0)}
              placeholder="75.00"
              min="0"
              step="0.01"
              disabled={!data.earlyBirdDeadline}
              className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discounted fee for early registration
          </p>
        </div>
      </div>
      {/* Additional Settings */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Additional Settings</h3>
        <div className="space-y-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-slate-300">Require coach approval for team registrations</span>
              <p className="text-xs text-slate-400 mt-1">
                Athletes registering as part of a team must be approved by their coach
              </p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-slate-300">Allow wait list when meet is full</span>
              <p className="text-xs text-slate-400 mt-1">
                Athletes can join a wait list if the meet reaches maximum capacity
              </p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-slate-300">Require membership verification</span>
              <p className="text-xs text-slate-400 mt-1">
                Athletes must provide valid federation membership before competing
              </p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-slate-300">Send confirmation emails</span>
              <p className="text-xs text-slate-400 mt-1">
                Automatically send registration confirmation and payment receipts
              </p>
            </div>
          </label>
        </div>
      </div>
  
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid()}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isValid()
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Review & Publish
        </button>
      </div>
    </div>
  );
};
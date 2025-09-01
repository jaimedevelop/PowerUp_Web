// src/features/shared/auth/AthleteSignup.tsx - FIXED
import React from 'react';

interface AthleteSignupProps {
  onSignup: (data: any) => void;
}

const AthleteSignup: React.FC<AthleteSignupProps> = ({ onSignup }) => {
  // No form element - just the content
  return (
    <div className="space-y-6">
      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Athlete Account</h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p>✓ Browse and register for powerlifting competitions</p>
          <p>✓ Track your training progress and PRs</p>
          <p>✓ Connect with coaches and other athletes</p>
          <p>✓ Follow powerlifting news and achievements</p>
        </div>
        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-300">
            <span className="font-medium">Note:</span> Additional details like weight, emergency contact, 
            and competition history will be collected when you register for your first meet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AthleteSignup;
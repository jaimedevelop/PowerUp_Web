// src/features/shared/auth/emails/EmailVerificationSuccess.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, User } from 'lucide-react';

const EmailVerificationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 border border-slate-700 text-center">
        
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Success message */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified Successfully! 🎉</h1>
          <p className="text-slate-400">
            Your account is now active and ready to use.
          </p>
        </div>

        {/* Success details */}
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-green-400 font-medium text-sm mb-1">Account Activated</p>
              <p className="text-slate-300 text-sm">
                You can now log in and start using all PowerUp features.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
          <h3 className="text-white font-medium text-sm mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            What's Next?
          </h3>
          <ul className="text-left text-slate-300 text-sm space-y-2 list-disc list-inside">
            <li>Log in with your email and password</li>
            <li>Complete your profile setup</li>
            <li>Start exploring powerlifting meets</li>
            <li>Connect with coaches and athletes</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center group"
          >
            Login to Your Account
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            to="/"
            className="block w-full text-center text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            ← Back to home page
          </Link>
        </div>

        {/* Welcome message */}
        <div className="text-xs text-slate-500 space-y-1 pt-4 border-t border-slate-700">
          <p>
            🎊 Welcome to the PowerUp community!
          </p>
          <p>
            We're excited to help you on your powerlifting journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
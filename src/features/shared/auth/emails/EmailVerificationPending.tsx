// src/features/shared/auth/emails/EmailVerificationPending.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

interface LocationState {
  email: string;
  userType: string;
  userName: string;
  emailError?: boolean;
}

const EmailVerificationPending: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  // Fallback if no state is passed
  const email = state?.email || 'your email';
  const userType = state?.userType || 'account';
  const userName = state?.userName || '';
  const emailError = state?.emailError || false;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 border border-slate-700 text-center">
        
        {/* Email sent successfully */}
        {!emailError ? (
          <>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Check Your Email!</h1>
              <p className="text-slate-400 text-sm">
                We've sent a verification link to
              </p>
              <p className="text-purple-400 font-medium text-sm mt-1">
                {email}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-green-400 font-medium text-sm mb-1">Account Created Successfully!</p>
                  <p className="text-slate-300 text-sm">
                    Your {userType} account has been created. Click the verification link in your email to activate it.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
              <p>
                <strong className="text-white">Next steps:</strong>
              </p>
              <ol className="text-left space-y-2 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the "Confirm Your Account" button in the email</li>
                <li>Return here to log in with your credentials</li>
              </ol>
            </div>
          </>
        ) : (
          /* Email sending failed */
          <>
            <div className="flex justify-center">
              <div className="bg-yellow-600 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
              <p className="text-slate-400 text-sm mb-4">
                Your {userType} account was successfully created, but we had trouble sending the verification email.
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-yellow-400 font-medium text-sm mb-1">Verification Email Failed</p>
                  <p className="text-slate-300 text-sm">
                    Don't worry! Your account exists. Please contact support to verify your email address.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
              <p>
                <strong className="text-white">What to do:</strong>
              </p>
              <ul className="text-left space-y-2 list-disc list-inside">
                <li>Contact support at <span className="text-purple-400">support@powerlift.com</span></li>
                <li>Include your email: <span className="text-purple-400">{email}</span></li>
                <li>We'll manually verify your account</li>
              </ul>
            </div>
          </>
        )}

        {/* Divider */}
        <div className="border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-500 mb-4">
            Didn't receive the email? Check your spam folder or wait a few minutes.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {!emailError && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
          )}

          <Link
            to="/login"
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 text-center"
          >
            Go to Login
          </Link>

          <Link
            to="/"
            className="block w-full text-center text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            ← Back to home page
          </Link>
        </div>

        {/* Help text */}
        <div className="text-xs text-slate-500 space-y-2">
          <p>
            The verification link will expire in 24 hours.
          </p>
          {userName && (
            <p>
              Welcome to PowerUp, {userName}! We're excited to have you join our community.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPending;
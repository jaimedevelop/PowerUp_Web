// src/features/shared/auth/emails/EmailVerificationError.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, AlertTriangle, Mail, RefreshCw } from 'lucide-react';

interface LocationState {
  errorMessage?: string;
}

const EmailVerificationError: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const errorMessage = state?.errorMessage || 'The verification link is invalid or has expired.';

  const getErrorType = (message: string): 'expired' | 'used' | 'invalid' | 'error' => {
    if (message.toLowerCase().includes('expired')) return 'expired';
    if (message.toLowerCase().includes('used')) return 'used';
    if (message.toLowerCase().includes('invalid')) return 'invalid';
    return 'error';
  };

  const errorType = getErrorType(errorMessage);

  const getErrorIcon = () => {
    switch (errorType) {
      case 'expired':
        return <AlertTriangle className="w-8 h-8 text-white" />;
      case 'used':
        return <RefreshCw className="w-8 h-8 text-white" />;
      case 'invalid':
        return <XCircle className="w-8 h-8 text-white" />;
      default:
        return <XCircle className="w-8 h-8 text-white" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'expired':
        return 'Verification Link Expired';
      case 'used':
        return 'Link Already Used';
      case 'invalid':
        return 'Invalid Verification Link';
      default:
        return 'Verification Failed';
    }
  };

  const getSolutions = () => {
    switch (errorType) {
      case 'expired':
        return [
          'Request a new verification email from the signup page',
          'Check that you\'re using the most recent email we sent',
          'Contact support if you continue having issues',
        ];
      case 'used':
        return [
          'Try logging in - your account may already be verified',
          'If login fails, request a new verification email',
          'Contact support if you need assistance',
        ];
      case 'invalid':
        return [
          'Make sure you copied the complete link from your email',
          'Try clicking the link directly instead of copying',
          'Request a new verification email if needed',
        ];
      default:
        return [
          'Try the verification process again',
          'Contact our support team for assistance',
          'Make sure your internet connection is stable',
        ];
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 border border-slate-700 text-center">
        
        {/* Error icon */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 rounded-full">
            {getErrorIcon()}
          </div>
        </div>

        {/* Error message */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{getErrorTitle()}</h1>
          <p className="text-slate-400">
            {errorMessage}
          </p>
        </div>

        {/* Error details */}
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-red-400 font-medium text-sm mb-1">Verification Unsuccessful</p>
              <p className="text-slate-300 text-sm">
                We couldn't verify your email address with this link.
              </p>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
          <h3 className="text-white font-medium text-sm mb-3 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            What You Can Do:
          </h3>
          <ul className="text-left text-slate-300 text-sm space-y-2">
            {getSolutions().map((solution, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-400 mr-2 flex-shrink-0">•</span>
                <span>{solution}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          {errorType === 'used' ? (
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Try Logging In
            </Link>
          ) : (
            <Link
              to="/create-account/athlete"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Create New Account
            </Link>
          )}

          <Link
            to="/login"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
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

        {/* Help section */}
        <div className="text-xs text-slate-500 space-y-2 pt-4 border-t border-slate-700">
          <p>
            <strong className="text-slate-400">Need help?</strong>
          </p>
          <p>
            Contact support at <span className="text-purple-400">support@powerlift.com</span>
          </p>
          <p>
            Include this error message and any steps you've already tried.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationError;
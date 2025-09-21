// src/features/shared/auth/emails/EmailVerification.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailToken, EmailVerificationResult } from '../../../../services/shared/auth';
import { Loader2 } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [result, setResult] = useState<EmailVerificationResult | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setResult({
          success: false,
          message: 'No verification token provided.'
        });
        setIsVerifying(false);
        return;
      }

      try {
        console.log('Verifying email token:', token);
        const verificationResult = await verifyEmailToken(token);
        console.log('Verification result:', verificationResult);
        setResult(verificationResult);
      } catch (error) {
        console.error('Error during email verification:', error);
        setResult({
          success: false,
          message: 'An unexpected error occurred during verification.'
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    // Redirect after a delay based on the result
    if (!isVerifying && result) {
      const redirectTimer = setTimeout(() => {
        if (result.success) {
          navigate('/email-verification-success');
        } else {
          navigate('/email-verification-error', { 
            state: { errorMessage: result.message } 
          });
        }
      }, 2000); // Wait 2 seconds to show the result

      return () => clearTimeout(redirectTimer);
    }
  }, [isVerifying, result, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 border border-slate-700 text-center">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Verifying Your Email</h1>
            <p className="text-slate-400">
              Please wait while we verify your email address...
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              This should only take a moment. Please don't close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 border border-slate-700 text-center">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full ${
            result?.success 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
              : 'bg-gradient-to-r from-red-600 to-rose-600'
          }`}>
            {result?.success ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {result?.success ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          <p className="text-slate-400">
            {result?.message || 'Processing verification...'}
          </p>
        </div>

        <div className={`border rounded-lg p-4 ${
          result?.success 
            ? 'bg-green-900/20 border-green-600' 
            : 'bg-red-900/20 border-red-600'
        }`}>
          <p className={`text-sm font-medium ${
            result?.success ? 'text-green-400' : 'text-red-400'
          }`}>
            {result?.success 
              ? 'Redirecting to success page...' 
              : 'Redirecting to error page...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
// src/features/shared/auth/CreateAccountPage.tsx - FIXED
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  createAthleteAccount, 
  createCoachAccount, 
  createAdminAccount,
  AthleteSignupData,
  CoachSignupData,
  AdminSignupData
} from '../../../services/shared/auth';
import AthleteSignup from './AthleteSignup';
import CoachSignup from './CoachSignup';
import AdminSignup from './AdminSignup';

const CreateAccountPage: React.FC = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Role-specific data
  const [coachData, setCoachData] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);

  console.log('CreateAccountPage render:', { 
    userType, 
    firstName, 
    lastName, 
    email, 
    coachData, 
    adminData 
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted for userType:', userType);
    
    // Validate common fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (userType === 'athlete') {
        console.log('Creating athlete account...');
        const signupData: AthleteSignupData = {
          firstName,
          lastName,
          email,
          password
        };
        console.log('Athlete signup data:', signupData);
        
        const result = await createAthleteAccount(signupData);
        console.log('Athlete account created:', result);
        navigate('/feed');
        
      } else if (userType === 'coach') {
        console.log('Creating coach account with data:', coachData);
        
        if (!coachData?.teamName || !coachData?.position) {
          setError('Please fill in all coach information');
          return;
        }
        
        const signupData: CoachSignupData = {
          firstName,
          lastName,
          email,
          password,
          teamName: coachData.teamName,
          position: coachData.position,
          certification: coachData.certification
        };
        console.log('Coach signup data:', signupData);
        
        const result = await createCoachAccount(signupData);
        console.log('Coach account created:', result);
        navigate('/admin/director/dashboard');
        
      } else if (userType === 'admin') {
        console.log('Creating admin account with data:', adminData);
        
        if (!adminData?.organization || !adminData?.role) {
          setError('Please fill in all admin information');
          return;
        }
        
        const signupData: AdminSignupData = {
          firstName,
          lastName,
          email,
          password,
          organization: adminData.organization,
          role: adminData.role,
          federations: adminData.federations || []
        };
        console.log('Admin signup data:', signupData);
        
        const result = await createAdminAccount(signupData);
        console.log('Admin account created:', result);
        navigate('/admin/director/dashboard');
      }
      
    } catch (err) {
      console.error('Account creation error:', err);
      setError(err instanceof Error ? err.message : 'Account creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountTypeTitle = () => {
    switch (userType) {
      case 'athlete':
        return 'Athlete Account';
      case 'coach':
        return 'Coach Account';
      case 'admin':
        return 'Admin Account';
      default:
        return 'Account';
    }
  };

  const handleCoachDataChange = (data: any) => {
    console.log('Coach data updated:', data);
    setCoachData(data);
  };

  const handleAdminDataChange = (data: any) => {
    console.log('Admin data updated:', data);
    setAdminData(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create {getAccountTypeTitle()}</h1>
          <p className="text-slate-400">Fill in the details below to get started</p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {/* SINGLE form element for the entire page */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => {
                  console.log('First name changed:', e.target.value);
                  setFirstName(e.target.value);
                }}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="John"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => {
                  console.log('Last name changed:', e.target.value);
                  setLastName(e.target.value);
                }}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                console.log('Email changed:', e.target.value);
                setEmail(e.target.value);
              }}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="••••••••"
              required
            />
          </div>
          
          {/* Role-specific components - NO forms inside these */}
          {userType === 'athlete' && (
            <AthleteSignup onSignup={() => {}} />
          )}
          
          {userType === 'coach' && (
            <CoachSignup onSignup={() => {}} onDataChange={handleCoachDataChange} />
          )}
          
          {userType === 'admin' && (
            <AdminSignup onSignup={() => {}} onDataChange={handleAdminDataChange} />
          )}
          
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 rounded bg-slate-700"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-300">
              I agree to the{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                `Create ${getAccountTypeTitle()}`
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-400">
            ← Back to landing page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
# Authentication System Implementation Details

## 1. Landing Page Implementation

```typescript
// src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, User, Users, Settings, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Dumbbell className="text-purple-500 mr-3" size={48} />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            PowerUp Powerlifting
          </h1>
        </div>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          The complete powerlifting meet management system for athletes, coaches, and meet directors.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/login" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            <User className="mr-2" size={20} />
            Login
          </Link>
          
          <Link 
            to="/register" 
            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center border border-slate-700"
          >
            Create Account
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <User className="text-purple-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">For Athletes</h3>
          <p className="text-slate-400 mb-4">Register for meets, track your progress, and view your results.</p>
          <Link to="/register/athlete" className="text-purple-400 hover:text-purple-300 font-medium flex items-center">
            Register as Athlete <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">For Coaches</h3>
          <p className="text-slate-400 mb-4">Manage your athletes, track their progress, and handle registrations.</p>
          <Link to="/register/coach" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
            Register as Coach <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <Settings className="text-green-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">For Meet Directors</h3>
          <p className="text-slate-400 mb-4">Organize meets, manage registrations, and run events smoothly.</p>
          <Link to="/register/admin" className="text-green-400 hover:text-green-300 font-medium flex items-center">
            Register as Director <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
```

## 2. Login Page Implementation

```typescript
// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Dumbbell } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would verify credentials and set user state
      // For now, we'll just redirect to the dashboard
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="text-purple-500 mr-2" size={36} />
            <h2 className="text-3xl font-bold">Welcome Back</h2>
          </div>
          <p className="text-slate-400">Sign in to your PowerUp account</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-slate-500" size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-slate-500" size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="text-slate-500" size={18} /> : <Eye className="text-slate-500" size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 3. Registration Pages Implementation

### Athlete Registration

```typescript
// src/pages/AthleteRegistrationPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Scale, MapPin, Phone, ArrowLeft, Dumbbell } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const AthleteRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    weightClass: '',
    division: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

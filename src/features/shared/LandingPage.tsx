// src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Trophy, Users, Calendar } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PowerUp</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-8 border border-slate-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">PowerUp</h1>
            <p className="text-slate-400">Your complete PowerUping management platform</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white text-center">Get Started</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  to="/create-account/athlete" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 text-center"
                >
                  Join as Athlete
                </Link>
                <Link 
                  to="/create-account/coach" 
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 text-center"
                >
                  Join as Coach
                </Link>
                <Link 
                  to="/create-account/admin" 
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 text-center"
                >
                  Join as Meet Director
                </Link>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-3">Already have an account?</p>
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 font-medium text-sm"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-4">
            Join thousands of PowerUpers managing their training and competitions
          </p>
          <div className="flex items-center justify-center space-x-8 text-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm">Athletes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm">Coaches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm">Meets</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
          © 2025 PowerUp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
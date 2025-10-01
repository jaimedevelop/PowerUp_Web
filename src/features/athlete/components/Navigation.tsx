import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Trophy, Dumbbell, Users, User, LogOut } from 'lucide-react';
import { tw } from '../../../styles/theme';

export type TabType = 'feed' | 'compete' | 'train' | 'connect' | 'profile';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { path: '/', id: 'feed' as TabType, label: 'Feed', icon: Home },
  { path: '/compete', id: 'compete' as TabType, label: 'Compete', icon: Trophy },
  { path: '/train', id: 'train' as TabType, label: 'Train', icon: Dumbbell },
  { path: '/connect', id: 'connect' as TabType, label: 'Connect', icon: Users },
  { path: '/profile', id: 'profile' as TabType, label: 'Profile', icon: User },
];

// Sidebar for desktop and tablet
const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--glass-bg)] border-r border-[var(--glass-border)] z-40 lg:w-64 md:w-16 hidden md:block">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-white md:hidden lg:block">PowerUp</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium md:hidden lg:block">{label}</span>
          </NavLink>
        ))}
        
        {/* Sign Out Button */}
        <div className="pt-4 border-t border-slate-700">
          <NavLink
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium md:hidden lg:block">Sign Out</span>
          </NavLink>
        </div>
      </nav>
      
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 md:hidden lg:block">
          <p>© 2025 PowerUp</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

// Bottom navigation for mobile
const BottomNav: React.FC = () => {
  const location = useLocation();
  
  // Get current tab from URL
  const getCurrentTab = (): TabType => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.id : 'feed';
  };
  
  const activeTab = getCurrentTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--glass-border)] px-4 py-2 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map(({ path, id, label, icon: IconComponent }) => {
          const isActive = activeTab === id;
          
          return (
            <NavLink
              key={id}
              to={path}
              className={({ isActive: routeActive }) => {
                const active = isActive || routeActive;
                return `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                  active 
                    ? 'text-purple-600 bg-purple-50 scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`;
              }}
            >
              <div className="relative">
                <IconComponent 
                  size={24} 
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} 
                />
              </div>
              <span 
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

// Main navigation component that renders appropriate navigation based on screen size
export const Navigation: React.FC = () => {
  return (
    <>
      <Sidebar />
      <BottomNav />
    </>
  );
};

// Layout wrapper component that includes the navigation and main content area
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={tw.pageBackground}>
      <Navigation />
      
      {/* Main content area */}
      <main className="md:ml-16 lg:ml-64 pb-20 md:pb-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// Mobile app download prompt for small screens
export const MobileAppPrompt: React.FC = () => {
  return (
    <div className="block md:hidden min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">PowerUp</h1>
        
        <p className="text-gray-600 mb-6">
          For the best experience, download our mobile app or use PowerUp on your desktop.
        </p>
        
        <div className="space-y-3">
          <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Download for iOS
          </button>
          <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Download for Android
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Or continue in browser on desktop
          </p>
        </div>
      </div>
    </div>
  );
};
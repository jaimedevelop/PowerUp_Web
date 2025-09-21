import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  Radio, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Settings,
  Dumbbell,
  ArrowLeft
} from 'lucide-react';

const navItems = [
  { path: '/admin/director/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/director/meets', label: 'Meets', icon: Trophy },
  { path: '/admin/director/live', label: 'Live Meet', icon: Radio },
  { path: '/admin/director/finances', label: 'Finances', icon: DollarSign },
  { path: '/admin/director/communications', label: 'Communications', icon: MessageSquare },
  { path: '/admin/director/reports', label: 'Reports', icon: FileText },
  { path: '/admin/director/settings', label: 'Settings', icon: Settings },
];

// Sidebar for desktop and tablet
const AdminSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700 z-40 lg:w-64 md:w-16 hidden md:block">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-white md:hidden lg:block">PowerUp Admin</span>
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
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium md:hidden lg:block">Sign Out</span>
          </NavLink>
        </div>
      </nav>
      
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 md:hidden lg:block">
          <p>Meet Director Panel</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

// Bottom navigation for mobile
const AdminBottomNav: React.FC = () => {
  const location = useLocation();
  
  // Get current active item from URL
  const getCurrentActiveItem = () => {
    return navItems.find(item => location.pathname.startsWith(item.path));
  };
  
  const activeItem = getCurrentActiveItem();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-4 py-2 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.slice(0, 5).map(({ path, label, icon: IconComponent }) => {
          const isActive = activeItem?.path === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive: routeActive }) => {
                const active = isActive || routeActive;
                return `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                  active 
                    ? 'text-purple-400 bg-slate-800 scale-105' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`;
              }}
            >
              <div className="relative">
                <IconComponent 
                  size={20} 
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} 
                />
              </div>
              <span 
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? 'text-purple-400' : 'text-slate-400'
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

// Main admin navigation component
export const AdminNavigation: React.FC = () => {
  return (
    <>
      <AdminSidebar />
      <AdminBottomNav />
    </>
  );
};

// Admin Layout wrapper
interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <AdminNavigation />
      
      {/* Main content area */}
      <main className="md:ml-16 lg:ml-64 pb-20 md:pb-0">
        <div className="p-6 md:p-8 pt-6 md:pt-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
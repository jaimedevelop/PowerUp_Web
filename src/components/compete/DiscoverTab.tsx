import React from 'react';
import { CompetitionFinder } from './CompetitionFinder';
import { Star, TrendingUp, MapPin } from 'lucide-react';

export const DiscoverTab: React.FC = () => {
  const featuredCompetitions = [
    {
      id: 1,
      name: 'Florida State Championships',
      federation: 'USAPL',
      date: 'May 18-19, 2025',
      location: 'Tampa, FL',
      status: 'Featured',
      description: 'The premier powerlifting event in Florida',
      image: 'bg-gradient-to-r from-blue-600 to-purple-600'
    },
    {
      id: 2,
      name: 'Iron Wars Competition',
      federation: 'USPA',
      date: 'April 5, 2025',
      location: 'Orlando, FL',
      status: 'Popular',
      description: 'High-energy competition with live streaming',
      image: 'bg-gradient-to-r from-red-600 to-orange-600'
    }
  ];

  const popularCategories = [
    { name: 'Local Tampa Meets', count: 12, icon: MapPin },
    { name: 'USAPL Sanctioned', count: 8, icon: Star },
    { name: 'Beginner Friendly', count: 6, icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Featured Competitions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Featured Competitions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredCompetitions.map((comp) => (
            <div key={comp.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group hover:border-slate-600 transition-colors">
              <div className={`h-32 ${comp.image} relative`}>
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {comp.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {comp.federation}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-white mb-2">{comp.name}</h4>
                <p className="text-sm text-slate-400 mb-3">{comp.description}</p>
                <div className="flex items-center justify-between text-sm text-slate-300 mb-4">
                  <span>{comp.date}</span>
                  <span>{comp.location}</span>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Popular Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {popularCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <button
                key={index}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-left hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-200 group"
              >
                <div className="flex items-center mb-3">
                  <IconComponent className="w-5 h-5 text-purple-400 mr-3 group-hover:text-purple-300" />
                  <span className="font-medium text-white">{category.name}</span>
                </div>
                <p className="text-2xl font-bold text-purple-400 mb-1">{category.count}</p>
                <p className="text-sm text-slate-400">competitions available</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Competition Finder */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Find Competitions</h3>
        <CompetitionFinder />
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { MeetRegistration } from './MeetRegistration';
import { Clock, MapPin, Eye, Bookmark } from 'lucide-react';

export const RegisterTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('nearby');

  const categories = [
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'viewed', label: 'Recently Viewed', icon: Eye },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'upcoming', label: 'Upcoming', icon: Clock }
  ];

  const quickSelectMeets = [
    {
      id: 1,
      name: 'Spring Classic 2025',
      federation: 'USAPL',
      date: 'March 15, 2025',
      location: 'Iron Palace Gym, Austin TX',
      distance: '2.3 miles',
      registrationStatus: 'Open',
      spotsLeft: 45,
      category: 'nearby'
    },
    {
      id: 2,
      name: 'Florida State Championships',
      federation: 'USAPL',
      date: 'May 18-19, 2025',
      location: 'Tampa Convention Center, Tampa FL',
      distance: '0.8 miles',
      registrationStatus: 'Early Bird',
      spotsLeft: 78,
      category: 'nearby'
    },
    {
      id: 3,
      name: 'Texas State Championships',
      federation: 'USPA',
      date: 'April 22, 2025',
      location: 'MetroFlex Gym, Dallas TX',
      distance: '289 miles',
      registrationStatus: 'Open',
      spotsLeft: 23,
      category: 'viewed'
    }
  ];

  const filteredMeets = quickSelectMeets.filter(meet => 
    selectedCategory === 'nearby' ? meet.category === 'nearby' :
    selectedCategory === 'viewed' ? meet.category === 'viewed' :
    selectedCategory === 'upcoming' ? true :
    selectedCategory === 'saved' ? false : // No saved meets for demo
    true
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Quick Selection */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Quick Select Competition</h3>
          
          {/* Category Tabs */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Competition List */}
          <div className="space-y-4">
            {filteredMeets.length > 0 ? (
              filteredMeets.map((meet) => (
                <div key={meet.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{meet.name}</h4>
                      <p className="text-sm text-slate-400">{meet.federation} • {meet.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        meet.registrationStatus === 'Open' ? 'text-green-400' :
                        meet.registrationStatus === 'Early Bird' ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {meet.registrationStatus}
                      </span>
                      <p className="text-xs text-slate-400">{meet.spotsLeft} spots left</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                      <span>{meet.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-slate-400 mr-2" />
                      <span>{meet.distance}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    Select & Register
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  {categories.find(c => c.id === selectedCategory)?.icon && 
                    React.createElement(categories.find(c => c.id === selectedCategory)!.icon, { 
                      className: "w-6 h-6 text-slate-400" 
                    })
                  }
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">No competitions found</h4>
                <p className="text-slate-400 mb-4">
                  {selectedCategory === 'saved' && "You haven't saved any competitions yet"}
                  {selectedCategory === 'viewed' && "Browse competitions to see them here"}
                  {selectedCategory === 'nearby' && "No competitions found in your area"}
                  {selectedCategory === 'upcoming' && "No upcoming competitions available"}
                </p>
                <button 
                  onClick={() => setSelectedCategory('nearby')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Browse All Competitions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Meet Registration</h3>
        <MeetRegistration />
      </div>
    </div>
  );
};
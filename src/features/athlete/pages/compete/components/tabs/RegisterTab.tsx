import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetRegistration } from '../MeetRegistration';
import { Clock, MapPin, Eye, Bookmark } from 'lucide-react';
import { tw, getButtonClass } from '../../../../styles/theme';

export const RegisterTab: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('nearby');

  const categories = [
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'viewed', label: 'Recently Viewed', icon: Eye },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
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
      category: 'nearby',
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
      category: 'nearby',
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
      category: 'viewed',
    },
  ];

  const filteredMeets = quickSelectMeets.filter((meet) =>
    selectedCategory === 'nearby'
      ? meet.category === 'nearby'
      : selectedCategory === 'viewed'
      ? meet.category === 'viewed'
      : selectedCategory === 'upcoming'
      ? true
      : selectedCategory === 'saved'
      ? false // No saved meets for demo
      : true
  );

  const statusColor = (status: string) => {
    if (status === 'Open') return 'text-[var(--action-green-to)]';
    if (status === 'Early Bird') return 'text-[var(--action-yellow-to)]';
    return 'text-[color:var(--text-primary)]';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Quick Selection */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-[color:var(--text-primary)] mb-6">Quick Select Competition</h3>

          {/* Category Tabs */}
          <div className={`flex ${tw.glassCard} p-1 ${tw.glassCardHover} border-[color:var(--glass-border)] rounded-lg mb-6`}>
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
                      ? 'bg-[var(--glass-bg-hover)] text-[color:var(--text-primary)]'
                      : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--glass-bg)]'}
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
                <div key={meet.id} className={`${tw.glassCard} ${tw.glassCardHover} p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[color:var(--text-primary)]">{meet.name}</h4>
                      <p className="text-sm text-[color:var(--text-secondary)]">{meet.federation} • {meet.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${statusColor(meet.registrationStatus)}`}>
                        {meet.registrationStatus}
                      </span>
                      <p className="text-xs text-[color:var(--text-tertiary)]">{meet.spotsLeft} spots left</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-[color:var(--text-secondary)] mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-[color:var(--text-tertiary)] mr-2" />
                      <span>{meet.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-[color:var(--text-tertiary)] mr-2" />
                      <span>{meet.distance}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/compete/meet/${meet.id}`)}
                    className={`w-full ${getButtonClass('yellow')}`}
                  >
                    Select & Register
                  </button>
                </div>
              ))
            ) : (
              <div className={`${tw.glassCard} p-8 text-center`}>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {categories.find((c) => c.id === selectedCategory)?.icon &&
                    React.createElement(
                      categories.find((c) => c.id === selectedCategory)!.icon,
                      {
                        className: 'w-6 h-6 text-[color:var(--text-secondary)]',
                      }
                    )}
                </div>
                <h4 className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">No competitions found</h4>
                <p className="text-[color:var(--text-secondary)] mb-4">
                  {selectedCategory === 'saved' && "You haven't saved any competitions yet"}
                  {selectedCategory === 'viewed' && 'Browse competitions to see them here'}
                  {selectedCategory === 'nearby' && 'No competitions found in your area'}
                  {selectedCategory === 'upcoming' && 'No upcoming competitions available'}
                </p>
                <button
                  onClick={() => setSelectedCategory('nearby')}
                  className={getButtonClass('yellow')}
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
        <h3 className="text-xl font-semibold text-[color:var(--text-primary)] mb-6">Meet Registration</h3>
        <MeetRegistration />
      </div>
    </div>
  );
};
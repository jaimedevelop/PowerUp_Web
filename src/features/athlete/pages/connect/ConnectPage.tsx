import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { ProfileGrid } from './components/ProfileGrid';
import { ProfileFilters } from './components/ProfileFilters';
import { SuggestedConnections } from './components/SuggestedConnections';
import { CoachingPayments } from './components/CoachingPayments';
import { MarketplaceTeaser } from './components/MarketplaceTeaser';

type ProfileType = 'all' | 'athlete' | 'coach' | 'brand' | 'team';

export const ConnectPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ProfileType>('all');
  const [followedProfiles, setFollowedProfiles] = useState<string[]>([
    'sarah-coach', 'westside-team', 'juggernaut-brand'
  ]);

  const toggleFollow = (profileId: string) => {
    setFollowedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const profiles = [
    {
      id: 'sarah-coach',
      type: 'coach' as const,
      name: 'Sarah Johnson',
      handle: '@coach_sarah',
      avatar: 'bg-gradient-to-r from-purple-500 to-pink-500',
      verified: true,
      location: 'Austin, TX',
      followers: '12.5K',
      following: '892',
      bio: 'USAPL Coach | 15+ years experience | Specializing in raw powerlifting',
      stats: {
        athletes: 45,
        totalLifted: '2.1M lbs',
        meetWins: 127,
        experience: '15 years'
      },
      pricing: {
        monthly: 150,
        quarterly: 400,
        yearly: 1400
      },
      achievements: ['USAPL Level 2 Coach', 'IPF Technical Official', '500+ Athletes Coached']
    },
    {
      id: 'mike-athlete',
      type: 'athlete' as const,
      name: 'Mike Rodriguez',
      handle: '@mike_lifts_heavy',
      avatar: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      verified: false,
      location: 'Denver, CO',
      followers: '3.2K',
      following: '456',
      bio: '83kg Open | 1247 total | Chasing that 1300 dream',
      stats: {
        total: '1,247 lbs',
        squat: 425,
        bench: 275,
        deadlift: 547,
        meets: 12,
        prs: 8
      },
      achievements: ['1000 lb Club', 'State Record Holder', 'Regional Champion']
    },
    {
      id: 'westside-team',
      type: 'team' as const,
      name: 'Westside Barbell',
      handle: '@westside_barbell',
      avatar: 'bg-gradient-to-r from-red-500 to-orange-500',
      verified: true,
      location: 'Columbus, OH',
      followers: '89.2K',
      following: '234',
      bio: 'Home of the Conjugate Method | Developing champions since 1986',
      stats: {
        members: 25,
        worldRecords: 140,
        eliteLifters: 18,
        founded: '1986'
      },
      achievements: ['140+ World Records', 'Conjugate Method Creators', 'Elite Training Facility']
    },
    {
      id: 'juggernaut-brand',
      type: 'brand' as const,
      name: 'Juggernaut Training Systems',
      handle: '@juggernaut_training',
      avatar: 'bg-gradient-to-r from-green-500 to-teal-500',
      verified: true,
      location: 'Laguna Hills, CA',
      followers: '156K',
      following: '1.2K',
      bio: 'Evidence-based training | World-class coaching | Proven results',
      stats: {
        athletes: 500,
        programs: 25,
        coaches: 12,
        founded: '2009'
      },
      achievements: ['500+ Elite Athletes', 'Scientific Research', 'World Champions']
    },
    {
      id: 'alex-athlete',
      type: 'athlete' as const,
      name: 'Alex Thompson',
      handle: '@alex_powerlifts',
      avatar: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      verified: false,
      location: 'Seattle, WA',
      followers: '1.8K',
      following: '324',
      bio: '74kg Junior | Rising star in powerlifting | Training for nationals',
      stats: {
        total: '1,089 lbs',
        squat: 375,
        bench: 242,
        deadlift: 472,
        meets: 6,
        prs: 12
      },
      achievements: ['Junior National Qualifier', 'State Champion', 'Rising Star Award']
    },
    {
      id: 'iron-temple',
      type: 'team' as const,
      name: 'Iron Temple',
      handle: '@iron_temple_gym',
      avatar: 'bg-gradient-to-r from-gray-600 to-gray-800',
      verified: true,
      location: 'Phoenix, AZ',
      followers: '15.3K',
      following: '567',
      bio: 'Elite powerlifting gym | Home to multiple world record holders',
      stats: {
        members: 45,
        worldRecords: 23,
        eliteLifters: 12,
        founded: '2015'
      },
      achievements: ['23 World Records', 'Elite Training Facility', 'Championship Team']
    },
    {
      id: 'coach-martinez',
      type: 'coach' as const,
      name: 'Carlos Martinez',
      handle: '@coach_carlos',
      avatar: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      verified: true,
      location: 'Miami, FL',
      followers: '8.7K',
      following: '445',
      bio: 'IPF Coach | Specializing in equipped lifting | 20+ years experience',
      stats: {
        athletes: 32,
        totalLifted: '1.8M lbs',
        meetWins: 89,
        experience: '20 years'
      },
      pricing: {
        monthly: 175,
        quarterly: 450,
        yearly: 1600
      },
      achievements: ['IPF Level 3 Coach', 'World Championship Coach', 'Technical Official']
    },
    {
      id: 'strength-co',
      type: 'brand' as const,
      name: 'Strength Co.',
      handle: '@strength_company',
      avatar: 'bg-gradient-to-r from-emerald-500 to-green-600',
      verified: true,
      location: 'Austin, TX',
      followers: '45.2K',
      following: '892',
      bio: 'Premium powerlifting equipment | Trusted by champions worldwide',
      stats: {
        athletes: 200,
        programs: 15,
        coaches: 8,
        founded: '2018'
      },
      achievements: ['Premium Equipment', 'Champion Endorsed', 'Quality Guarantee']
    }
  ];

  const filteredProfiles = profiles.filter(profile => {
    const matchesFilter = activeFilter === 'all' || profile.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleViewProfile = (profile: any) => {
    // Handle profile view - could navigate to detailed profile page
    console.log('View profile:', profile);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Users className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">Connect</h1>
      </div>

      {/* Top Section - Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
            placeholder="Search athletes, coaches, teams, brands..."
          />
        </div>

        {/* Profile Type Filters */}
        <ProfileFilters 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - Profile Grid (3/4 width) */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {activeFilter === 'all' ? 'All Profiles' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}s`}
              </h2>
              <span className="text-sm text-slate-400">
                {filteredProfiles.length} result{filteredProfiles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <ProfileGrid 
            profiles={filteredProfiles}
            followedProfiles={followedProfiles}
            onToggleFollow={toggleFollow}
            onViewProfile={handleViewProfile}
          />

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No profiles found</h3>
              <p className="text-slate-400">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try adjusting your search or filters.`
                  : `No ${activeFilter} profiles available right now.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar (1/4 width) */}
        <div className="space-y-6">
          <SuggestedConnections 
            followedProfiles={followedProfiles}
            onToggleFollow={toggleFollow}
          />
          
          <CoachingPayments />
          
          <MarketplaceTeaser />
        </div>
      </div>
    </div>
  );
};
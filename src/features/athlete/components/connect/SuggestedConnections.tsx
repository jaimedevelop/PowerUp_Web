import React from 'react';
import { Users, Star, UserPlus, UserMinus } from 'lucide-react';

interface SuggestedConnection {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  followers: string;
  description: string;
  mutualConnections?: number;
}

interface SuggestedConnectionsProps {
  followedProfiles: string[];
  onToggleFollow: (profileId: string) => void;
}

export const SuggestedConnections: React.FC<SuggestedConnectionsProps> = ({
  followedProfiles,
  onToggleFollow
}) => {
  const suggestions: SuggestedConnection[] = [
    {
      id: 'powerlifting-usa',
      name: 'Powerlifting USA',
      handle: '@powerlifting_usa',
      avatar: 'bg-gradient-to-r from-red-600 to-blue-600',
      verified: true,
      followers: '125K',
      description: 'Official magazine of powerlifting',
      mutualConnections: 12
    },
    {
      id: 'calgary-barbell',
      name: 'Calgary Barbell',
      handle: '@calgary_barbell',
      avatar: 'bg-gradient-to-r from-orange-500 to-red-500',
      verified: true,
      followers: '89K',
      description: 'Coaching and education',
      mutualConnections: 8
    },
    {
      id: 'sheiko-programs',
      name: 'Sheiko Programs',
      handle: '@sheiko_programs',
      avatar: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      verified: true,
      followers: '67K',
      description: 'Russian powerlifting methodology',
      mutualConnections: 5
    },
    {
      id: 'atg-strength',
      name: 'ATG Strength',
      handle: '@atg_strength',
      avatar: 'bg-gradient-to-r from-green-500 to-teal-500',
      verified: false,
      followers: '34K',
      description: 'Mobility and strength training',
      mutualConnections: 3
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Suggested Connections</h3>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          See All
        </button>
      </div>
      
      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const isFollowing = followedProfiles.includes(suggestion.id);
          
          return (
            <div key={suggestion.id} className="flex items-start justify-between">
              <div className="flex items-start flex-1 min-w-0">
                <div className={`w-10 h-10 ${suggestion.avatar} rounded-full mr-3 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-semibold text-sm">
                    {suggestion.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-white truncate">{suggestion.name}</h4>
                    {suggestion.verified && (
                      <Star className="w-4 h-4 text-blue-400 ml-1 flex-shrink-0 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{suggestion.handle}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{suggestion.description}</p>
                  <div className="flex items-center text-xs text-slate-400 mt-1">
                    <span>{suggestion.followers} followers</span>
                    {suggestion.mutualConnections && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{suggestion.mutualConnections} mutual</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onToggleFollow(suggestion.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ml-3 ${
                  isFollowing
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-3 h-3 mr-1 inline" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-1 inline" />
                    Follow
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
import React from 'react';
import { Star, UserPlus, UserMinus } from 'lucide-react';

interface SuggestedFollowsProps {
  followedAccounts: string[];
  onToggleFollow: (accountId: string) => void;
}

export const SuggestedFollows: React.FC<SuggestedFollowsProps> = ({ followedAccounts, onToggleFollow }) => {
  const suggestedFollows = [
    {
      id: 'powerlifting-usa',
      name: 'Powerlifting USA',
      handle: '@powerlifting_usa',
      avatar: 'bg-gradient-to-r from-red-600 to-blue-600',
      verified: true,
      followers: '125K',
      description: 'Official magazine of powerlifting'
    },
    {
      id: 'calgary-barbell',
      name: 'Calgary Barbell',
      handle: '@calgary_barbell',
      avatar: 'bg-gradient-to-r from-orange-500 to-red-500',
      verified: true,
      followers: '89K',
      description: 'Coaching and education'
    },
    {
      id: 'sheiko-programs',
      name: 'Sheiko Programs',
      handle: '@sheiko_programs',
      avatar: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      verified: true,
      followers: '67K',
      description: 'Russian powerlifting methodology'
    },
    {
      id: 'atg-strength',
      name: 'ATG Strength',
      handle: '@atg_strength',
      avatar: 'bg-gradient-to-r from-green-500 to-teal-500',
      verified: false,
      followers: '34K',
      description: 'Mobility and strength training'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Suggested Follows</h3>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          See All
        </button>
      </div>
      <div className="space-y-4">
        {suggestedFollows.map((account) => {
          const isFollowing = followedAccounts.includes(account.id);
          
          return (
            <div key={account.id} className="flex items-start justify-between">
              <div className="flex items-start">
                <div className={`w-10 h-10 ${account.avatar} rounded-full mr-3 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-semibold text-sm">
                    {account.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-white truncate">{account.name}</h4>
                    {account.verified && (
                      <Star className="w-4 h-4 text-blue-400 ml-1 flex-shrink-0 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{account.handle}</p>
                  <p className="text-xs text-slate-500 mt-1">{account.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{account.followers} followers</p>
                </div>
              </div>
              <button 
                onClick={() => onToggleFollow(account.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ml-3 ${
                  isFollowing
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
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
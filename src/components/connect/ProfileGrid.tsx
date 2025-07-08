import React from 'react';
import { Star, MapPin, UserPlus, UserMinus, MessageCircle, Trophy, Award } from 'lucide-react';

interface Profile {
  id: string;
  type: 'athlete' | 'coach' | 'brand' | 'team';
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  location: string;
  followers: string;
  following: string;
  bio: string;
  stats?: any;
  pricing?: any;
  achievements?: string[];
}

interface ProfileGridProps {
  profiles: Profile[];
  followedProfiles: string[];
  onToggleFollow: (profileId: string) => void;
  onViewProfile: (profile: Profile) => void;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({
  profiles,
  followedProfiles,
  onToggleFollow,
  onViewProfile
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <div key={profile.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-16 h-16 ${profile.avatar} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">
                {profile.name.charAt(0)}
              </span>
            </div>
            <button 
              onClick={() => onToggleFollow(profile.id)}
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                followedProfiles.includes(profile.id)
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {followedProfiles.includes(profile.id) ? (
                <>
                  <UserMinus className="w-4 h-4 mr-1" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Follow
                </>
              )}
            </button>
          </div>

          {/* Profile Info */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <h3 className="font-semibold text-white truncate">{profile.name}</h3>
              {profile.verified && (
                <Star className="w-4 h-4 text-blue-400 ml-1 flex-shrink-0 fill-current" />
              )}
            </div>
            <p className="text-sm text-slate-400 mb-2">{profile.handle}</p>
            <div className="flex items-center text-sm text-slate-500 mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
            <p className="text-sm text-slate-300 line-clamp-2">{profile.bio}</p>
          </div>

          {/* Type-specific Stats */}
          {profile.type === 'athlete' && profile.stats && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                <p className="text-sm font-semibold text-white">{profile.stats.total}</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
              <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                <p className="text-sm font-semibold text-white">{profile.stats.meets}</p>
                <p className="text-xs text-slate-400">Meets</p>
              </div>
            </div>
          )}

          {profile.type === 'coach' && profile.pricing && (
            <div className="mb-4">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-purple-700/30">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-300">${profile.pricing.monthly}</p>
                  <p className="text-xs text-purple-400">per month</p>
                </div>
              </div>
            </div>
          )}

          {profile.type === 'team' && profile.stats && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                <p className="text-sm font-semibold text-white">{profile.stats.members}</p>
                <p className="text-xs text-slate-400">Members</p>
              </div>
              <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                <p className="text-sm font-semibold text-white">{profile.stats.worldRecords}</p>
                <p className="text-xs text-slate-400">Records</p>
              </div>
            </div>
          )}

          {/* Achievements Preview */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center p-2 bg-yellow-900/20 rounded border border-yellow-700/30">
                <Trophy className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                <span className="text-xs text-yellow-300 truncate">
                  {profile.achievements[0]}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-400">
              <span>{profile.followers} followers</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                <MessageCircle className="w-4 h-4 text-slate-400" />
              </button>
              <button 
                onClick={() => onViewProfile(profile)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
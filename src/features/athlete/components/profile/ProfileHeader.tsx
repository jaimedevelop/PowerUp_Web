import React from 'react';
import { Camera, MapPin, Edit3, Trophy, Calendar, TrendingUp, Dumbbell } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: {
    name: string;
    username: string;
    bio: string;
    location: string;
    weightClass: string;
    division: string;
    federation: string;
    coach: string;
    gym: string;
  };
  personalStats: {
    currentTotal: string;
    wilks: number;
    prCount: number;
    workoutsThisMonth: number;
  };
  competitionCount: number;
  onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  personalStats,
  competitionCount,
  onEdit
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
      <div className="flex items-start justify-between">
        {/* Profile Info */}
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {profileData.name.charAt(0)}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 bg-slate-700 rounded-full p-2 shadow-lg border border-slate-600 hover:bg-slate-600 transition-colors">
              <Camera className="w-4 h-4 text-slate-300" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
              <button 
                onClick={onEdit}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Edit3 className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-400 mb-2">{profileData.username}</p>
            <p className="text-slate-200 mb-3 max-w-md">{profileData.bio}</p>
            <div className="flex items-center text-slate-400 mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{profileData.location}</span>
            </div>
            
            {/* Profile Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Weight Class:</span>
                <span className="text-white ml-2">{profileData.weightClass} {profileData.division}</span>
              </div>
              <div>
                <span className="text-slate-400">Federation:</span>
                <span className="text-white ml-2">{profileData.federation}</span>
              </div>
              <div>
                <span className="text-slate-400">Coach:</span>
                <span className="text-white ml-2">{profileData.coach}</span>
              </div>
              <div>
                <span className="text-slate-400">Gym:</span>
                <span className="text-white ml-2">{profileData.gym}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 min-w-[300px]">
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">Current Total</span>
            </div>
            <p className="text-2xl font-bold text-white">{personalStats.currentTotal}</p>
            <p className="text-xs text-slate-400">Wilks: {personalStats.wilks}</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">Competitions</span>
            </div>
            <p className="text-2xl font-bold text-white">{competitionCount}</p>
            <p className="text-xs text-slate-400">lifetime meets</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">PRs</span>
            </div>
            <p className="text-2xl font-bold text-white">{personalStats.prCount}</p>
            <p className="text-xs text-slate-400">personal records</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center mb-2">
              <Dumbbell className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">This Month</span>
            </div>
            <p className="text-2xl font-bold text-white">{personalStats.workoutsThisMonth}</p>
            <p className="text-xs text-slate-400">workouts</p>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Trophy,
  Calendar,
  Bell,
  Star,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  Bookmark,
  Flag,
  Clock,
  MapPin,
  Play,
  Image
} from 'lucide-react';

interface PostCardProps {
  post: any;
  followedAccounts: string[];
  onToggleFollow: (accountId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, followedAccounts, onToggleFollow }) => {
  const isFollowing = followedAccounts.includes(post.author.handle.replace('@', ''));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${post.author.avatar} rounded-full mr-3 flex items-center justify-center`}>
            <span className="text-white font-semibold text-lg">
              {post.author.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="font-semibold text-white">{post.author.name}</h4>
              {post.author.verified && (
                <Star className="w-4 h-4 text-blue-400 ml-1 fill-current" />
              )}
            </div>
            <div className="flex items-center text-sm text-slate-400">
              <span>{post.author.handle}</span>
              <span className="mx-2">•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onToggleFollow(post.author.handle.replace('@', ''))}
            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
              isFollowing
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isFollowing ? (
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
          <button className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-slate-200 mb-4 leading-relaxed">{post.content}</p>

      {/* Special Content Based on Type */}
      {post.type === 'achievement' && post.achievement && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 mb-4 border border-yellow-700/30">
          <div className="flex items-center mb-3">
            <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
            <h5 className="font-semibold text-yellow-300">{post.achievement.title}</h5>
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <p className="font-bold text-white">{post.achievement.total}</p>
              <p className="text-slate-400">Total</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-red-400">{post.achievement.breakdown.squat}</p>
              <p className="text-slate-400">Squat</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-blue-400">{post.achievement.breakdown.bench}</p>
              <p className="text-slate-400">Bench</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-400">{post.achievement.breakdown.deadlift}</p>
              <p className="text-slate-400">Deadlift</p>
            </div>
          </div>
        </div>
      )}

      {post.type === 'competition' && post.competition && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 mb-4 border border-blue-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-400 mr-2" />
              <h5 className="font-semibold text-blue-300">{post.competition.name}</h5>
            </div>
            <span className="text-sm bg-green-900/50 text-green-300 px-2 py-1 rounded-full border border-green-700/30">
              {post.competition.spotsLeft} spots left
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="flex items-center text-slate-300">
              <Clock className="w-4 h-4 text-slate-400 mr-1" />
              <span>{post.competition.date}</span>
            </div>
            <div className="flex items-center text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 mr-1" />
              <span>{post.competition.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-green-400 font-semibold">{post.competition.earlyPrice}</span>
              <span className="text-slate-400 ml-1">early bird</span>
              <span className="text-slate-500 mx-2">•</span>
              <span className="text-slate-300">{post.competition.regularPrice} regular</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Register Now
            </button>
          </div>
        </div>
      )}

      {post.type === 'announcement' && post.announcement && (
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-4 mb-4 border border-orange-700/30">
          <div className="flex items-center mb-3">
            <Bell className="w-6 h-6 text-orange-400 mr-2" />
            <h5 className="font-semibold text-orange-300">{post.announcement.title}</h5>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="flex items-center text-slate-300">
              <Clock className="w-4 h-4 text-slate-400 mr-1" />
              <span>{post.announcement.date}</span>
            </div>
            <div className="flex items-center text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 mr-1" />
              <span>{post.announcement.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-orange-400">{post.announcement.price}</span>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      )}

      {/* Media */}
      {post.media && (
        <div className="bg-slate-700 rounded-lg h-48 mb-4 flex items-center justify-center">
          {post.media.type === 'video' ? (
            <div className="text-center text-slate-400">
              <Play className="w-12 h-12 mx-auto mb-2" />
              <p>Video content</p>
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <Image className="w-12 h-12 mx-auto mb-2" />
              <p>Image content</p>
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-green-400 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-full transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-full transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
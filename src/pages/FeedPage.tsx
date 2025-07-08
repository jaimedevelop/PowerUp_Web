import React, { useState } from 'react';
import { Search, Home } from 'lucide-react';
import { PostCard } from '../components/feed/PostCard';
import { FilterTabs } from '../components/feed/FilterTabs';
import { SuggestedFollows } from '../components/feed/SuggestedFollows';
import { RecentActivity } from '../components/feed/RecentActivity';

type FilterType = 'all' | 'following' | 'competitions' | 'achievements' | 'announcements';

export const FeedPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedAccounts, setFollowedAccounts] = useState<string[]>([
    'westside-barbell', 'juggernaut-training', 'coach-sarah'
  ]);

  const toggleFollow = (accountId: string) => {
    setFollowedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const posts = [
    {
      id: 1,
      type: 'achievement',
      author: {
        name: 'Mike Johnson',
        handle: '@mikej_powerlifter',
        avatar: 'bg-gradient-to-r from-purple-500 to-blue-500',
        verified: false
      },
      timestamp: '2 hours ago',
      content: 'Just hit my first 1000lb total! 🎉 365 squat, 275 bench, 405 deadlift. Years of training finally paid off!',
      achievement: {
        title: '1000 lb Club',
        total: '1,045 lbs',
        breakdown: { squat: 365, bench: 275, deadlift: 405 }
      },
      likes: 127,
      comments: 23,
      shares: 8,
      media: null
    },
    {
      id: 2,
      type: 'announcement',
      author: {
        name: 'Westside Barbell',
        handle: '@westside_barbell',
        avatar: 'bg-gradient-to-r from-red-500 to-orange-500',
        verified: true
      },
      timestamp: '4 hours ago',
      content: 'New conjugate method seminar announced! Join us March 15-16 for an intensive weekend covering dynamic effort, max effort, and repetition methods.',
      announcement: {
        title: 'Conjugate Method Seminar',
        date: 'March 15-16, 2025',
        location: 'Columbus, OH',
        price: '$299'
      },
      likes: 89,
      comments: 15,
      shares: 34,
      media: { type: 'image', url: null }
    },
    {
      id: 3,
      type: 'competition',
      author: {
        name: 'USAPL Texas',
        handle: '@usapl_texas',
        avatar: 'bg-gradient-to-r from-blue-600 to-purple-600',
        verified: true
      },
      timestamp: '6 hours ago',
      content: 'Registration is now OPEN for the Texas State Championships! Early bird pricing ends February 1st.',
      competition: {
        name: 'Texas State Championships',
        date: 'April 12-13, 2025',
        location: 'Austin, TX',
        earlyPrice: '$85',
        regularPrice: '$100',
        spotsLeft: 45
      },
      likes: 156,
      comments: 31,
      shares: 67,
      media: null
    },
    {
      id: 4,
      type: 'post',
      author: {
        name: 'Juggernaut Training',
        handle: '@juggernaut_training',
        avatar: 'bg-gradient-to-r from-green-500 to-teal-500',
        verified: true
      },
      timestamp: '8 hours ago',
      content: 'Technique Tuesday: The importance of bracing in the squat. Proper intra-abdominal pressure can add 20-50lbs to your max instantly.',
      likes: 203,
      comments: 45,
      shares: 78,
      media: { type: 'video', url: null }
    },
    {
      id: 5,
      type: 'achievement',
      author: {
        name: 'Sarah Chen',
        handle: '@sarahlifts',
        avatar: 'bg-gradient-to-r from-pink-500 to-rose-500',
        verified: false
      },
      timestamp: '12 hours ago',
      content: 'First powerlifting meet in the books! Went 8/9 and hit a 15lb PR on deadlift. Already planning the next one 💪',
      achievement: {
        title: 'First Meet Complete',
        total: '892 lbs',
        breakdown: { squat: 275, bench: 165, deadlift: 315 }
      },
      likes: 94,
      comments: 18,
      shares: 5,
      media: { type: 'image', url: null }
    }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'following') return followedAccounts.includes(post.author.handle.replace('@', ''));
    if (activeFilter === 'competitions') return post.type === 'competition';
    if (activeFilter === 'achievements') return post.type === 'achievement';
    if (activeFilter === 'announcements') return post.type === 'announcement';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Home className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-white">Feed</h1>
      </div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Feed (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="Search posts, people, competitions..."
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard 
                  key={post.id}
                  post={post}
                  followedAccounts={followedAccounts}
                  onToggleFollow={toggleFollow}
                />
              ))
            ) : (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
                <Home className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No posts found</h3>
                <p className="text-slate-400 mb-4">
                  {activeFilter === 'following' 
                    ? "Follow some accounts to see their posts here"
                    : `No ${activeFilter} posts available right now`
                  }
                </p>
                {activeFilter === 'following' && (
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Browse All Posts
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center">
              <button className="bg-slate-800 border border-slate-700 text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-700 hover:text-white transition-colors">
                Load More Posts
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Suggested Follows */}
          <SuggestedFollows 
            followedAccounts={followedAccounts}
            onToggleFollow={toggleFollow}
          />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompetitionFinder } from './CompetitionFinder';
import { LoadingSpinner } from '../../../admin/components/shared/LoadingSpinner';
import { Star, TrendingUp, MapPin } from 'lucide-react';
import { tw, getButtonClass } from '../../../../styles/theme';
import { 
  getFeaturedMeets, 
  getMeetsCountByCategory,
  type FeaturedMeet,
  type PublicMeet 
} from '../../../../services/shared/meetsService';

export const DiscoverTab: React.FC = () => {
  const navigate = useNavigate();
  const [featuredCompetitions, setFeaturedCompetitions] = useState<FeaturedMeet[]>([]);
  const [categoryCounts, setCategoryCounts] = useState({
    local: 0,
    usapl: 0,
    beginner: 0,
  });
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [availableMeets, setAvailableMeets] = useState<PublicMeet[]>([]);

  useEffect(() => {
    loadFeaturedCompetitions();
    loadCategoryCount();
  }, []);

  const loadFeaturedCompetitions = async () => {
    try {
      setIsLoadingFeatured(true);
      setFeaturedError(null);
      const featured = await getFeaturedMeets(2);
      setFeaturedCompetitions(featured);
    } catch (error) {
      console.error('Failed to load featured competitions:', error);
      setFeaturedError('Unable to load featured competitions. Please try again later.');
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const loadCategoryCount = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      const counts = await getMeetsCountByCategory();
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Failed to load category counts:', error);
      setCategoryError('Unable to load category information.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const popularCategories = [
    { 
      name: 'Local Tampa Meets', 
      count: categoryCounts.local, 
      icon: MapPin,
      color: 'yellow',
      filter: { location: 'Tampa' }
    },
    { 
      name: 'USAPL Sanctioned', 
      count: categoryCounts.usapl, 
      icon: Star,
      color: 'blue',
      filter: { federation: 'USAPL' }
    },
    { 
      name: 'Beginner Friendly', 
      count: categoryCounts.beginner, 
      icon: TrendingUp,
      color: 'green',
      filter: { beginnerFriendly: true }
    }
  ];

  const handleCategoryClick = (category: any) => {
    console.log('Category clicked:', category);
  };

  const handleRetryFeatured = () => {
    loadFeaturedCompetitions();
  };

  const handleRetryCategories = () => {
    loadCategoryCount();
  };

  const getIconColor = (color: string) => {
    switch(color) {
      case 'yellow': return 'text-yellow-400 group-hover:text-yellow-300';
      case 'blue': return 'text-blue-400 group-hover:text-blue-300';
      case 'green': return 'text-green-400 group-hover:text-green-300';
      default: return 'text-blue-400 group-hover:text-blue-300';
    }
  };

  const getCountColor = (color: string) => {
    switch(color) {
      case 'yellow': return 'text-yellow-400';
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Featured Competitions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Featured Competitions</h3>
        
        {isLoadingFeatured ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className={`${tw.glassCard} overflow-hidden`}>
                <div className="h-32 bg-white/5 flex items-center justify-center">
                  <LoadingSpinner size="md" />
                </div>
                <div className="p-6">
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded mb-3 w-2/3"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-white/10 rounded w-24"></div>
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredError ? (
          <div className={`${tw.glassCard} border border-red-500/30 p-6 mb-8`}>
            <div className="text-center">
              <p className="text-red-400 mb-4">{featuredError}</p>
              <button
                onClick={handleRetryFeatured}
                className={getButtonClass('red')}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredCompetitions.map((comp) => (
              <div key={comp.id} className={`${tw.glassCard} ${tw.glassCardHover} overflow-hidden group`}>
                <div className={`h-32 ${comp.image} relative`}>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {comp.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                      {comp.federation}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-white mb-2">{comp.name}</h4>
                  <p className={`text-sm ${tw.textTertiary} mb-3`}>{comp.description}</p>
                  <div className={`flex items-center justify-between text-sm ${tw.textSecondary} mb-4`}>
                    <span>{comp.date}</span>
                    <span>{comp.location}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/compete/meet/${comp.id}`)}
                    className={getButtonClass('blue')}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            
            {featuredCompetitions.length === 0 && (
              <div className={`col-span-2 ${tw.glassCard} p-8 text-center`}>
                <p className={tw.textTertiary}>No featured competitions available at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Categories */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Popular Categories</h3>
        
        {isLoadingCategories ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${tw.glassCard} p-6`}>
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 bg-white/10 rounded mr-3"></div>
                  <div className="h-5 bg-white/10 rounded flex-1"></div>
                </div>
                <div className="h-8 bg-white/10 rounded mb-1 w-16"></div>
                <div className="h-4 bg-white/10 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : categoryError ? (
          <div className={`${tw.glassCard} border border-red-500/30 p-6 mb-8`}>
            <div className="text-center">
              <p className="text-red-400 mb-4">{categoryError}</p>
              <button
                onClick={handleRetryCategories}
                className={getButtonClass('red')}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {popularCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className={`${tw.glassCard} ${tw.glassCardHover} p-6 text-left group`}
                >
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-5 h-5 ${getIconColor(category.color)} mr-3`} />
                    <span className="font-medium text-white">{category.name}</span>
                  </div>
                  <p className={`text-2xl font-bold ${getCountColor(category.color)} mb-1`}>{category.count}</p>
                  <p className={`text-sm ${tw.textTertiary}`}>competitions available</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Competition Finder */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Find Competitions</h3>
        <CompetitionFinder 
          availableMeets={availableMeets}
          onMeetsUpdate={setAvailableMeets}
        />
      </div>
    </div>
  );
};
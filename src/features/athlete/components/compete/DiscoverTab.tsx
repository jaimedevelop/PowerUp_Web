import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompetitionFinder } from './CompetitionFinder';
import { LoadingSpinner } from '../../../admin/components/shared/LoadingSpinner';
import { Star, TrendingUp, MapPin } from 'lucide-react';
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
      filter: { location: 'Tampa' }
    },
    { 
      name: 'USAPL Sanctioned', 
      count: categoryCounts.usapl, 
      icon: Star,
      filter: { federation: 'USAPL' }
    },
    { 
      name: 'Beginner Friendly', 
      count: categoryCounts.beginner, 
      icon: TrendingUp,
      filter: { beginnerFriendly: true }
    }
  ];

  const handleCategoryClick = (category: any) => {
    // You could implement this to filter the CompetitionFinder
    console.log('Category clicked:', category);
  };

  const handleRetryFeatured = () => {
    loadFeaturedCompetitions();
  };

  const handleRetryCategories = () => {
    loadCategoryCount();
  };

  return (
    <div className="space-y-8">
      {/* Featured Competitions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Featured Competitions</h3>
        
        {isLoadingFeatured ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="h-32 bg-slate-700 flex items-center justify-center">
                  <LoadingSpinner size="md" />
                </div>
                <div className="p-6">
                  <div className="h-6 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded mb-3 w-2/3"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                    <div className="h-4 bg-slate-700 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredError ? (
          <div className="bg-slate-800 rounded-xl border border-red-700 p-6 mb-8">
            <div className="text-center">
              <p className="text-red-400 mb-4">{featuredError}</p>
              <button
                onClick={handleRetryFeatured}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredCompetitions.map((comp) => (
              <div key={comp.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group hover:border-slate-600 transition-colors">
                <div className={`h-32 ${comp.image} relative`}>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {comp.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {comp.federation}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-white mb-2">{comp.name}</h4>
                  <p className="text-sm text-slate-400 mb-3">{comp.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-300 mb-4">
                    <span>{comp.date}</span>
                    <span>{comp.location}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/compete/meet/${comp.id}`)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            
            {featuredCompetitions.length === 0 && (
              <div className="col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
                <p className="text-slate-400">No featured competitions available at this time.</p>
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
              <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 bg-slate-700 rounded mr-3"></div>
                  <div className="h-5 bg-slate-700 rounded flex-1"></div>
                </div>
                <div className="h-8 bg-slate-700 rounded mb-1 w-16"></div>
                <div className="h-4 bg-slate-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : categoryError ? (
          <div className="bg-slate-800 rounded-xl border border-red-700 p-6 mb-8">
            <div className="text-center">
              <p className="text-red-400 mb-4">{categoryError}</p>
              <button
                onClick={handleRetryCategories}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
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
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-left hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <div className="flex items-center mb-3">
                    <IconComponent className="w-5 h-5 text-purple-400 mr-3 group-hover:text-purple-300" />
                    <span className="font-medium text-white">{category.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400 mb-1">{category.count}</p>
                  <p className="text-sm text-slate-400">competitions available</p>
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
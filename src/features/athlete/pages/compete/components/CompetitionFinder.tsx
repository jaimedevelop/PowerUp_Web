import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner';
import { tw, getButtonClass } from '../../../../../styles/theme';
import { 
  searchMeetsWithFilters, 
  getPublishedMeets,
  type PublicMeet 
} from '../../../../../services/shared/meetsService';

interface CompetitionFinderProps {
  availableMeets: PublicMeet[];
  onMeetsUpdate: (meets: PublicMeet[]) => void;
}

export const CompetitionFinder: React.FC<CompetitionFinderProps> = ({ 
  availableMeets, 
  onMeetsUpdate 
}) => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFederation, setSelectedFederation] = useState('all');
  const [dateRange, setDateRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadInitialMeets();
  }, []);

  const loadInitialMeets = async () => {
    try {
      setIsInitialLoading(true);
      setError(null);
      const meets = await getPublishedMeets(20);
      onMeetsUpdate(meets);
    } catch (error) {
      console.error('Failed to load initial meets:', error);
      setError('Unable to load competitions. Please try again.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      
      const meets = await searchMeetsWithFilters(
        searchLocation,
        selectedFederation,
        dateRange
      );
      
      onMeetsUpdate(meets);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (hasSearched) {
      handleSearch();
    } else {
      loadInitialMeets();
    }
  };

  const handleClearFilters = async () => {
    setSearchLocation('');
    setSelectedFederation('all');
    setDateRange('30days');
    setHasSearched(false);
    setError(null);
    
    try {
      setIsLoading(true);
      const meets = await getPublishedMeets(20);
      onMeetsUpdate(meets);
    } catch (error) {
      console.error('Failed to reload meets:', error);
      setError('Unable to load competitions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getResultsText = () => {
    if (hasSearched) {
      return availableMeets.length === 1 
        ? '1 competition found'
        : `${availableMeets.length} competitions found`;
    }
    return 'Available Competitions';
  };

  return (
    <div className={`${tw.glassCard} p-6`}>
      <div className="flex items-center mb-6">
        <Search className="w-6 h-6 text-blue-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Find Competitions</h3>
      </div>

      {/* Search Filters */}
      <div className="space-y-4 mb-6">
        <div>
          <label className={`block text-sm font-medium ${tw.textSecondary} mb-2`}>Location</label>
          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${tw.textTertiary}`} />
            <input 
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={`w-full pl-10 ${tw.input}`}
              placeholder="City, State or ZIP code"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${tw.textSecondary} mb-2`}>Federation</label>
            <select 
              value={selectedFederation}
              onChange={(e) => setSelectedFederation(e.target.value)}
              className={tw.input}
              disabled={isLoading}
            >
              <option value="all">All Federations</option>
              <option value="usapl">USAPL</option>
              <option value="uspa">USPA</option>
              <option value="ipf">IPF</option>
              <option value="rps">RPS</option>
              <option value="spf">SPF</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${tw.textSecondary} mb-2`}>Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={tw.input}
              disabled={isLoading}
            >
              <option value="30days">Next 30 days</option>
              <option value="3months">Next 3 months</option>
              <option value="6months">Next 6 months</option>
              <option value="1year">Next year</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className={`flex-1 ${getButtonClass('blue')} flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Searching...' : 'Search Competitions'}
          </button>
          
          {hasSearched && (
            <button 
              onClick={handleClearFilters}
              disabled={isLoading}
              className={`px-4 py-3 ${tw.glassCard} ${tw.glassCardHover} rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Competition Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">{getResultsText()}</h4>
          {availableMeets.length > 0 && !isInitialLoading && !isLoading && (
            <button
              onClick={handleRetry}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          )}
        </div>

        {/* Loading State */}
        {(isInitialLoading || isLoading) && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${tw.glassCard} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="h-6 bg-white/10 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-32"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-white/10 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-white/10 rounded w-16"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                </div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`${tw.glassCard} p-6 border border-red-500/30 text-center`}>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className={getButtonClass('red')}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isInitialLoading && !isLoading && !error && availableMeets.length === 0 && (
          <div className={`${tw.glassCard} p-8 text-center`}>
            <Search className={`w-12 h-12 ${tw.textTertiary} mx-auto mb-4`} />
            <p className={`${tw.textSecondary} font-medium mb-2`}>
              {hasSearched ? 'No competitions found' : 'No competitions available'}
            </p>
            <p className={`${tw.textTertiary} text-sm mb-4`}>
              {hasSearched 
                ? 'Try adjusting your search criteria or check back later.'
                : 'Check back soon for upcoming competitions in your area.'
              }
            </p>
            {hasSearched && (
              <button
                onClick={handleClearFilters}
                className={getButtonClass('blue')}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Competition Cards */}
        {!isInitialLoading && !isLoading && !error && availableMeets.length > 0 && (
          <>
            {availableMeets.map((comp) => (
              <div key={comp.id} className={`${tw.glassCard} ${tw.glassCardHover} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-white">{comp.name}</h5>
                    <p className={`text-sm ${tw.textTertiary}`}>{comp.federation} • {comp.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${comp.statusColor}`}>{comp.status}</p>
                    <p className={`text-xs ${tw.textTertiary}`}>{comp.spotsLeft} spots left</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className={`flex items-center ${tw.textSecondary}`}>
                    <MapPin className={`w-4 h-4 ${tw.textTertiary} mr-2 flex-shrink-0`} />
                    <span className="truncate">{comp.location.venue}, {comp.location.city} {comp.location.state}</span>
                  </div>
                  <div className={`flex items-center ${tw.textSecondary}`}>
                    <DollarSign className={`w-4 h-4 ${tw.textTertiary} mr-2 flex-shrink-0`} />
                    <span>{comp.entryFee}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center text-xs ${tw.textTertiary}`}>
                    <Users className="w-4 h-4 mr-1" />
                    <span>{comp.registrations}/{comp.maxParticipants} registered</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((comp.registrations / comp.maxParticipants) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/compete/meet/${comp.id}`)}
                  className={getButtonClass('green')}
                >
                  View Details & Register
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
// src/admin/components/meets/MeetsList.tsx
import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';
import { Button } from '../../../../shared/ui/Button';
import { MeetCard } from './MeetCard';
import { getMeets, getAllMeetsStats, handleFirebaseError } from '../../../../../firebase';
import { MeetData, OverallStats } from '../../../../../firebase';
import { MeetStatus } from '../../../../../types/admin/meet-types';
import { MeetLocation } from '../../types/common-types';

// Define the status type properly
type MeetStatus = 'draft' | 'published' | 'registration-open' | 'registration-closed' | 'in-progress' | 'completed';

// Interface for the list item (what MeetCard expects)
interface MeetListItem {
  id: string;
  name: string;
  date: string;
  location: string; // String format for MeetCard
  registrations: number;
  maxParticipants: number;
  status: MeetStatus;
  revenue: number;
  weightClasses?: string[]; // Add optional weightClasses for MeetCard
  federation: string; // Add federation for MeetCard
}

interface MeetsListProps {
  onCreateMeet: () => void;
  onEditMeet?: (meetId: string) => void;
}

export const MeetsList: React.FC<MeetsListProps> = ({ onCreateMeet, onEditMeet }) => {
  const [meets, setMeets] = useState<MeetListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MeetStatus>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Load meets on component mount
  useEffect(() => {
    loadMeets();
    loadStats();
  }, []);

  const formatLocationString = (location: any): string => {
    if (typeof location === 'string') {
      return location; // Fallback for any old data
    }
    if (location && typeof location === 'object') {
      return `${location.city || 'Unknown'}, ${location.state || 'Unknown'}`;
    }
    return 'Location TBD';
  };

  const loadMeets = async () => {
    try {
      setError(null);
      const fetchedMeets = await getMeets({
        orderByField: 'updatedAt',
        orderDirection: 'desc',
        limit: 50,
      });

      // Transform the data to match MeetCard expectations
      const transformedMeets: MeetListItem[] = fetchedMeets.map(meet => ({
        id: meet.id,
        name: meet.name,
        date: meet.date,
        location: formatLocationString(meet.location), // Convert to string
        registrations: meet.registrations || 0,
        maxParticipants: meet.maxParticipants,
        status: meet.status as MeetStatus,
        revenue: meet.revenue || 0,
        weightClasses: meet.weightClasses || [], // Include weight classes
        federation: meet.federation, // Include federation
      }));

      setMeets(transformedMeets);
    } catch (err) {
      console.error('Error loading meets:', err);
      const firebaseError = handleFirebaseError(err);
      setError(firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const overallStats = await getAllMeetsStats();
      setStats(overallStats);
    } catch (err) {
      console.error('Error loading stats:', err);
      // Don't set error for stats failure, just log it
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMeets(), loadStats()]);
    setRefreshing(false);
  };

  const handleEditMeet = (meetId: string) => {
    if (onEditMeet) {
      onEditMeet(meetId);
    }
  };

  const filteredMeets = meets.filter(meet => {
    const matchesSearch = 
      meet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || meet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Meets</h2>
            <p className="text-slate-400">Manage your powerlifting competitions</p>
          </div>
          <Button onClick={onCreateMeet} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Meet</span>
          </Button>
        </div>

        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-slate-400">Loading your meets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Meets</h2>
            <p className="text-slate-400">Manage your powerlifting competitions</p>
          </div>
          <Button onClick={onCreateMeet} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Meet</span>
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-red-400 font-medium mb-2">Failed to load meets</h3>
              <p className="text-slate-300 mb-4">{error}</p>
              <Button onClick={handleRefresh} className="flex items-center space-x-2">
                <RefreshCw size={16} />
                <span>Try Again</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Meets</h2>
          <p className="text-slate-400">Manage your powerlifting competitions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Button onClick={onCreateMeet} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Meet</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search meets by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | MeetStatus)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="registration-open">Registration Open</option>
              <option value="registration-closed">Registration Closed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats?.totalMeets || meets.length}</div>
            <div className="text-sm text-slate-400">Total Meets</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats?.registrationOpenCount || meets.filter(m => m.status === 'registration-open').length}
            </div>
            <div className="text-sm text-slate-400">Registration Open</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {stats?.totalRegistrations || meets.reduce((sum, meet) => sum + (meet.registrations || 0), 0)}
            </div>
            <div className="text-sm text-slate-400">Total Registrations</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              ${(stats?.totalRevenue || meets.reduce((sum, meet) => sum + (meet.revenue || 0), 0)).toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Revenue</div>
          </div>
        </Card>
      </div>

      {/* Results count */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="text-sm text-slate-400">
          Showing {filteredMeets.length} of {meets.length} meets
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>
      )}

      {/* Meets Grid */}
      {filteredMeets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeets.map((meet) => (
            <MeetCard 
              key={meet.id} 
              meet={meet}
              onEdit={handleEditMeet}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Trophy size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {meets.length === 0 
                ? 'No meets created yet' 
                : 'No meets found'
              }
            </h3>
            <p className="text-slate-400 mb-6">
              {meets.length === 0
                ? 'Create your first meet to get started with managing powerlifting competitions'
                : searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No meets available'
              }
            </p>
            <Button onClick={onCreateMeet}>
              <Plus size={20} className="mr-2" />
              {meets.length === 0 ? 'Create Your First Meet' : 'Create New Meet'}
            </Button>
          </div>
        </Card>
      )}

      {/* Additional Actions */}
      {meets.length > 0 && (
        <div className="flex justify-center">
          <p className="text-sm text-slate-400">
            Manage individual meets by clicking on their cards above
          </p>
        </div>
      )}
    </div>
  );
};
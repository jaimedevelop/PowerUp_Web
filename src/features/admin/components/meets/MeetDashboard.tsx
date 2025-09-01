import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Calendar,   
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Play,
  Settings,
  MessageSquare,
  BarChart3,
  UserCheck,
  AlertCircle,
  Trophy,
  Zap,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { getMeetById } from '../../../../firebase';
import { MeetData } from '../../../../firebase';
import { Meet } from '../../../../types/admin/meet-types';

interface MeetDashboardProps {
    meet: Meet;
    onEdit?: (meetId: string) => void;
}

const MeetDashboard: React.FC<MeetDashboardProps> = ({onEdit }) => {
  const { meetId } = useParams<{ meetId: string }>();
  const navigate = useNavigate();
  const [meet, setMeet] = useState<MeetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'communications' | 'live' | 'reports'>('overview');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const fetchMeet = async () => {
      if (!meetId) return;
      
      try {
        setLoading(true);
        const meetData = await getMeetById(meetId);
        if (meetData) {
          setMeet(meetData);
        } else {
          setError('Meet not found');
        }
      } catch (err) {
        setError('Failed to load meet data');
        console.error('Error fetching meet:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeet();
  }, [meetId]);
  
  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/invite/${meetId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const handleEditMeet = (e: React.MouseEvent) => {
  console.log('🔵 Edit Meet button clicked!');
  console.log('🔵 Event:', e);
  console.log('🔵 meetId from params:', meetId);
  console.log('🔵 onEdit prop:', onEdit);
  console.log('🔵 meet object:', meet);
  console.log('🔵 navigate function:', navigate);
  
  e.stopPropagation(); // Prevent card click
  console.log('🔵 stopPropagation called');
  
  if (onEdit && meetId) {
    console.log('🔵 Calling onEdit with meetId:', meetId);
    onEdit(meetId); // Use meetId from URL params instead of meet.id
  } else if (meetId) {
    console.log('🔵 Navigating to edit page for meetId:', meetId);
    // Fallback navigation if no onEdit handler provided
    navigate(`/admin/director/meets/${meetId}/edit`); // Use meetId from URL params
  } else {
    console.log('🔴 No meetId available!');
  }
  
  console.log('🔵 handleEditMeet function completed');
};

  const calculateDaysUntil = (date: any): number | string => {
    if (!date) return 'TBD';
    
    try {
      // Handle both Firestore Timestamp and string dates
      const meetDate = date.toDate ? date.toDate() : new Date(date);
      const today = new Date();
      
      // Reset time to start of day for accurate day calculation
      meetDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = meetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error calculating days until meet:', error);
      return 'TBD';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-500';
      case 'published': return 'bg-blue-500';
      case 'registration-open': return 'bg-green-500';
      case 'registration-closed': return 'bg-yellow-500';
      case 'in-progress': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-slate-500';
    }
  };
  
  const getLocationString = (location: any) => {
    if (typeof location === 'string') return location;
    return `${location.venue}, ${location.city}, ${location.state}`;
  };
  
  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'registrations', label: 'Registrations', icon: UserCheck },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'live', label: 'Live', icon: Zap },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading meet dashboard...</div>
      </div>
    );
  }
  
  if (error || !meet) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-white text-lg mb-4">{error || 'Meet not found'}</div>
          <button
            onClick={() => navigate('/admin/director/meets')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Meets
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/director/meets')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{meet.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-300 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(meet.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{getLocationString(meet.location)}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(meet.status)}`}>
                    {meet.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {meet.status === 'registration-closed' || meet.status === 'in-progress' ? (
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                  <Play className="h-4 w-4" />
                  <span>Go Live</span>
                </button>
              ) : null}
              
              <button 
                onClick={handleEditMeet}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Meet</span>
              </button>
              
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Registrations</p>
                    <p className="text-2xl font-bold text-white">{meet.registrations || 0}</p>
                    <p className="text-xs text-slate-500">of {meet.maxParticipants} max</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Capacity</span>
                    <span className="text-slate-400">
                      {Math.round(((meet.registrations || 0) / meet.maxParticipants) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(((meet.registrations || 0) / meet.maxParticipants) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Share Card*/}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Share Meet</p>
                    <p className="text-lg font-bold text-white">Invite Link</p>
                  </div>
                  <Share2 className="h-8 w-8 text-green-500" />
                </div>
                
                <div className="bg-slate-900 rounded-lg p-3 mb-4">
                  <p className="text-slate-300 text-sm truncate">
                    {window.location.origin}/invite/{meetId}
                  </p>
                </div>
                
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Days Until</p>
                    <p className="text-2xl font-bold text-white">
                      {calculateDaysUntil(meet.date)}
                    </p>
                    <p className="text-xs text-slate-500">Competition day</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Federation</p>
                    <p className="text-2xl font-bold text-white">{meet.federation}</p>
                    <p className="text-xs text-slate-500">Sanctioned</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>
            
            {/* Meet Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Competition Details */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Competition Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Weight Classes</p>
                    <div className="flex flex-wrap gap-2">
                      {meet.weightClasses.map((wc, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                          {wc}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Divisions</p>
                    <div className="flex flex-wrap gap-2">
                      {meet.divisions.map((div, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                          {div}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Equipment</p>
                    <div className="flex flex-wrap gap-2">
                      {meet.equipment.map((eq, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Registration Information */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Registration Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Registration Fee</span>
                    <span className="text-white font-medium">${meet.registrationFee}</span>
                  </div>
                  
                  {meet.earlyBirdFee && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Early Bird Fee</span>
                      <span className="text-white font-medium">${meet.earlyBirdFee}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Registration Deadline</span>
                    <span className="text-white font-medium">{formatDate(meet.registrationDeadline)}</span>
                  </div>
                  
                  {meet.earlyBirdDeadline && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Early Bird Deadline</span>
                      <span className="text-white font-medium">{formatDate(meet.earlyBirdDeadline)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Max Participants</span>
                    <span className="text-white font-medium">{meet.maxParticipants}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="text-slate-400 text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>No recent activity to display</p>
                <p className="text-sm">Registration and communication activity will appear here</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Placeholder content for other tabs */}
        {activeTab === 'registrations' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Registration Management</h3>
            <div className="text-slate-400 text-center py-8">
              <UserCheck className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>Registration management features coming soon</p>
              <p className="text-sm">View and manage athlete registrations, approve participants, handle refunds</p>
            </div>
          </div>
        )}
        
        {activeTab === 'communications' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Communications</h3>
            <div className="text-slate-400 text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>Communication tools coming soon</p>
              <p className="text-sm">Send messages to participants, manage announcements, automated notifications</p>
            </div>
          </div>
        )}
        
        {activeTab === 'live' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Live Meet Management</h3>
            <div className="text-slate-400 text-center py-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>Live meet features coming soon</p>
              <p className="text-sm">Real-time attempt tracking, scoreboard management, live announcements</p>
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Reports & Analytics</h3>
            <div className="text-slate-400 text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>Reporting features coming soon</p>
              <p className="text-sm">Financial reports, participation analytics, performance metrics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetDashboard;
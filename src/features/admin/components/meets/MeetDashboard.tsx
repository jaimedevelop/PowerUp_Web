import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Calendar,   
  MapPin, 
  Play,
  Settings,
  MessageSquare,
  BarChart3,
  UserCheck,
  AlertCircle,
  Zap,
  Users,
  Scale
} from 'lucide-react';
import { getMeetById } from '../../../../firebase';
import { MeetData } from '../../../../firebase';
import { Meet } from '../../../../types/admin/meet-types';

// Import tab components
import OverviewTab from './dashboardTabs/OverviewTab';
import RegistrationsTab from './dashboardTabs/RegistrationsTab';
import FlightsTab from './dashboardTabs/FlightsTab';
import WeighInTab from './dashboardTabs/WeighInTab';
import CommunicationsTab from './dashboardTabs/CommunicationsTab';
import LiveTab from './dashboardTabs/LiveTab';
import ReportsTab from './dashboardTabs/ReportsTab';

interface MeetDashboardProps {
    meet: Meet;
    onEdit?: (meetId: string) => void;
}

type TabType = 'overview' | 'registrations' | 'flights' | 'weigh-in' | 'communications' | 'live' | 'reports';

const MeetDashboard: React.FC<MeetDashboardProps> = ({ onEdit }) => {
  const { meetId } = useParams<{ meetId: string }>();
  const navigate = useNavigate();
  const [meet, setMeet] = useState<MeetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
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

  const handleEditMeet = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onEdit && meetId) {
      onEdit(meetId);
    } else if (meetId) {
      navigate(`/admin/director/meets/${meetId}/edit`);
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
    { id: 'flights', label: 'Flights', icon: Users },
    { id: 'weigh-in', label: 'Weigh-In', icon: Scale },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'live', label: 'Live', icon: Zap },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const renderTabContent = () => {
    if (!meet) return null;

    const commonProps = {
      meet,
      meetId: meetId!,
      onRefresh: () => {
        // Refresh meet data
        const fetchMeet = async () => {
          try {
            const meetData = await getMeetById(meetId!);
            if (meetData) setMeet(meetData);
          } catch (err) {
            console.error('Error refreshing meet:', err);
          }
        };
        fetchMeet();
      }
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...commonProps} />;
      case 'registrations':
        return <RegistrationsTab {...commonProps} />;
      case 'flights':
        return <FlightsTab {...commonProps} />;
      case 'weigh-in':
        return <WeighInTab {...commonProps} />;
      case 'communications':
        return <CommunicationsTab {...commonProps} />;
      case 'live':
        return <LiveTab {...commonProps} />;
      case 'reports':
        return <ReportsTab {...commonProps} />;
      default:
        return <OverviewTab {...commonProps} />;
    }
  };
  
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
                  onClick={() => setActiveTab(tab.id as TabType)}
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
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MeetDashboard;
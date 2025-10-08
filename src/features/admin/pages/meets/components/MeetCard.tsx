import React, { useState } from 'react';
import { Calendar, MapPin, Users, Edit3, Eye, Share2, Copy } from 'lucide-react';
import { Meet } from '../../../../../types/admin/meet-types';
import { useNavigate } from 'react-router-dom';

interface MeetCardProps {
  meet: Meet;
  onEdit?: (meetId: string) => void;
}

export const MeetCard: React.FC<MeetCardProps> = ({ meet, onEdit }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
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

  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocationString = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.venue}, ${location.city}, ${location.state}`;
  };

  // Generate the invite link
  const inviteLink = `https://app.powerlifting.com/meet/${meet.id}/invite`;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewDashboard = () => {
    navigate(`/admin/director/meets/${meet.id}`);
  };

const handleEditMeet = (e: React.MouseEvent) => {
  console.log('🔧 MeetCard Edit button clicked!');
  console.log('🔧 Meet object:', meet);
  console.log('🔧 meet.id:', meet.id);
  console.log('🔧 onEdit prop:', onEdit);
  console.log('🔧 Current URL:', window.location.pathname);
  
  e.stopPropagation(); // Prevent card click
  
  // Always try direct navigation first, regardless of onEdit prop
  const editUrl = `/admin/director/meets/${meet.id}/edit`;
  console.log('🔧 Attempting to navigate to:', editUrl);
  
  try {
    navigate(editUrl);
    console.log('🔧 Direct navigation called');
  } catch (error) {
    console.error('🔴 Navigation failed:', error);
    // Fallback to window.location
    window.location.href = editUrl;
  }
  
  // Also call onEdit if it exists (for any additional logic)
  if (onEdit) {
    console.log('🔧 Also calling onEdit prop');
    onEdit(meet.id);
  }
  
  console.log('🔧 MeetCard handleEditMeet completed');
};

  return (
    <div 
      className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
      onClick={handleViewDashboard}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
            {meet.name}
          </h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(meet.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{getLocationString(meet.location)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(meet.status)}`}>
            {meet.status.replace('-', ' ').toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Federation and Details */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Federation</span>
          <span className="text-white font-medium">{meet.federation}</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-slate-400">Registrations</p>
              <p className="text-sm font-semibold text-white">
                {meet.registrations || 0} / {meet.maxParticipants}
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(((meet.registrations || 0) / meet.maxParticipants) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Share Card - simplified version */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Share2 className="h-4 w-4 text-cyan-500" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Share Meet</p>
              <button
                onClick={handleCopyLink}
                className="mt-1 w-full flex items-center justify-center space-x-1 px-2 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 transition-colors"
              >
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Competition Info */}
      <div className="mb-6 space-y-2">
        <div>
          <p className="text-xs text-slate-400 mb-1">Weight Classes</p>
          <div className="flex flex-wrap gap-1">
            {(meet.weightClasses || []).slice(0, 3).map((wc, index) => (
              <span key={index} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                {wc}
              </span>
            ))}
            {(meet.weightClasses || []).length > 3 && (
              <span className="px-2 py-0.5 bg-slate-600 text-slate-400 rounded text-xs">
                +{(meet.weightClasses || []).length - 3} more
              </span>
            )}
            {!meet.weightClasses && (
              <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">
                No weight classes defined
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleViewDashboard}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          <span>View Dashboard</span>
        </button>
        
        <button
          onClick={handleEditMeet}
          className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
          title="Edit meet "
        >
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
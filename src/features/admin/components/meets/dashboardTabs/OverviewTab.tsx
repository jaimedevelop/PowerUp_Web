import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Trophy,
  Share2,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { MeetData } from '../../../../../firebase';

interface OverviewTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ meet, meetId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/invite/${meetId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateDaysUntil = (date: any): number | string => {
    if (!date) return 'TBD';
    
    try {
      const meetDate = date.toDate ? date.toDate() : new Date(date);
      const today = new Date();
      
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

  return (
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
        
        {/* Share Card */}
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
  );
};

export default OverviewTab;
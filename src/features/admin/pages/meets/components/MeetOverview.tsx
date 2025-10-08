import React, { useState } from 'react';
import { Calendar, MapPin, Users, Trophy, Share2, Copy } from 'lucide-react';
import { MeetOverviewProps } from './types'; // Assuming you have a types file

export const MeetOverview: React.FC<MeetOverviewProps> = ({ meetId }) => {
  const [copied, setCopied] = useState(false);
  
  // This would normally fetch meet data based on meetId
  // For now, using mock data
  const meetData = {
    name: 'Tampa Bay Open',
    date: '2025-08-15',
    location: 'Tampa, FL',
    status: 'registration-open',
    registrations: 45,
    maxParticipants: 100,
    federation: 'USPA'
  };

  // Generate the invite link
  const inviteLink = `https://app.powerlifting.com/meet/${meetId}/invite`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Meet Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-400" size={20} />
            <div>
              <p className="text-sm text-slate-400">Date</p>
              <p className="text-white">{meetData.date}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="text-green-400" size={20} />
            <div>
              <p className="text-sm text-slate-400">Location</p>
              <p className="text-white">{meetData.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Trophy className="text-yellow-400" size={20} />
            <div>
              <p className="text-sm text-slate-400">Federation</p>
              <p className="text-white">{meetData.federation}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Users className="text-purple-400" size={20} />
            <div>
              <p className="text-sm text-slate-400">Registrations</p>
              <p className="text-white">{meetData.registrations} / {meetData.maxParticipants}</p>
            </div>
          </div>
          
          {/* Share Card - replacing Revenue card */}
          <div className="flex items-start space-x-3">
            <Share2 className="text-cyan-400" size={20} />
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-1">Share Meet</p>
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm truncate bg-slate-700 px-2 py-1 rounded flex-1">
                  {inviteLink}
                </p>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
                  aria-label="Copy invite link"
                >
                  <Copy size={16} className="text-slate-300" />
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-1">Link copied!</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(meetData.status)}`}></div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <p className="text-white capitalize">{meetData.status.replace('-', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Registration Capacity</span>
          <span className="text-slate-400">
            {Math.round((meetData.registrations / meetData.maxParticipants) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((meetData.registrations / meetData.maxParticipants) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
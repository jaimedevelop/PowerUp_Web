// UpcomingMeetsCard.tsx
import React from 'react';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { Card } from '../shared/Card';

interface UpcomingMeet {
  id: string;
  name: string;
  date: string;
  location: string;
  registrations: number;
  maxParticipants: number;
  status: 'draft' | 'published' | 'registration-open';
}

const mockUpcomingMeets: UpcomingMeet[] = [
  {
    id: '1',
    name: 'Tampa Bay Open',
    date: '2025-07-15',
    location: 'Tampa, FL',
    registrations: 45,
    maxParticipants: 60,
    status: 'registration-open'
  },
  {
    id: '2',
    name: 'Florida State Championships',
    date: '2025-08-02',
    location: 'Orlando, FL',
    registrations: 23,
    maxParticipants: 80,
    status: 'published'
  },
  {
    id: '3',
    name: 'Summer Strength Classic',
    date: '2025-08-20',
    location: 'Miami, FL',
    registrations: 12,
    maxParticipants: 40,
    status: 'draft'
  }
];

export const UpcomingMeetsCard: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'published': return 'bg-blue-500/20 text-blue-400';
      case 'registration-open': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Upcoming Meets</h3>
        <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
          <Plus size={16} />
          <span className="text-sm">Create Meet</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {mockUpcomingMeets.map((meet) => (
          <div key={meet.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{meet.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{new Date(meet.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{meet.location}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meet.status)}`}>
                {meet.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Users size={16} />
                <span>{meet.registrations}/{meet.maxParticipants} registered</span>
              </div>
              <div className="w-24">
                <div className="bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(meet.registrations / meet.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
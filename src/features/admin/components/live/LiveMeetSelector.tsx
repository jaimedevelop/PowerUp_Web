import React from 'react';
import { Calendar, MapPin, Users, Radio, ArrowRight } from 'lucide-react';

interface Meet {
  id: string;
  name: string;
  date: string;
  location: string;
  status: string;
  registrations: number;
}

const mockMeets: Meet[] = [
  {
    id: '1',
    name: 'Tampa Bay Open',
    date: '2025-08-15',
    location: 'Tampa, FL',
    status: 'registration-closed',
    registrations: 85
  },
  {
    id: '2',
    name: 'Florida State Championships',
    date: '2025-09-10',
    location: 'Orlando, FL',
    status: 'registration-open',
    registrations: 120
  },
  {
    id: '3',
    name: 'Summer Strength Classic',
    date: '2025-07-25',
    location: 'Miami, FL',
    status: 'in-progress',
    registrations: 65
  }
];

interface LiveMeetSelectorProps {
  onSelectMeet: (meetId: string) => void;
}

export const LiveMeetSelector: React.FC<LiveMeetSelectorProps> = ({ onSelectMeet }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-slate-400';
      case 'published': return 'text-blue-400';
      case 'registration-open': return 'text-green-400';
      case 'registration-closed': return 'text-yellow-400';
      case 'in-progress': return 'text-purple-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <Radio className="mr-2" size={20} />
        Select a Meet for Live Management
      </h3>
      
      <div className="space-y-4">
        {mockMeets.map((meet) => (
          <div 
            key={meet.id} 
            className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => onSelectMeet(meet.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{meet.name}</h4>
                  <span className={`text-sm font-medium ${getStatusColor(meet.status)}`}>
                    {meet.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {meet.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1" size={14} />
                    {meet.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1" size={14} />
                    {meet.registrations} athletes
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700 text-sm text-slate-500">
        Select a meet to begin live management. Only meets with closed registration or in-progress status can be taken live.
      </div>
    </div>
  );
};
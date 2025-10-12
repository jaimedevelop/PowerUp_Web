// RecentRegistrations.tsx
import React from 'react';
import { User, Calendar } from 'lucide-react';

interface Registration {
  id: string;
  athleteName: string;
  meetName: string;
  date: string;
  weightClass: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRegistrations: Registration[] = [
  {
    id: '1',
    athleteName: 'Sarah Johnson',
    meetName: 'Tampa Bay Open',
    date: '2025-07-10',
    weightClass: '63kg',
    status: 'pending'
  },
  {
    id: '2',
    athleteName: 'Mike Wilson',
    meetName: 'Florida State Championships',
    date: '2025-07-09',
    weightClass: '83kg',
    status: 'approved'
  },
  {
    id: '3',
    athleteName: 'Lisa Chen',
    meetName: 'Summer Strength Classic',
    date: '2025-07-08',
    weightClass: '57kg',
    status: 'approved'
  }
];

export const RecentRegistrations: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Recent Registrations</h3>
      <div className="space-y-3">
        {mockRegistrations.map((registration) => (
          <div key={registration.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                <User size={20} className="text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{registration.athleteName}</h4>
                <p className="text-sm text-slate-400">{registration.meetName} • {registration.weightClass}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor(registration.status)}`}>
                {registration.status.toUpperCase()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <Calendar size={12} />
                <span>{new Date(registration.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
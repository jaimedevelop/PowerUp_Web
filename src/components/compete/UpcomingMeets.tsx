import React from 'react';
import { Calendar, MapPin, Clock, Trophy, Users } from 'lucide-react';

export const UpcomingMeets: React.FC = () => {
  const upcomingMeets = [
    {
      id: 1,
      name: 'Spring Classic 2025',
      date: 'March 15, 2025',
      location: 'Iron Palace Gym',
      city: 'Austin, TX',
      federation: 'USAPL',
      weightClass: '83kg Open',
      status: 'Registered',
      daysUntil: 28,
      flightTime: '2:30 PM'
    },
    {
      id: 2,
      name: 'Texas State Championships',
      date: 'April 22, 2025',
      location: 'MetroFlex Gym',
      city: 'Dallas, TX',
      federation: 'USPA',
      weightClass: '83kg Open',
      status: 'Registration Open',
      daysUntil: 66,
      flightTime: 'TBD'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Upcoming Meets</h3>
        </div>
        <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {upcomingMeets.map((meet) => (
          <div key={meet.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white">{meet.name}</h4>
                <p className="text-sm text-slate-400">{meet.federation} • {meet.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{meet.daysUntil}</p>
                <p className="text-xs text-slate-400">days</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                <span>{meet.location}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Clock className="w-4 h-4 text-slate-400 mr-2" />
                <span>{meet.flightTime}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Trophy className="w-4 h-4 text-slate-400 mr-2" />
                <span>{meet.weightClass}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Users className="w-4 h-4 text-slate-400 mr-2" />
                <span className={meet.status === 'Registered' ? 'text-green-400' : 'text-yellow-400'}>
                  {meet.status}
                </span>
              </div>
            </div>

            <button className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-500 transition-colors">
              View Meet Details
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
            Find More Meets
          </button>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Meet History
          </button>
        </div>
      </div>
    </div>
  );
};
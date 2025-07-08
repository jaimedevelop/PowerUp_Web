import React, { useState } from 'react';
import { Search, MapPin, Calendar, DollarSign, Users } from 'lucide-react';

export const CompetitionFinder: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFederation, setSelectedFederation] = useState('all');
  const [dateRange, setDateRange] = useState('30days');

  const competitions = [
    {
      id: 1,
      name: 'Spring Classic 2025',
      federation: 'USAPL',
      date: 'March 15, 2025',
      location: 'Iron Palace Gym, Austin TX',
      entryFee: '$85',
      status: 'Registration Open',
      spotsLeft: 45,
      statusColor: 'text-green-400'
    },
    {
      id: 2,
      name: 'Texas State Championships',
      federation: 'USPA',
      date: 'April 22, 2025',
      location: 'MetroFlex Gym, Dallas TX',
      entryFee: '$95 ($80 early)',
      status: 'Early Registration',
      spotsLeft: 78,
      statusColor: 'text-blue-400'
    },
    {
      id: 3,
      name: 'Summer Showdown',
      federation: 'RPS',
      date: 'June 8, 2025',
      location: 'Strength Central, Houston TX',
      entryFee: '$75',
      status: 'Coming Soon',
      spotsLeft: 100,
      statusColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center mb-6">
        <Search className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Find Competitions</h3>
      </div>

      {/* Search Filters */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="City, State or ZIP code"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Federation</label>
            <select 
              value={selectedFederation}
              onChange={(e) => setSelectedFederation(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="all">All Federations</option>
              <option value="usapl">USAPL</option>
              <option value="uspa">USPA</option>
              <option value="ipf">IPF</option>
              <option value="rps">RPS</option>
              <option value="spf">SPF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="30days">Next 30 days</option>
              <option value="3months">Next 3 months</option>
              <option value="6months">Next 6 months</option>
              <option value="1year">Next year</option>
            </select>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
          <Search className="w-5 h-5 mr-2" />
          Search Competitions
        </button>
      </div>

      {/* Competition Results */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white mb-4">Available Competitions</h4>
        {competitions.map((comp) => (
          <div key={comp.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-semibold text-white">{comp.name}</h5>
                <p className="text-sm text-slate-400">{comp.federation} • {comp.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${comp.statusColor}`}>{comp.status}</p>
                <p className="text-xs text-slate-400">{comp.spotsLeft} spots left</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                <span>{comp.location}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <DollarSign className="w-4 h-4 text-slate-400 mr-2" />
                <span>{comp.entryFee}</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              View Details & Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
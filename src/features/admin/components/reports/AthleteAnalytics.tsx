import React, { useState } from 'react';
import { Users, TrendingUp, Award, Filter, Search, Calendar, MapPin, Activity, Target } from 'lucide-react';

interface AthleteData {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  weightClass: string;
  division: 'open' | 'junior' | 'masters' | 'teen';
  location: string;
  registrationDate: string;
  totalLifts: number;
  avgTotal: number;
  bestTotal: number;
  meetsCount: number;
  improvement: number;
}

interface AthleteAnalyticsProps {
  meetId?: string;
}

const mockAthleteData: AthleteData[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 28,
    gender: 'male',
    weightClass: '93kg',
    division: 'open',
    location: 'Tampa',
    registrationDate: '2025-01-15',
    totalLifts: 12,
    avgTotal: 650,
    bestTotal: 675,
    meetsCount: 5,
    improvement: 8.5
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 24,
    gender: 'female',
    weightClass: '72kg',
    division: 'open',
    location: 'Orlando',
    registrationDate: '2025-02-10',
    totalLifts: 9,
    avgTotal: 425,
    bestTotal: 450,
    meetsCount: 3,
    improvement: 12.3
  },
  {
    id: '3',
    name: 'Mike Wilson',
    age: 19,
    gender: 'male',
    weightClass: '83kg',
    division: 'junior',
    location: 'Miami',
    registrationDate: '2025-03-05',
    totalLifts: 6,
    avgTotal: 525,
    bestTotal: 550,
    meetsCount: 2,
    improvement: 15.7
  },
  {
    id: '4',
    name: 'Lisa Chen',
    age: 35,
    gender: 'female',
    weightClass: '63kg',
    division: 'masters',
    location: 'Jacksonville',
    registrationDate: '2025-04-20',
    totalLifts: 15,
    avgTotal: 375,
    bestTotal: 390,
    meetsCount: 7,
    improvement: 5.2
  },
  {
    id: '5',
    name: 'David Brown',
    age: 22,
    gender: 'male',
    weightClass: '105kg',
    division: 'open',
    location: 'Tampa',
    registrationDate: '2025-05-12',
    totalLifts: 9,
    avgTotal: 700,
    bestTotal: 725,
    meetsCount: 4,
    improvement: 10.8
  }
];

const demographicData = [
  { category: 'Age Groups', data: [
    { label: '18-25', value: 45, percentage: 36 },
    { label: '26-35', value: 52, percentage: 42 },
    { label: '36-45', value: 28, percentage: 22 }
  ]},
  { category: 'Gender', data: [
    { label: 'Male', value: 75, percentage: 60 },
    { label: 'Female', value: 50, percentage: 40 }
  ]},
  { category: 'Division', data: [
    { label: 'Open', value: 85, percentage: 68 },
    { label: 'Junior', value: 20, percentage: 16 },
    { label: 'Masters', value: 15, percentage: 12 },
    { label: 'Teen', value: 5, percentage: 4 }
  ]}
];

const performanceMetrics = [
  { metric: 'Average Total', value: '515kg', change: '+5.2%' },
  { metric: 'Improvement Rate', value: '10.3%', change: '+2.1%' },
  { metric: 'Retention Rate', value: '78%', change: '+4.5%' },
  { metric: 'New Athletes', value: '32', change: '+12%' }
];

export const AthleteAnalytics: React.FC<AthleteAnalyticsProps> = ({ meetId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'avgTotal' | 'improvement'>('name');

  const filteredAthletes = mockAthleteData.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDivision = divisionFilter === 'all' || athlete.division === divisionFilter;
    const matchesGender = genderFilter === 'all' || athlete.gender === genderFilter;
    
    return matchesSearch && matchesDivision && matchesGender;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'age':
        return a.age - b.age;
      case 'avgTotal':
        return b.avgTotal - a.avgTotal;
      case 'improvement':
        return b.improvement - a.improvement;
      default:
        return 0;
    }
  });

  const totalAthletes = mockAthleteData.length;
  const avgImprovement = mockAthleteData.reduce((sum, athlete) => sum + athlete.improvement, 0) / totalAthletes;
  const topPerformer = mockAthleteData.reduce((max, athlete) => athlete.improvement > max.improvement ? athlete : max, mockAthleteData[0]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Athletes</div>
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <Users className="text-blue-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{totalAthletes}</div>
          <div className="text-xs text-slate-500 mt-1">Registered athletes</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Avg Improvement</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <TrendingUp className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{avgImprovement.toFixed(1)}%</div>
          <div className="text-xs text-slate-500 mt-1">Across all athletes</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Top Performer</div>
            <div className="p-1.5 rounded-full bg-yellow-500/20">
              <Award className="text-yellow-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{topPerformer.name}</div>
          <div className="text-xs text-slate-500 mt-1">{topPerformer.improvement}% improvement</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Avg Total</div>
            <div className="p-1.5 rounded-full bg-purple-500/20">
              <Target className="text-purple-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {Math.round(mockAthleteData.reduce((sum, athlete) => sum + athlete.avgTotal, 0) / totalAthletes)}kg
          </div>
          <div className="text-xs text-slate-500 mt-1">Average total lifted</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="p-3 bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">{metric.metric}</div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-white">{metric.value}</span>
                <span className={`ml-2 text-xs ${
                  metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {demographicData.map((section, index) => (
          <div key={index} className="bg-slate-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">{section.category}</h3>
            <div className="space-y-3">
              {section.data.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Athlete List */}
      <div className="bg-slate-900 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 md:mb-0">Athlete Performance</h3>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search athletes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Divisions</option>
              <option value="open">Open</option>
              <option value="junior">Junior</option>
              <option value="masters">Masters</option>
              <option value="teen">Teen</option>
            </select>
            
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="avgTotal">Sort by Avg Total</option>
              <option value="improvement">Sort by Improvement</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Athlete</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Performance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAthletes.map((athlete) => (
                <tr key={athlete.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{athlete.name}</div>
                    <div className="flex items-center text-sm text-slate-400">
                      <MapPin size={14} className="mr-1" />
                      {athlete.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-300">
                      {athlete.gender === 'male' ? 'Male' : 'Female'}, {athlete.age} years
                    </div>
                    <div className="text-xs text-slate-500">
                      {athlete.division} • {athlete.weightClass}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-300">
                      Avg: <span className="text-white font-medium">{athlete.avgTotal}kg</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Best: {athlete.bestTotal}kg • {athlete.meetsCount} meets
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${
                        athlete.improvement > 10 ? 'text-green-400' : 
                        athlete.improvement > 5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {athlete.improvement}%
                      </span>
                      <TrendingUp className={`ml-2 ${
                        athlete.improvement > 10 ? 'text-green-400' : 
                        athlete.improvement > 5 ? 'text-yellow-400' : 'text-red-400'
                      }`} size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAthletes.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Users size={24} className="mx-auto mb-2 text-slate-600" />
            <p>No athletes found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
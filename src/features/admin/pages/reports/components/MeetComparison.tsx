import React, { useState } from 'react';
import { BarChart3, Calendar, MapPin, Users, Trophy, TrendingUp, TrendingDown, Filter, Download, ArrowRight } from 'lucide-react';

interface MeetData {
  id: string;
  name: string;
  date: string;
  location: string;
  registrations: number;
  revenue: number;
  expenses: number;
  profit: number;
  avgTotal: number;
  records: number;
  satisfaction: number;
}

interface MeetComparisonProps {
  meetId?: string;
}

const mockMeetData: MeetData[] = [
  {
    id: '1',
    name: 'Tampa Bay Open',
    date: '2025-08-15',
    location: 'Tampa, FL',
    registrations: 45,
    revenue: 3375,
    expenses: 1200,
    profit: 2175,
    avgTotal: 485,
    records: 3,
    satisfaction: 4.7
  },
  {
    id: '2',
    name: 'Florida Championships',
    date: '2025-07-10',
    location: 'Orlando, FL',
    registrations: 67,
    revenue: 5025,
    expenses: 1800,
    profit: 3225,
    avgTotal: 512,
    records: 7,
    satisfaction: 4.8
  },
  {
    id: '3',
    name: 'Summer Classic',
    date: '2025-06-25',
    location: 'Miami, FL',
    registrations: 28,
    revenue: 1955,
    expenses: 800,
    profit: 1155,
    avgTotal: 467,
    records: 2,
    satisfaction: 4.5
  },
  {
    id: '4',
    name: 'Winter Championships',
    date: '2025-01-20',
    location: 'Jacksonville, FL',
    registrations: 31,
    revenue: 2340,
    expenses: 900,
    profit: 1440,
    avgTotal: 498,
    records: 5,
    satisfaction: 4.6
  }
];

const comparisonMetrics = [
  { key: 'registrations', label: 'Registrations', icon: Users },
  { key: 'revenue', label: 'Revenue', icon: Trophy },
  { key: 'profit', label: 'Profit', icon: TrendingUp },
  { key: 'avgTotal', label: 'Avg Total', icon: BarChart3 },
  { key: 'records', label: 'Records', icon: Trophy },
  { key: 'satisfaction', label: 'Satisfaction', icon: Trophy }
];

export const MeetComparison: React.FC<MeetComparisonProps> = ({ meetId }) => {
  const [selectedMeets, setSelectedMeets] = useState<string[]>(['1', '2']);
  const [comparisonMetric, setComparisonMetric] = useState<string>('registrations');
  const [timeRange, setTimeRange] = useState<'all' | 'year' | 'quarter'>('all');

  const filteredMeets = mockMeetData.filter(meet => {
    if (timeRange === 'year') {
      const meetDate = new Date(meet.date);
      const currentYear = new Date().getFullYear();
      return meetDate.getFullYear() === currentYear;
    } else if (timeRange === 'quarter') {
      const meetDate = new Date(meet.date);
      const currentDate = new Date();
      const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
      const meetQuarter = Math.floor(meetDate.getMonth() / 3) + 1;
      return meetDate.getFullYear() === currentDate.getFullYear() && meetQuarter === currentQuarter;
    }
    return true;
  });

  const meetsForComparison = filteredMeets.filter(meet => selectedMeets.includes(meet.id));

  const getComparisonData = () => {
    return meetsForComparison.map(meet => ({
      name: meet.name,
      value: meet[comparisonMetric as keyof MeetData] as number,
      color: meet.id === '1' ? 'bg-blue-500' : 
             meet.id === '2' ? 'bg-green-500' : 
             meet.id === '3' ? 'bg-yellow-500' : 'bg-purple-500'
    }));
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case 'revenue':
      case 'profit':
        return `$${value.toLocaleString()}`;
      case 'avgTotal':
        return `${value}kg`;
      case 'satisfaction':
        return `${value.toFixed(1)}/5`;
      default:
        return value.toString();
    }
  };

  const renderComparisonChart = () => {
    const data = getComparisonData();
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="bg-slate-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          {comparisonMetrics.find(m => m.key === comparisonMetric)?.label} Comparison
        </h3>
        
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-white font-bold">
                  {renderMetricValue(item.value, comparisonMetric)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className={`${item.color} rounded-full h-4 transition-all duration-300`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMeetDetails = () => {
    return (
      <div className="bg-slate-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Meet Details</h3>
        
        <div className="space-y-4">
          {meetsForComparison.map((meet, index) => (
            <div key={meet.id} className="p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{meet.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  meet.id === '1' ? 'bg-blue-500' : 
                  meet.id === '2' ? 'bg-green-500' : 
                  meet.id === '3' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}></div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-slate-400">
                  <Calendar size={14} className="mr-1" />
                  {new Date(meet.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin size={14} className="mr-1" />
                  {meet.location}
                </div>
                <div className="flex items-center text-slate-400">
                  <Users size={14} className="mr-1" />
                  {meet.registrations} athletes
                </div>
                <div className="flex items-center text-slate-400">
                  <Trophy size={14} className="mr-1" />
                  {meet.records} records
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-slate-400">Revenue</div>
                  <div className="text-white font-medium">${meet.revenue.toLocaleString()}</div>
                </div>
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-slate-400">Expenses</div>
                  <div className="text-white font-medium">${meet.expenses.toLocaleString()}</div>
                </div>
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-slate-400">Profit</div>
                  <div className="text-white font-medium">${meet.profit.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparisonTable = () => {
    return (
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Metric</th>
                {meetsForComparison.map((meet, index) => (
                  <th key={meet.id} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {meet.name}
                  </th>
                ))}
                {meetsForComparison.length > 1 && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Change</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {comparisonMetrics.map((metric) => (
                <tr key={metric.key} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-white flex items-center">
                    <metric.icon size={16} className="mr-2 text-slate-400" />
                    {metric.label}
                  </td>
                  
                  {meetsForComparison.map((meet, index) => (
                    <td key={meet.id} className="px-4 py-3 text-sm text-white">
                      {renderMetricValue(meet[metric.key as keyof MeetData] as number, metric.key)}
                    </td>
                  ))}
                  
                  {meetsForComparison.length > 1 && meetsForComparison.length === 2 && (
                    <td className="px-4 py-3 text-sm">
                      {(() => {
                        const currentValue = meetsForComparison[0][metric.key as keyof MeetData] as number;
                        const previousValue = meetsForComparison[1][metric.key as keyof MeetData] as number;
                        const change = getPercentageChange(currentValue, previousValue);
                        
                        return (
                          <div className="flex items-center">
                            {change >= 0 ? (
                              <TrendingUp className="text-green-400 mr-1" size={16} />
                            ) : (
                              <TrendingDown className="text-red-400 mr-1" size={16} />
                            )}
                            <span className={`font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {Math.abs(change).toFixed(1)}%
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Meets</option>
            <option value="year">This Year</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <select
            value={comparisonMetric}
            onChange={(e) => setComparisonMetric(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {comparisonMetrics.map(metric => (
              <option key={metric.key} value={metric.key}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
        
        <button className="flex items-center space-x-2 text-sm bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors">
          <Download size={16} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Meet Selection */}
      <div className="bg-slate-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Meets to Compare</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredMeets.map((meet) => (
            <div 
              key={meet.id}
              onClick={() => {
                if (selectedMeets.includes(meet.id)) {
                  setSelectedMeets(selectedMeets.filter(id => id !== meet.id));
                } else if (selectedMeets.length < 4) {
                  setSelectedMeets([...selectedMeets, meet.id]);
                }
              }}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMeets.includes(meet.id)
                  ? 'bg-blue-600 border border-blue-500'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <div className="font-medium text-white">{meet.name}</div>
              <div className="flex items-center text-sm text-slate-400">
                <Calendar size={14} className="mr-1" />
                {new Date(meet.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-slate-500 mt-3">
          Select up to 4 meets to compare. Currently selected: {selectedMeets.length}
        </div>
      </div>

      {/* Comparison Results */}
      {selectedMeets.length >= 2 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderComparisonChart()}
            {renderMeetDetails()}
          </div>
          
          {renderComparisonTable()}
        </>
      ) : (
        <div className="bg-slate-900 rounded-lg p-8 text-center">
          <BarChart3 size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Select Meets to Compare</h3>
          <p className="text-slate-400">Choose at least 2 meets from the list above to generate a comparison report.</p>
        </div>
      )}
    </div>
  );
};
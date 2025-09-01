import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, PieChart, Filter, Download } from 'lucide-react';

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface MeetRevenue {
  id: string;
  name: string;
  date: string;
  revenue: number;
  registrations: number;
  averageFee: number;
  status: 'completed' | 'upcoming' | 'in-progress';
}

interface RevenueTrackingProps {
  meetId?: string;
}

const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 4500, expenses: 1200, profit: 3300 },
  { month: 'Feb', revenue: 5200, expenses: 1500, profit: 3700 },
  { month: 'Mar', revenue: 4800, expenses: 1300, profit: 3500 },
  { month: 'Apr', revenue: 6100, expenses: 1800, profit: 4300 },
  { month: 'May', revenue: 5800, expenses: 1600, profit: 4200 },
  { month: 'Jun', revenue: 7200, expenses: 2100, profit: 5100 },
  { month: 'Jul', revenue: 8900, expenses: 2400, profit: 6500 }
];

const mockMeetRevenue: MeetRevenue[] = [
  {
    id: '1',
    name: 'Tampa Bay Open',
    date: '2025-08-15',
    revenue: 3375,
    registrations: 45,
    averageFee: 75,
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Florida Championships',
    date: '2025-07-10',
    revenue: 1955,
    registrations: 23,
    averageFee: 85,
    status: 'completed'
  },
  {
    id: '3',
    name: 'Summer Classic',
    date: '2025-06-25',
    revenue: 780,
    registrations: 12,
    averageFee: 65,
    status: 'completed'
  },
  {
    id: '4',
    name: 'Winter Championships',
    date: '2025-01-20',
    revenue: 5025,
    registrations: 67,
    averageFee: 75,
    status: 'completed'
  }
];

export const RevenueTracking: React.FC<RevenueTrackingProps> = ({ meetId }) => {
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

  const totalRevenue = mockRevenueData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = mockRevenueData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = mockRevenueData.reduce((sum, data) => sum + data.profit, 0);
  
  const currentMonth = mockRevenueData[mockRevenueData.length - 1];
  const previousMonth = mockRevenueData[mockRevenueData.length - 2];
  const monthlyGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'upcoming': return 'text-blue-400';
      case 'in-progress': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Revenue Tracking
        </h3>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Revenue</div>
            <div className="flex items-center">
              {monthlyGrowth >= 0 ? (
                <TrendingUp className="text-green-400 mr-1" size={16} />
              ) : (
                <TrendingDown className="text-red-400 mr-1" size={16} />
              )}
              <span className={`text-xs ${monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(monthlyGrowth).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">This year</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Expenses</div>
            <div className="p-1.5 rounded-full bg-slate-800">
              <BarChart3 className="text-slate-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">${totalExpenses.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">This year</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Net Profit</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <DollarSign className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">${totalProfit.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">This year</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-400">
          Revenue {timeRange} breakdown
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('chart')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewType === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Chart View
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewType === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Chart View */}
      {viewType === 'chart' && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <div className="h-64 flex items-end space-x-2">
            {mockRevenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-slate-400 mb-1">{data.month}</div>
                <div className="w-full flex flex-col items-center">
                  <div 
                    className="w-3/4 bg-green-500 rounded-t"
                    style={{ height: `${(data.revenue / 10000) * 100}%` }}
                  ></div>
                  <div 
                    className="w-3/4 bg-red-500 rounded-t"
                    style={{ height: `${(data.expenses / 10000) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  ${data.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-xs text-slate-400">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-xs text-slate-400">Expenses</span>
            </div>
          </div>
        </div>
      )}

      {/* Revenue by Meet */}
      <div className="bg-slate-900 rounded-lg p-4">
        <h4 className="font-medium text-white mb-4">Revenue by Meet</h4>
        <div className="space-y-3">
          {mockMeetRevenue.map((meet) => (
            <div key={meet.id} className="p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-white">{meet.name}</div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar size={14} className="mr-1" />
                    {new Date(meet.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">${meet.revenue.toLocaleString()}</div>
                  <div className={`text-xs ${getStatusColor(meet.status)}`}>
                    {meet.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{meet.registrations} registrations</span>
                <span>${meet.averageFee} avg fee</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
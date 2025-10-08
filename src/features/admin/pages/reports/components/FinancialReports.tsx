import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Filter, Download, CreditCard, Receipt } from 'lucide-react';

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface MeetFinancials {
  id: string;
  name: string;
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  registrations: number;
}

interface PaymentMethod {
  method: string;
  amount: number;
  percentage: number;
  color: string;
}

interface FinancialReportsProps {
  meetId?: string;
}

const mockFinancialData: FinancialData[] = [
  { month: 'Jan', revenue: 4500, expenses: 1200, profit: 3300 },
  { month: 'Feb', revenue: 5200, expenses: 1500, profit: 3700 },
  { month: 'Mar', revenue: 4800, expenses: 1300, profit: 3500 },
  { month: 'Apr', revenue: 6100, expenses: 1800, profit: 4300 },
  { month: 'May', revenue: 5800, expenses: 1600, profit: 4200 },
  { month: 'Jun', revenue: 7200, expenses: 2100, profit: 5100 },
  { month: 'Jul', revenue: 8900, expenses: 2400, profit: 6500 }
];

const mockMeetFinancials: MeetFinancials[] = [
  {
    id: '1',
    name: 'Tampa Bay Open',
    date: '2025-08-15',
    revenue: 3375,
    expenses: 1200,
    profit: 2175,
    registrations: 45
  },
  {
    id: '2',
    name: 'Florida Championships',
    date: '2025-07-10',
    revenue: 5025,
    expenses: 1800,
    profit: 3225,
    registrations: 67
  },
  {
    id: '3',
    name: 'Summer Classic',
    date: '2025-06-25',
    revenue: 1955,
    expenses: 800,
    profit: 1155,
    registrations: 28
  },
  {
    id: '4',
    name: 'Winter Championships',
    date: '2025-01-20',
    revenue: 2340,
    expenses: 900,
    profit: 1440,
    registrations: 31
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  { method: 'Credit Card', amount: 35920, percentage: 75, color: 'bg-blue-500' },
  { method: 'PayPal', amount: 8620, percentage: 18, color: 'bg-yellow-500' },
  { method: 'Bank Transfer', amount: 2395, percentage: 5, color: 'bg-green-500' },
  { method: 'Cash', amount: 955, percentage: 2, color: 'bg-purple-500' }
];

export const FinancialReports: React.FC<FinancialReportsProps> = ({ meetId }) => {
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

  const totalRevenue = mockFinancialData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = mockFinancialData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = mockFinancialData.reduce((sum, data) => sum + data.profit, 0);
  
  const currentMonth = mockFinancialData[mockFinancialData.length - 1];
  const previousMonth = mockFinancialData[mockFinancialData.length - 2];
  const monthlyGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Receipt className="text-slate-400" size={14} />
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

      {/* View Controls */}
      <div className="flex items-center justify-between">
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
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      {viewType === 'chart' && (
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="h-64 flex items-end space-x-2">
            {mockFinancialData.map((data, index) => (
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

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Meet */}
        <div className="bg-slate-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue by Meet</h3>
          <div className="space-y-3">
            {mockMeetFinancials.map((meet) => (
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
                    <div className="text-xs text-slate-400">{meet.registrations} registrations</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Expenses: ${meet.expenses.toLocaleString()}</span>
                  <span>Profit: ${meet.profit.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-slate-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {mockPaymentMethods.map((payment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{payment.method}</span>
                  <span className="text-white">${payment.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`${payment.color} rounded-full h-2`}
                    style={{ width: `${payment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Table */}
      {viewType === 'table' && (
        <div className="bg-slate-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Expenses</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Profit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockFinancialData.map((data, index) => {
                  const margin = ((data.profit / data.revenue) * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-300">{data.month}</td>
                      <td className="px-4 py-3 text-sm font-medium text-white">${data.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">${data.expenses.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-white">${data.profit.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          parseFloat(margin) > 40 ? 'bg-green-500/20 text-green-400' : 
                          parseFloat(margin) > 25 ? 'bg-yellow-500/20 text-yellow-400' : 
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {margin}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
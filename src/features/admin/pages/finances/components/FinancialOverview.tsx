import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Receipt, Users, Calendar, AlertCircle } from 'lucide-react';

interface FinancialOverviewProps {
  meetId?: string;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ meetId }) => {
  // Mock data - in a real app, this would be fetched based on meetId
  const financialData = {
    totalRevenue: 15420,
    pendingPayments: 2340,
    refundedAmount: 425,
    netRevenue: 12995,
    monthlyGrowth: 12.5,
    registrations: 124,
    averageFee: 75,
    upcomingExpenses: 3200
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${financialData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: { value: financialData.monthlyGrowth, label: 'vs last month' },
      color: 'text-green-400'
    },
    {
      title: 'Pending Payments',
      value: `$${financialData.pendingPayments.toLocaleString()}`,
      icon: CreditCard,
      trend: { value: -5.2, label: 'vs last month' },
      color: 'text-yellow-400'
    },
    {
      title: 'Refunded',
      value: `$${financialData.refundedAmount.toLocaleString()}`,
      icon: Receipt,
      trend: { value: 2.1, label: 'vs last month' },
      color: 'text-red-400'
    },
    {
      title: 'Net Revenue',
      value: `$${financialData.netRevenue.toLocaleString()}`,
      icon: TrendingUp,
      trend: { value: 8.7, label: 'vs last month' },
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">Financial Overview</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-slate-800`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              {stat.trend && (
                <div className={`text-xs flex items-center ${
                  stat.trend.value >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend.value >= 0 ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
                </div>
              )}
            </div>
            <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="text-blue-400" size={18} />
            <span className="text-sm text-slate-400">Registrations</span>
          </div>
          <div className="text-xl font-bold text-white">{financialData.registrations}</div>
          <div className="text-sm text-slate-400">
            Avg. ${financialData.averageFee} per registration
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="text-purple-400" size={18} />
            <span className="text-sm text-slate-400">This Month</span>
          </div>
          <div className="text-xl font-bold text-white">$4,890</div>
          <div className="text-sm text-slate-400">
            18.7% growth vs last month
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <AlertCircle className="text-yellow-400" size={18} />
            <span className="text-sm text-slate-400">Upcoming Expenses</span>
          </div>
          <div className="text-xl font-bold text-white">${financialData.upcomingExpenses.toLocaleString()}</div>
          <div className="text-sm text-slate-400">
            Venue, equipment, staff
          </div>
        </div>
      </div>
    </div>
  );
};
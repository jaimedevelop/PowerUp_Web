// FinancialSummary.tsx
import React from 'react';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

export const FinancialSummary: React.FC = () => {
  const financialData = {
    totalRevenue: 15420,
    pendingPayments: 2340,
    monthlyGrowth: 12.5,
    recentTransactions: [
      { id: '1', amount: 75, description: 'Registration - Tampa Bay Open', date: '2025-07-10' },
      { id: '2', amount: 85, description: 'Registration - Florida State Championships', date: '2025-07-09' },
      { id: '3', amount: 65, description: 'Registration - Summer Strength Classic', date: '2025-07-08' }
    ]
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Financial Summary</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign size={20} className="text-green-400" />
            <span className="text-sm text-slate-400">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${financialData.totalRevenue.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard size={20} className="text-yellow-400" />
            <span className="text-sm text-slate-400">Pending</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${financialData.pendingPayments.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp size={16} className="text-green-400" />
        <span className="text-sm text-green-400">+{financialData.monthlyGrowth}% this month</span>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Recent Transactions</h4>
        {financialData.recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{transaction.description}</span>
            <span className="text-green-400">${transaction.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
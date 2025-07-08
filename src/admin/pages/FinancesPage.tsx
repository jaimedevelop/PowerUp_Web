// src/admin/pages/FinancesPage.tsx
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Receipt } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { Card } from '../components/shared/Card';

export const FinancesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Finances"
        subtitle="Track revenue, payments, and financial performance"
        icon={DollarSign}
      />

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Payments"
          value="$2,340"
          icon={CreditCard}
          trend={{ value: -5.2, label: 'vs last month' }}
        />
        <StatCard
          title="This Month"
          value="$4,890"
          icon={TrendingUp}
          trend={{ value: 18.7, label: 'vs last month' }}
        />
        <StatCard
          title="Refunds Issued"
          value="$425"
          icon={Receipt}
          trend={{ value: 2.1, label: 'vs last month' }}
        />
      </div>

      {/* Financial Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {[
              { id: '1', athlete: 'Sarah Johnson', meet: 'Tampa Bay Open', amount: 75, status: 'completed', date: '2025-07-10' },
              { id: '2', athlete: 'Mike Wilson', meet: 'Florida Championships', amount: 85, status: 'pending', date: '2025-07-09' },
              { id: '3', athlete: 'Lisa Chen', meet: 'Summer Classic', amount: 65, status: 'completed', date: '2025-07-08' },
              { id: '4', athlete: 'David Brown', meet: 'Tampa Bay Open', amount: 75, status: 'refunded', date: '2025-07-07' }
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{transaction.athlete}</h4>
                  <p className="text-sm text-slate-400">{transaction.meet}</p>
                  <p className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">${transaction.amount}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Revenue by Meet</h3>
          <div className="space-y-4">
            {[
              { name: 'Tampa Bay Open', revenue: 3375, registrations: 45, avgFee: 75 },
              { name: 'Florida Championships', revenue: 1955, registrations: 23, avgFee: 85 },
              { name: 'Summer Classic', revenue: 780, registrations: 12, avgFee: 65 },
              { name: 'Winter Championships', revenue: 5025, registrations: 67, avgFee: 75 }
            ].map((meet, index) => (
              <div key={index} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{meet.name}</h4>
                  <span className="text-lg font-bold text-green-400">${meet.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{meet.registrations} registrations</span>
                  <span>${meet.avgFee} avg fee</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

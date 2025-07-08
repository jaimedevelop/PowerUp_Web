import React from 'react';
import { CreditCard, Calendar, DollarSign, Settings, Plus, CheckCircle } from 'lucide-react';

export const CoachingPayments: React.FC = () => {
  const activeSubscriptions = [
    {
      id: 1,
      coach: 'Sarah Johnson',
      avatar: 'bg-gradient-to-r from-purple-500 to-pink-500',
      plan: 'Monthly Coaching',
      amount: 150,
      nextPayment: 'Feb 15, 2025',
      status: 'active'
    },
    {
      id: 2,
      coach: 'Juggernaut Training',
      avatar: 'bg-gradient-to-r from-green-500 to-teal-500',
      plan: 'Program Access',
      amount: 125,
      nextPayment: 'Feb 12, 2025',
      status: 'active'
    }
  ];

  const recentPayments = [
    {
      id: 1,
      description: 'Sarah Johnson - Monthly Coaching',
      amount: 150,
      date: 'Jan 15, 2025',
      status: 'paid'
    },
    {
      id: 2,
      description: 'Juggernaut Training - Program Access',
      amount: 125,
      date: 'Jan 12, 2025',
      status: 'paid'
    },
    {
      id: 3,
      description: 'Sarah Johnson - Monthly Coaching',
      amount: 150,
      date: 'Dec 15, 2024',
      status: 'paid'
    }
  ];

  const totalMonthly = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Coaching Payments</h3>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          Manage All
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 mb-6 border border-purple-700/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{activeSubscriptions.length}</p>
            <p className="text-sm text-purple-300">Active Coaches</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">${totalMonthly}</p>
            <p className="text-sm text-purple-300">Monthly Total</p>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="mb-6">
        <h4 className="font-medium text-white mb-3">Active Subscriptions</h4>
        <div className="space-y-3">
          {activeSubscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${subscription.avatar} rounded-full mr-3 flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">
                    {subscription.coach.charAt(0)}
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-white">{subscription.coach}</h5>
                  <p className="text-sm text-slate-400">{subscription.plan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">${subscription.amount}/mo</p>
                <p className="text-xs text-slate-400">Next: {subscription.nextPayment.split(',')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-white">Payment Method</h4>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-slate-400 mr-3" />
            <div>
              <p className="font-medium text-white">•••• •••• •••• 4242</p>
              <p className="text-sm text-slate-400">Expires 12/27</p>
            </div>
          </div>
          <span className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-xs border border-green-700/30">
            Default
          </span>
        </div>
      </div>

      {/* Recent Payments */}
      <div>
        <h4 className="font-medium text-white mb-3">Recent Payments</h4>
        <div className="space-y-2">
          {recentPayments.slice(0, 3).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-slate-300">{payment.description}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">${payment.amount}</p>
                <p className="text-xs text-slate-400">{payment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
        View Full Payment History
      </button>
    </div>
  );
};
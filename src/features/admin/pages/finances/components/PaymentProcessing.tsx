import React, { useState } from 'react';
import { CreditCard, Check, X, Clock, Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';

interface Payment {
  id: string;
  athleteName: string;
  meetName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  date: string;
  transactionId: string;
  earlyBird: boolean;
}

interface PaymentProcessingProps {
  meetId?: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    athleteName: 'Sarah Johnson',
    meetName: 'Tampa Bay Open',
    amount: 75,
    status: 'completed',
    paymentMethod: 'credit-card',
    date: '2025-07-10',
    transactionId: 'TRX-12345',
    earlyBird: true
  },
  {
    id: '2',
    athleteName: 'Mike Wilson',
    meetName: 'Florida Championships',
    amount: 85,
    status: 'pending',
    paymentMethod: 'paypal',
    date: '2025-07-09',
    transactionId: 'TRX-12346',
    earlyBird: false
  },
  {
    id: '3',
    athleteName: 'Lisa Chen',
    meetName: 'Summer Classic',
    amount: 65,
    status: 'completed',
    paymentMethod: 'bank-transfer',
    date: '2025-07-08',
    transactionId: 'TRX-12347',
    earlyBird: true
  },
  {
    id: '4',
    athleteName: 'David Brown',
    meetName: 'Tampa Bay Open',
    amount: 75,
    status: 'refunded',
    paymentMethod: 'credit-card',
    date: '2025-07-07',
    transactionId: 'TRX-12348',
    earlyBird: false
  },
  {
    id: '5',
    athleteName: 'Robert Davis',
    meetName: 'Florida Championships',
    amount: 85,
    status: 'failed',
    paymentMethod: 'credit-card',
    date: '2025-07-06',
    transactionId: 'TRX-12349',
    earlyBird: false
  }
];

export const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ meetId }) => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'refunded': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit-card': return <CreditCard size={16} className="text-blue-400" />;
      case 'paypal': return <div className="text-yellow-400 text-xs font-bold">PP</div>;
      case 'bank-transfer': return <div className="text-green-400 text-xs font-bold">BT</div>;
      default: return <div className="text-slate-400 text-xs">?</div>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.meetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRefund = (id: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: 'refunded' as const } : payment
    ));
  };

  const handleRetry = (id: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: 'pending' as const } : payment
    ));
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <CreditCard className="mr-2" size={20} />
          Payment Processing
        </h3>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-full bg-green-500/20">
              <Check className="text-green-400" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <p className="text-xl font-bold text-white">${pendingRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-full bg-yellow-500/20">
              <Clock className="text-yellow-400" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Refunded</p>
              <p className="text-xl font-bold text-white">${refundedAmount.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-500/20">
              <RefreshCw className="text-blue-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Athlete</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Meet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{payment.athleteName}</div>
                    <div className="text-xs text-slate-400">{payment.transactionId}</div>
                    {payment.earlyBird && (
                      <div className="text-xs text-green-400 mt-1">Early Bird</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{payment.meetName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">${payment.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getMethodIcon(payment.paymentMethod)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                      {payment.status === 'completed' && (
                        <button
                          onClick={() => handleRefund(payment.id)}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Issue Refund"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                      {payment.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(payment.id)}
                          className="p-1 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors"
                          title="Retry Payment"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <CreditCard size={24} className="mx-auto mb-2 text-slate-600" />
            <p>No payments found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
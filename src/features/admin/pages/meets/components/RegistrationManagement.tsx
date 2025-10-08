import React, { useState } from 'react';
import { UserCheck, Check, X, Mail, Phone, Calendar, Clock, DollarSign, Search, Filter, Download } from 'lucide-react';

interface Registration {
  id: string;
  athleteName: string;
  email: string;
  phone?: string;
  team?: string;
  weightClass: string;
  division: string;
  registrationDate: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  status: 'pending' | 'approved' | 'rejected';
  earlyBird: boolean;
  amount: number;
}

const mockRegistrations: Registration[] = [
  {
    id: '1',
    athleteName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 123-4567',
    team: 'Powerlifting Gym',
    weightClass: 'Female 57kg',
    division: 'Open',
    registrationDate: '2025-07-10',
    paymentStatus: 'paid',
    status: 'approved',
    earlyBird: true,
    amount: 65
  },
  {
    id: '2',
    athleteName: 'Mike Wilson',
    email: 'mike@example.com',
    team: 'Iron Warriors',
    weightClass: 'Male 83kg',
    division: 'Junior',
    registrationDate: '2025-07-09',
    paymentStatus: 'pending',
    status: 'pending',
    earlyBird: false,
    amount: 85
  },
  {
    id: '3',
    athleteName: 'Lisa Chen',
    email: 'lisa@example.com',
    phone: '(555) 987-6543',
    team: 'Strength Academy',
    weightClass: 'Female 63kg',
    division: 'Masters 1',
    registrationDate: '2025-07-08',
    paymentStatus: 'paid',
    status: 'approved',
    earlyBird: true,
    amount: 65
  }
];

interface RegistrationManagementProps {
  meetId: string;
}

export const RegistrationManagement: React.FC<RegistrationManagementProps> = ({ meetId }) => {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'refunded': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const handleApprove = (id: string) => {
    setRegistrations(registrations.map(reg => 
      reg.id === id ? { ...reg, status: 'approved' as const } : reg
    ));
  };

  const handleReject = (id: string) => {
    setRegistrations(registrations.map(reg => 
      reg.id === id ? { ...reg, status: 'rejected' as const } : reg
    ));
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (reg.team && reg.team.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || reg.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = registrations
    .filter(reg => reg.paymentStatus === 'paid')
    .reduce((sum, reg) => sum + reg.amount, 0);

  const pendingApprovals = registrations.filter(reg => reg.status === 'pending').length;
  const pendingPayments = registrations.filter(reg => reg.paymentStatus === 'pending').length;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <UserCheck className="mr-2" size={20} />
          Registration Management
        </h3>
        <button className="flex items-center space-x-2 text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Registrations</p>
              <p className="text-xl font-bold text-white">{registrations.length}</p>
            </div>
            <UserCheck className="text-blue-400" size={20} />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending Approvals</p>
              <p className="text-xl font-bold text-white">{pendingApprovals}</p>
            </div>
            <Clock className="text-yellow-400" size={20} />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-green-400" size={20} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search registrations..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Athlete</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Registration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{registration.athleteName}</div>
                    <div className="text-sm text-slate-400 flex items-center">
                      <Mail size={12} className="mr-1" />
                      {registration.email}
                    </div>
                    {registration.phone && (
                      <div className="text-sm text-slate-400 flex items-center">
                        <Phone size={12} className="mr-1" />
                        {registration.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="text-white">{registration.weightClass}</div>
                      <div className="text-slate-400">{registration.division}</div>
                      {registration.team && (
                        <div className="text-slate-400">{registration.team}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1 text-slate-400" />
                        <span className="text-slate-400">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={`mt-1 ${getStatusColor(registration.status)}`}>
                        {registration.status.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="text-white">${registration.amount}</div>
                      <div className={`mt-1 ${getPaymentStatusColor(registration.paymentStatus)}`}>
                        {registration.paymentStatus.toUpperCase()}
                      </div>
                      {registration.earlyBird && (
                        <div className="text-xs text-green-400 mt-1">Early Bird</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {registration.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(registration.id)}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(registration.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRegistrations.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <UserCheck size={24} className="mx-auto mb-2 text-slate-600" />
            <p>No registrations found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
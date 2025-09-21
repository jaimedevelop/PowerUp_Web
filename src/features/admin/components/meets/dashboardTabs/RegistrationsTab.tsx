import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  Dumbbell,
  Users,
  RefreshCw,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MeetData } from '../../../../../firebase';
import { AdminRegistrationService } from '../../../../../services/admin/registrations';

interface Registration {
  id: string;
  userId: string;
  meetId: string;
  athleteInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  competitionInfo: {
    weightClass: string;
    division: string;
    equipment: string;
    estimatedTotal?: number;
    openingAttempts?: {
      squat: number;
      bench: number;
      deadlift: number;
    };
  };
  registrationDate: any; // Firebase Timestamp
  status: 'pending' | 'approved' | 'confirmed' | 'checked-in' | 'weighed-in' | 'competed' | 'withdrawn' | 'rejected' | 'waitlisted';
  paymentStatus?: 'unpaid' | 'paid' | 'partial' | 'refunded' | 'waived';
  specialNotes?: string;
}

interface RegistrationsTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const RegistrationsTab: React.FC<RegistrationsTabProps> = ({ meet, meetId, onRefresh }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Fetch registrations from Firebase
  useEffect(() => {
    fetchRegistrations();
  }, [meetId, searchTerm, selectedEquipment, selectedWeightClass, selectedDivision, selectedStatus]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const regs = await AdminRegistrationService.getMeetRegistrations(meetId, {
        searchTerm,
        equipment: selectedEquipment !== 'all' ? selectedEquipment : undefined,
        weightClass: selectedWeightClass !== 'all' ? selectedWeightClass : undefined,
        division: selectedDivision !== 'all' ? selectedDivision : undefined,
        status: selectedStatus !== 'all' ? selectedStatus as any : undefined,
      });
      setRegistrations(regs);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRegistration = async (registrationId: string) => {
    setProcessingId(registrationId);
    setOpenDropdownId(null);
    
    try {
      await AdminRegistrationService.updateRegistrationStatus(
        meetId,
        registrationId,
        'approved',
        'Registration approved by meet director'
      );
      
      // Refresh the registrations list
      await fetchRegistrations();
      
      // Show success message (you can add a toast notification here)
      console.log(`Registration ${registrationId} approved successfully`);
    } catch (error) {
      console.error('Failed to approve registration:', error);
      // Show error message (you can add a toast notification here)
    } finally {
      setProcessingId(null);
    }
  };

  const handleActionClick = async (registrationId: string, action: string) => {
    setOpenDropdownId(null);
    
    switch(action) {
      case 'accept':
        await handleAcceptRegistration(registrationId);
        break;
      case 'contact':
        // TODO: Implement contact athlete
        console.log(`Contact athlete: ${registrationId}`);
        break;
      case 'refund':
        // TODO: Implement refund
        console.log(`Process refund: ${registrationId}`);
        break;
      case 'special':
        // TODO: Implement special circumstances
        console.log(`Special circumstances: ${registrationId}`);
        break;
      case 'remove':
        // TODO: Implement remove from meet
        if (confirm('Are you sure you want to remove this athlete from the meet?')) {
          try {
            await AdminRegistrationService.removeRegistration(
              meetId,
              registrationId,
              'Removed by meet director'
            );
            await fetchRegistrations();
          } catch (error) {
            console.error('Failed to remove registration:', error);
          }
        }
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'confirmed': return 'bg-green-500';
      case 'checked-in': return 'bg-blue-500';
      case 'weighed-in': return 'bg-purple-500';
      case 'competed': return 'bg-gray-500';
      case 'withdrawn': return 'bg-red-500';
      case 'rejected': return 'bg-red-500';
      case 'waitlisted': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };

  const formatDate = (date: Date | any) => {
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Count registrations by status
  const statusCounts = {
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved' || r.status === 'confirmed').length,
    total: registrations.length
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-slate-400 animate-spin" />
          <span className="ml-2 text-slate-400">Loading registrations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Stats */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Registration Management</h3>
            <p className="text-sm text-slate-400 mt-1">
              {registrations.length} total athletes
              {statusCounts.pending > 0 && (
                <span className="ml-2 text-yellow-400">
                  ({statusCounts.pending} pending approval)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              onRefresh();
              fetchRegistrations();
            }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-xl font-bold text-white">{statusCounts.total}</p>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Approved</p>
                <p className="text-xl font-bold text-green-400">{statusCounts.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Pending</p>
                <p className="text-xl font-bold text-yellow-400">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="checked-in">Checked In</option>
            <option value="weighed-in">Weighed In</option>
            <option value="withdrawn">Withdrawn</option>
          </select>

          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm text-white"
          >
            <option value="all">All Equipment</option>
            {meet.equipment?.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>

          <select
            value={selectedWeightClass}
            onChange={(e) => setSelectedWeightClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm text-white"
          >
            <option value="all">All Weight Classes</option>
            {meet.weightClasses?.map(wc => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm text-white"
          >
            <option value="all">All Divisions</option>
            {meet.divisions?.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-3">
        {registrations.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">
              {searchTerm ? 'No athletes found matching your search' : 'No registrations yet'}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Athletes will appear here as they register'}
            </p>
          </div>
        ) : (
          registrations.map((registration) => (
            <div
              key={registration.id}
              className={`bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors ${
                processingId === registration.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Athlete Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {registration.athleteInfo.firstName[0]}{registration.athleteInfo.lastName[0]}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-white font-medium">
                        {registration.athleteInfo.firstName} {registration.athleteInfo.lastName}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(registration.status)}`}>
                        {registration.status.replace('-', ' ').toUpperCase()}
                      </div>
                      {registration.paymentStatus && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          registration.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                        }`}>
                          {registration.paymentStatus.toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{registration.athleteInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{registration.athleteInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Registered {formatDate(registration.registrationDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competition Details */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400">Weight Class</div>
                    <div className="text-white font-medium">{registration.competitionInfo.weightClass}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-slate-400">Division</div>
                    <div className="text-white font-medium">{registration.competitionInfo.division}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-slate-400">Equipment</div>
                    <div className="text-white font-medium">{registration.competitionInfo.equipment}</div>
                  </div>

                  {registration.competitionInfo.estimatedTotal && (
                    <div className="text-center">
                      <div className="text-slate-400">Est. Total</div>
                      <div className="text-white font-medium">{registration.competitionInfo.estimatedTotal}kg</div>
                    </div>
                  )}

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === registration.id ? null : registration.id)}
                      disabled={processingId === registration.id}
                      className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {processingId === registration.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </button>
                    
                    {openDropdownId === registration.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleActionClick(registration.id, 'accept')}
                              className="w-full text-left px-3 py-2 text-sm text-green-400 hover:bg-slate-600 hover:text-green-300 transition-colors font-medium"
                            >
                              ✓ Accept Registration
                            </button>
                            <div className="border-t border-slate-600"></div>
                          </>
                        )}
                        <button
                          onClick={() => handleActionClick(registration.id, 'contact')}
                          className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                        >
                          Contact Athlete
                        </button>
                        <button
                          onClick={() => handleActionClick(registration.id, 'refund')}
                          className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                        >
                          Process Refund
                        </button>
                        <button
                          onClick={() => handleActionClick(registration.id, 'special')}
                          className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                        >
                          Special Circumstances
                        </button>
                        <div className="border-t border-slate-600"></div>
                        <button
                          onClick={() => handleActionClick(registration.id, 'remove')}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-600 hover:text-red-300 transition-colors"
                        >
                          Remove from Meet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistrationsTab;
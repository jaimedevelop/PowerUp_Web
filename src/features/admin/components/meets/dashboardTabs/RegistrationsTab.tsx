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
  RefreshCw
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
  status: 'confirmed' | 'checked-in' | 'weighed-in' | 'competed';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Mock data for now - replace with Firebase fetch
  useEffect(() => {
    const fetchRegistrations = async () => {
  setLoading(true);
  try {
    const regs = await AdminRegistrationService.getMeetRegistrations(meetId, {
      searchTerm,
      equipment: selectedEquipment !== 'all' ? selectedEquipment : undefined,
      weightClass: selectedWeightClass !== 'all' ? selectedWeightClass : undefined,
      division: selectedDivision !== 'all' ? selectedDivision : undefined,
    });
    setRegistrations(regs);
  } catch (error) {
    console.error('Failed to load registrations:', error);
  } finally {
    setLoading(false);
  }
};

    fetchRegistrations();
  }, [meetId]);

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      reg.athleteInfo.firstName.toLowerCase().includes(searchLower) ||
      reg.athleteInfo.lastName.toLowerCase().includes(searchLower) ||
      reg.athleteInfo.email.toLowerCase().includes(searchLower);
    
    const matchesEquipment = selectedEquipment === 'all' || reg.competitionInfo.equipment === selectedEquipment;
    const matchesWeightClass = selectedWeightClass === 'all' || reg.competitionInfo.weightClass === selectedWeightClass;
    const matchesDivision = selectedDivision === 'all' || reg.competitionInfo.division === selectedDivision;
    
    return matchesSearch && matchesEquipment && matchesWeightClass && matchesDivision;
  });

  const handleActionClick = (registrationId: string, action: 'contact' | 'refund' | 'special' | 'remove') => {
    setOpenDropdownId(null);
    // TODO: Implement actions
    console.log(`Action: ${action} for registration: ${registrationId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'checked-in': return 'bg-blue-500';
      case 'weighed-in': return 'bg-purple-500';
      case 'competed': return 'bg-gray-500';
      default: return 'bg-slate-500';
    }
  };

  const formatDate = (date: Date | any) => {
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
              {filteredRegistrations.length} of {registrations.length} athletes
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
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
        {filteredRegistrations.length === 0 ? (
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
          filteredRegistrations.map((registration) => (
            <div
              key={registration.id}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
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
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {openDropdownId === registration.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
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
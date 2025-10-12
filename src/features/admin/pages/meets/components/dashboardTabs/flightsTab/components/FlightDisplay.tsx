// meets/components/dashboardTabs/flightsTab/components/FlightDisplay.tsx

import React, { useState } from 'react';
import { Search, Users, UserCheck, AlertCircle } from 'lucide-react';
import { Flight, FlightAssignment } from '../types/flight-types';
import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';
import { FlightCard } from './FlightCard';
import { FlightValidationAlert } from './FlightValidationAlert';
import { AthleteFlightCard } from './AthleteFlightCard';

interface FlightDisplayProps {
  flights: Flight[];
  registrations: AdminRegistrationView[];
  assignments: Record<string, FlightAssignment>;
  locked: boolean;
  validationIssues: any[];
  onMoveAthlete: (athleteId: string, toFlightId: string) => Promise<void>;
  onUnassignAthlete: (athleteId: string) => Promise<void>;
}

export const FlightDisplay: React.FC<FlightDisplayProps> = ({
  flights,
  registrations,
  assignments,
  locked,
  validationIssues,
  onMoveAthlete,
  onUnassignAthlete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedAthleteId, setDraggedAthleteId] = useState<string | null>(null);
  const [draggedFromFlightId, setDraggedFromFlightId] = useState<string | null>(null);

  // Get unassigned athletes
  const assignedIds = new Set(Object.keys(assignments));
  const unassignedAthletes = registrations.filter(
    r => !assignedIds.has(r.id) && (r.status === 'approved' || r.status === 'confirmed')
  );

  // Filter registrations by search
  const filterAthletes = (athletes: AdminRegistrationView[]) => {
    if (!searchTerm) return athletes;
    
    const term = searchTerm.toLowerCase();
    return athletes.filter(a => 
      a.athleteInfo.firstName.toLowerCase().includes(term) ||
      a.athleteInfo.lastName.toLowerCase().includes(term) ||
      a.competitionInfo.weightClass.toLowerCase().includes(term) ||
      a.competitionInfo.division.toLowerCase().includes(term)
    );
  };

  // Get athletes for a specific flight
  const getAthletesForFlight = (flight: Flight): AdminRegistrationView[] => {
    return flight.athleteIds
      .map(id => registrations.find(r => r.id === id))
      .filter((a): a is AdminRegistrationView => a !== undefined);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, athleteId: string, fromFlightId?: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('athleteId', athleteId);
    setDraggedAthleteId(athleteId);
    setDraggedFromFlightId(fromFlightId || null);
  };

  const handleDragEnd = () => {
    setDraggedAthleteId(null);
    setDraggedFromFlightId(null);
  };

  const handleDrop = async (toFlightId: string, athleteId: string) => {
    if (locked) return;
    
    await onMoveAthlete(athleteId, toFlightId);
    handleDragEnd();
  };

  const handleRemoveFromFlight = async (athleteId: string) => {
    if (locked) return;
    
    if (confirm('Remove this athlete from their flight?')) {
      await onUnassignAthlete(athleteId);
    }
  };

  // Calculate stats
  const totalAssigned = Object.keys(assignments).length;
  const totalApproved = registrations.filter(
    r => r.status === 'approved' || r.status === 'confirmed'
  ).length;

  if (flights.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <Users className="h-16 w-16 mx-auto mb-4 text-slate-600" />
        <h3 className="text-xl font-semibold text-white mb-2">No Flights Created</h3>
        <p className="text-slate-400 mb-4">
          Use the Auto-Generate button above to create flights based on your configuration
        </p>
        <p className="text-sm text-slate-500">
          Flights will organize athletes by weight class and gender for optimal competition flow
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-xs text-slate-400">Total Flights</p>
              <p className="text-2xl font-bold text-white">{flights.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Assigned</p>
              <p className="text-2xl font-bold text-green-400">{totalAssigned}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Unassigned</p>
              <p className="text-2xl font-bold text-yellow-400">{unassignedAthletes.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Athletes</p>
              <p className="text-2xl font-bold text-slate-300">{totalApproved}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search athletes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <FlightValidationAlert issues={validationIssues} />
      )}

      {/* Unassigned Athletes */}
      {unassignedAthletes.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4 border-2 border-yellow-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <h4 className="text-md font-semibold text-white">
              Unassigned Athletes ({unassignedAthletes.length})
            </h4>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            These athletes are approved but not assigned to any flight. Drag them to a flight below.
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filterAthletes(unassignedAthletes).map(athlete => (
              <AthleteFlightCard
                key={athlete.id}
                athlete={athlete}
                locked={locked}
                draggable={!locked}
                onDragStart={(e) => handleDragStart(e, athlete.id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      )}

      {/* Flights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {flights.map(flight => {
          const flightAthletes = getAthletesForFlight(flight);
          const filteredAthletes = filterAthletes(flightAthletes);
          
          return (
            <FlightCard
              key={flight.id}
              flight={flight}
              athletes={filteredAthletes}
              locked={locked}
              onDrop={(flightId, athleteId) => handleDrop(flightId, athleteId)}
              onRemoveAthlete={handleRemoveFromFlight}
              onDragStart={(e, athleteId) => handleDragStart(e, athleteId, flight.id)}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </div>

      {/* Empty State when all filtered out */}
      {searchTerm && flights.every(f => filterAthletes(getAthletesForFlight(f)).length === 0) && (
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          <Search className="h-12 w-12 mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400">No athletes found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};
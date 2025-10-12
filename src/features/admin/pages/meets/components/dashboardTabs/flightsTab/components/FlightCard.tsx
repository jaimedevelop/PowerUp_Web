// meets/components/dashboardTabs/flightsTab/components/FlightCard.tsx

import React, { useState } from 'react';
import { Users, Lock, User } from 'lucide-react';
import { Flight } from '../types/flight-types';
import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';
import { AthleteFlightCard } from './AthleteFlightCard';

interface FlightCardProps {
  flight: Flight;
  athletes: AdminRegistrationView[];
  locked: boolean;
  onDrop?: (flightId: string, athleteId: string) => void;
  onRemoveAthlete?: (athleteId: string) => void;
  onDragStart?: (e: React.DragEvent, athleteId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  athletes,
  locked,
  onDrop,
  onRemoveAthlete,
  onDragStart,
  onDragEnd,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (locked) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (locked) return;
    e.preventDefault();
    setIsDragOver(false);
    
    const athleteId = e.dataTransfer.getData('athleteId');
    if (athleteId && onDrop) {
      onDrop(flight.id, athleteId);
    }
  };

  // Get unique weight classes in this flight
  const weightClasses = [...new Set(athletes.map(a => a.competitionInfo.weightClass))];

  // Determine gender color
  const genderColor = flight.gender === 'male' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        bg-slate-800 rounded-xl p-4 border-2 transition-all
        ${isDragOver && !locked 
          ? 'border-purple-500 bg-purple-500/5 scale-[1.02]' 
          : 'border-slate-700'
        }
        ${locked ? 'opacity-75' : ''}
      `}
    >
      {/* Flight Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${genderColor} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">
              {flight.name.split(' ')[1]}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{flight.name}</h3>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {flight.gender === 'male' ? 'Men' : 'Women'}
              </span>
              <span>•</span>
              <span>{athletes.length} athletes</span>
            </div>
          </div>
        </div>

        {locked && (
          <div className="px-2 py-1 bg-slate-700 rounded flex items-center space-x-1">
            <Lock className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-400">Locked</span>
          </div>
        )}
      </div>

      {/* Weight Class Summary */}
      {weightClasses.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {weightClasses.map(wc => (
            <span
              key={wc}
              className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
            >
              {wc}
              kg
            </span>
          ))}
        </div>
      )}

      {/* Athletes List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {athletes.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No athletes assigned</p>
            {!locked && <p className="text-xs mt-1">Drag athletes here to assign</p>}
          </div>
        ) : (
          athletes.map(athlete => (
            <AthleteFlightCard
              key={athlete.id}
              athlete={athlete}
              locked={locked}
              draggable={!locked}
              onRemove={onRemoveAthlete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>

      {/* Drop Zone Indicator */}
      {isDragOver && !locked && (
        <div className="mt-4 p-4 border-2 border-dashed border-purple-500 rounded-lg bg-purple-500/5 text-center">
          <p className="text-sm text-purple-300">Drop here to assign athlete</p>
        </div>
      )}
    </div>
  );
};
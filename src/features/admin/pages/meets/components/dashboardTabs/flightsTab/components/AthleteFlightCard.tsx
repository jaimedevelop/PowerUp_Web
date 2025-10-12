// meets/components/dashboardTabs/flightsTab/components/AthleteFlightCard.tsx

import React from 'react';
import { GripVertical, X } from 'lucide-react';
import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';

interface AthleteFlightCardProps {
  athlete: AdminRegistrationView;
  locked: boolean;
  draggable: boolean;
  onRemove?: (athleteId: string) => void;
  onDragStart?: (e: React.DragEvent, athleteId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const AthleteFlightCard: React.FC<AthleteFlightCardProps> = ({
  athlete,
  locked,
  draggable,
  onRemove,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      draggable={draggable && !locked}
      onDragStart={(e) => onDragStart?.(e, athlete.id)}
      onDragEnd={onDragEnd}
      className={`
        flex items-center justify-between p-2 bg-slate-700 rounded-lg border border-slate-600
        ${draggable && !locked ? 'cursor-move hover:bg-slate-650 hover:border-slate-500' : ''}
        ${locked ? 'opacity-60 cursor-not-allowed' : ''}
        transition-colors
      `}
    >
      {/* Left: Drag Handle + Athlete Info */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {draggable && !locked && (
          <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-white truncate">
              {athlete.athleteInfo.firstName} {athlete.athleteInfo.lastName}
            </p>
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
              {athlete.competitionInfo.weightClass}kg
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {athlete.competitionInfo.division} • {athlete.competitionInfo.equipment}
          </p>
        </div>
      </div>

      {/* Right: Remove Button */}
      {!locked && onRemove && (
        <button
          onClick={() => onRemove(athlete.id)}
          className="ml-2 p-1 text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove from flight"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
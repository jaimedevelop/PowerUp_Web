// meets/components/dashboardTabs/flightsTab/FlightsTab.tsx

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { MeetData } from '../../../../../../../firebase';
import { AdminRegistrationService } from '../../../../../../../services/admin/registrations';
import { AdminFlightService } from './services/AdminFlightService';
import { FlightConfiguration } from './components/FlightConfiguration';
import { FlightDisplay } from './components/FlightDisplay';
import { 
  FlightConfiguration as FlightConfigType,
  Flight,
  FlightAssignment 
} from './types/flight-types';

interface FlightsTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const FlightsTab: React.FC<FlightsTabProps> = ({ meet, meetId, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [config, setConfig] = useState<FlightConfigType>({
    athletesPerFlight: 15,
    separateByGender: true,
    priorityOrder: ['weightClass'],
    autoAssignmentEnabled: false,
    locked: false,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [assignments, setAssignments] = useState<Record<string, FlightAssignment>>({});
  const [validationIssues, setValidationIssues] = useState<any[]>([]);

  // Load all data
  useEffect(() => {
    loadFlightData();
  }, [meetId]);

  const loadFlightData = async () => {
    setLoading(true);
    try {
      // Load registrations
      const regs = await AdminRegistrationService.getMeetRegistrations(meetId, {
        status: 'approved',
      });
      setRegistrations(regs);

      // Load flight configuration
      const flightConfig = await AdminFlightService.getFlightConfiguration(meetId);
      setConfig(flightConfig);

      // Load flights
      const flightData = await AdminFlightService.getFlights(meetId);
      setFlights(flightData);

      // Load assignments
      const assignmentData = await AdminFlightService.getFlightAssignments(meetId);
      setAssignments(assignmentData);

      // Validate flights
      const issues = await AdminFlightService.validateCurrentFlights(meetId, regs);
      setValidationIssues(issues);

    } catch (error) {
      console.error('Error loading flight data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save configuration
  const handleSaveConfig = async (newConfig: FlightConfigType) => {
    try {
      await AdminFlightService.saveFlightConfiguration(meetId, newConfig);
      setConfig(newConfig);
      
      // Show success toast (you can add a toast notification here)
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  // Auto-generate flights
  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await AdminFlightService.autoGenerateFlights(
        meetId,
        registrations,
        config
      );

      if (result.success) {
        setFlights(result.flights);
        setAssignments(result.assignments);
        setConfig(prev => ({ 
          ...prev, 
          autoAssignmentEnabled: true,
          lastGeneratedAt: new Date() 
        }));
        
        // Validate new flights
        const issues = await AdminFlightService.validateCurrentFlights(meetId, registrations);
        setValidationIssues(issues);
        
        // Show success message
        console.log(`Successfully generated ${result.flights.length} flights`);
      } else {
        alert(result.errors?.join('\n') || 'Failed to generate flights');
      }
    } catch (error) {
      console.error('Error auto-generating flights:', error);
      alert('Failed to generate flights. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear all flights
  const handleClearFlights = async () => {
    try {
      await AdminFlightService.clearAllFlights(meetId);
      setFlights([]);
      setAssignments({});
      setValidationIssues([]);
      setConfig(prev => ({ 
        ...prev, 
        autoAssignmentEnabled: false,
        locked: false 
      }));
      
      console.log('All flights cleared successfully');
    } catch (error) {
      console.error('Error clearing flights:', error);
      alert('Failed to clear flights. Please try again.');
    }
  };

  // Move athlete between flights
  const handleMoveAthlete = async (athleteId: string, toFlightId: string) => {
    try {
      // Find current flight
      const currentAssignment = assignments[athleteId];
      const fromFlightId = currentAssignment?.flightId || 'unassigned';

      if (fromFlightId === toFlightId) return; // No change needed

      if (fromFlightId === 'unassigned') {
        // Assign to flight for first time
        await AdminFlightService.moveAthleteBetweenFlights(
          meetId,
          athleteId,
          '', // No from flight
          toFlightId
        );
      } else {
        // Move between flights
        await AdminFlightService.moveAthleteBetweenFlights(
          meetId,
          athleteId,
          fromFlightId,
          toFlightId
        );
      }

      // Reload data
      await loadFlightData();
      
      console.log(`Moved athlete to ${toFlightId}`);
    } catch (error) {
      console.error('Error moving athlete:', error);
      alert('Failed to move athlete. Please try again.');
    }
  };

  // Unassign athlete from flight
  const handleUnassignAthlete = async (athleteId: string) => {
    try {
      await AdminFlightService.unassignAthlete(meetId, athleteId);
      
      // Reload data
      await loadFlightData();
      
      console.log('Athlete unassigned from flight');
    } catch (error) {
      console.error('Error unassigning athlete:', error);
      alert('Failed to unassign athlete. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 text-slate-400 animate-spin" />
          <span className="ml-2 text-slate-400">Loading flight data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Flight Organization</h2>
          <p className="text-slate-400 mt-1">
            Organize athletes into competition flights
          </p>
        </div>
        <button
          onClick={() => {
            onRefresh();
            loadFlightData();
          }}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          title="Refresh flight data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Configuration Panel */}
      <FlightConfiguration
        config={config}
        registrations={registrations}
        onSaveConfig={handleSaveConfig}
        onAutoGenerate={handleAutoGenerate}
        onClearFlights={handleClearFlights}
        isGenerating={isGenerating}
        hasFlights={flights.length > 0}
      />

      {/* Flight Display */}
      <FlightDisplay
        flights={flights}
        registrations={registrations}
        assignments={assignments}
        locked={config.locked}
        validationIssues={validationIssues}
        onMoveAthlete={handleMoveAthlete}
        onUnassignAthlete={handleUnassignAthlete}
      />
    </div>
  );
};

export default FlightsTab;
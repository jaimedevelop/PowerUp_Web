// meets/components/dashboardTabs/flightsTab/components/FlightConfiguration.tsx

import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Trash2, Lock, Unlock, Plus, Minus } from 'lucide-react';
import { FlightConfiguration as FlightConfigType } from '../types/flight-types';
import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';
import { calculateOptimalFlightCount } from '../utils/flightAlgorithms';

interface FlightConfigurationProps {
  config: FlightConfigType;
  registrations: AdminRegistrationView[];
  onSaveConfig: (config: FlightConfigType) => Promise<void>;
  onAutoGenerate: () => Promise<void>;
  onClearFlights: () => Promise<void>;
  isGenerating: boolean;
  hasFlights: boolean;
}

export const FlightConfiguration: React.FC<FlightConfigurationProps> = ({
  config,
  registrations,
  onSaveConfig,
  onAutoGenerate,
  onClearFlights,
  isGenerating,
  hasFlights,
}) => {
  const [localConfig, setLocalConfig] = useState<FlightConfigType>(config);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
    setHasChanges(false);
  }, [config]);

  const handleConfigChange = (updates: Partial<FlightConfigType>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSaveConfig(localConfig);
    setHasChanges(false);
  };

  const handleClearFlights = async () => {
    if (confirm('Are you sure you want to clear all flight assignments? This cannot be undone.')) {
      await onClearFlights();
    }
  };

  // Calculate predicted flights
  const approvedCount = registrations.filter(
    r => r.status === 'approved' || r.status === 'confirmed'
  ).length;
  
  const maleCount = registrations.filter(
    r => (r.status === 'approved' || r.status === 'confirmed') && r.athleteInfo.gender === 'male'
  ).length;
  
  const femaleCount = registrations.filter(
    r => (r.status === 'approved' || r.status === 'confirmed') && r.athleteInfo.gender === 'female'
  ).length;

  const predictedFlights = localConfig.separateByGender
    ? {
        male: calculateOptimalFlightCount(maleCount, localConfig.athletesPerFlight),
        female: calculateOptimalFlightCount(femaleCount, localConfig.athletesPerFlight),
        total: calculateOptimalFlightCount(maleCount, localConfig.athletesPerFlight) +
               calculateOptimalFlightCount(femaleCount, localConfig.athletesPerFlight)
      }
    : {
        total: calculateOptimalFlightCount(approvedCount, localConfig.athletesPerFlight)
      };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Flight Configuration</h3>
        </div>
        
        {localConfig.locked ? (
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm">
            <Lock className="h-4 w-4" />
            <span>Locked</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">
            <Unlock className="h-4 w-4" />
            <span>Unlocked</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Athletes Per Flight */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Athletes Per Flight
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleConfigChange({ 
                athletesPerFlight: Math.max(5, localConfig.athletesPerFlight - 1) 
              })}
              disabled={localConfig.locked}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <input
              type="number"
              value={localConfig.athletesPerFlight}
              onChange={(e) => handleConfigChange({ 
                athletesPerFlight: Math.max(1, parseInt(e.target.value) || 15) 
              })}
              disabled={localConfig.locked}
              className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <button
              onClick={() => handleConfigChange({ 
                athletesPerFlight: Math.min(30, localConfig.athletesPerFlight + 1) 
              })}
              disabled={localConfig.locked}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-slate-400">athletes (recommended: 10-15)</span>
          </div>
        </div>

        {/* Separate by Gender */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.separateByGender}
              onChange={(e) => handleConfigChange({ separateByGender: e.target.checked })}
              disabled={localConfig.locked}
              className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div>
              <span className="text-sm font-medium text-slate-300">
                Separate flights by gender
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Create separate flights for male and female athletes
              </p>
            </div>
          </label>
        </div>

        {/* Lock Flights */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.locked}
              onChange={(e) => handleConfigChange({ locked: e.target.checked })}
              className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-slate-300">
                Lock flights to prevent changes
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Prevents manual adjustments to flight assignments
              </p>
            </div>
          </label>
        </div>

        {/* Predicted Flights Info */}
        <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <h4 className="text-sm font-medium text-white mb-2">Predicted Flight Organization</h4>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              <span className="text-slate-400">Total Athletes:</span> {approvedCount} approved
            </p>
            {localConfig.separateByGender ? (
              <>
                <p className="text-slate-300">
                  <span className="text-slate-400">Male Flights:</span> {predictedFlights.male} ({maleCount} athletes)
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Female Flights:</span> {predictedFlights.female} ({femaleCount} athletes)
                </p>
                <p className="text-slate-300 font-medium pt-1 border-t border-slate-600 mt-2">
                  <span className="text-slate-400">Total Flights:</span> {predictedFlights.total}
                </p>
              </>
            ) : (
              <p className="text-slate-300 font-medium">
                <span className="text-slate-400">Total Flights:</span> {predictedFlights.total}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4 border-t border-slate-700">
          {hasChanges && (
            <button
              onClick={handleSave}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Configuration
            </button>
          )}
          
          <button
            onClick={onAutoGenerate}
            disabled={isGenerating || approvedCount === 0 || localConfig.locked}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Generating Flights...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Auto-Generate Flights</span>
              </>
            )}
          </button>

          {hasFlights && (
            <button
              onClick={handleClearFlights}
              disabled={isGenerating || localConfig.locked}
              className="w-full py-2 px-4 bg-red-600/80 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All Flights</span>
            </button>
          )}
        </div>

        {approvedCount === 0 && (
          <p className="text-sm text-yellow-400 text-center">
            No approved registrations available for flight generation
          </p>
        )}
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { Scale, Search, User, Hash, CheckCircle, Clock, Smartphone, RefreshCw } from 'lucide-react';
import { MeetData } from '../../../../../../firebase';
import { AdminRegistrationService, AdminRegistrationView } from '../../../../../../services/admin/registrations';

interface WeighInTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const WeighInTab: React.FC<WeighInTabProps> = ({ meet, meetId, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<AdminRegistrationView | null>(null);
  const [weight, setWeight] = useState('');
  const [isWeighingIn, setIsWeighingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [athletes, setAthletes] = useState<AdminRegistrationView[]>([]);
  const [recentWeighIns, setRecentWeighIns] = useState<AdminRegistrationView[]>([]);
  
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Load athletes from Firebase
  const loadAthletes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get approved registrations for weigh-in
      const registrations = await AdminRegistrationService.getMeetRegistrations(meetId, {
        status: 'approved',
        orderBy: 'lastName',
        orderDirection: 'asc'
      });
      
      setAthletes(registrations);
      
      // Separate recent weigh-ins (athletes who have already weighed in)
      const recentlyWeighed = registrations.filter(athlete => athlete.weightInStatus !== 'pending');
      const sortedRecent = recentlyWeighed.sort((a, b) => {
        // Sort by most recent weigh-in (you might need to add a weighInDate field)
        return b.athleteInfo.firstName.localeCompare(a.athleteInfo.firstName); // Temporary sort
      });
      
      setRecentWeighIns(sortedRecent);
      
    } catch (err) {
      console.error('Error loading athletes:', err);
      setError('Failed to load athletes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, [meetId]);

  // Filter athletes based on search term and exclude those already weighed in
  const filteredAthletes = athletes.filter(athlete => {
    // Only show athletes who haven't weighed in yet or failed weigh-in
    if (athlete.weightInStatus === 'passed') return false;
    
    const searchString = `${athlete.athleteInfo.firstName} ${athlete.athleteInfo.lastName} ${athlete.id}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Select athlete and focus weight input
  const selectAthlete = (athlete: AdminRegistrationView) => {
    setSelectedAthlete(athlete);
    setWeight(athlete.actualWeight?.toString() || '');
    setTimeout(() => weightInputRef.current?.focus(), 100);
  };

  // Handle weight submission
  const handleWeighIn = async () => {
    if (!selectedAthlete || !weight) return;
    
    setIsWeighingIn(true);
    
    try {
      const actualWeight = parseFloat(weight);
      const expectedWeight = selectedAthlete.competitionInfo.expectedWeight;
      const weightClass = selectedAthlete.competitionInfo.weightClass;
      
      // Determine if athlete passed weight (basic logic - you may want more complex rules)
      const weightClassLimit = parseFloat(weightClass.replace('kg', '').replace('+', ''));
      const passed = actualWeight <= weightClassLimit;
      
      // Record weigh-in in Firebase
      await AdminRegistrationService.recordWeighIn(
        meetId,
        selectedAthlete.id,
        actualWeight,
        passed,
        passed ? 'Weight made successfully' : `Overweight by ${(actualWeight - weightClassLimit).toFixed(1)}kg`
      );
      
      // Update local state
      const updatedAthlete = {
        ...selectedAthlete,
        actualWeight,
        weightInStatus: passed ? 'passed' as const : 'failed' as const,
      };
      
      // Update athletes list
      setAthletes(prev => 
        prev.map(athlete => 
          athlete.id === selectedAthlete.id ? updatedAthlete : athlete
        )
      );
      
      // Add to recent weigh-ins
      setRecentWeighIns(prev => [updatedAthlete, ...prev.slice(0, 9)]);
      
      // Reset form
      setSelectedAthlete(null);
      setWeight('');
      setSearchTerm('');
      
      // Refresh parent component
      onRefresh();
      
    } catch (err) {
      console.error('Error recording weigh-in:', err);
      setError('Failed to record weigh-in. Please try again.');
    } finally {
      setIsWeighingIn(false);
    }
  };

  // Stats calculations
  const totalAthletes = athletes.length;
  const weighedInCount = athletes.filter(a => a.weightInStatus === 'passed' || a.weightInStatus === 'failed').length;
  const passedCount = athletes.filter(a => a.weightInStatus === 'passed').length;
  const failedCount = athletes.filter(a => a.weightInStatus === 'failed').length;
  const remainingCount = totalAthletes - weighedInCount;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-slate-400">Loading athletes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadAthletes}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile QR Code Reminder */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-blue-400" />
          <span className="text-blue-400 font-medium">Mobile Development Note</span>
        </div>
        <p className="text-blue-300 text-sm mt-2">
          <strong>iOS (Swift) & Android (Kotlin):</strong> Implement QR code scanning for instant athlete lookup. 
          QR codes should encode registration ID for seamless mobile weigh-in process.
        </p>
      </div>

      {/* Weigh-In Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-green-400">{passedCount}</div>
          <div className="text-slate-400 text-sm">Passed</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-red-400">{failedCount}</div>
          <div className="text-slate-400 text-sm">Failed</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-white">{remainingCount}</div>
          <div className="text-slate-400 text-sm">Remaining</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-white">{totalAthletes}</div>
          <div className="text-slate-400 text-sm">Total Athletes</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Athlete Search & Selection */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Find Athlete</h3>
            <button
              onClick={loadAthletes}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Refresh athletes"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or registration ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Search Results */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchTerm && filteredAthletes.length > 0 ? (
              filteredAthletes.map((athlete) => (
                <button
                  key={athlete.id}
                  onClick={() => selectAthlete(athlete)}
                  className="w-full p-3 text-left bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {athlete.athleteInfo.firstName} {athlete.athleteInfo.lastName}
                      </div>
                      <div className="text-slate-400 text-sm flex items-center space-x-2">
                        <Hash className="h-3 w-3" />
                        <span>{athlete.id}</span>
                        <span>•</span>
                        <span>{athlete.competitionInfo.division}</span>
                        <span>•</span>
                        <span>{athlete.competitionInfo.weightClass}</span>
                        <span>•</span>
                        <span>{athlete.competitionInfo.expectedWeight}kg target</span>
                      </div>
                    </div>
                    {athlete.weightInStatus === 'failed' && (
                      <div className="text-red-400 text-sm">
                        Failed ({athlete.actualWeight}kg)
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : searchTerm ? (
              <div className="text-center py-8 text-slate-400">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p>No athletes found</p>
                <p className="text-sm">Try searching by name or registration ID</p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p>Start typing to search for athletes</p>
                <p className="text-sm">Search by name or registration ID</p>
              </div>
            )}
          </div>
        </div>

        {/* Weight Entry */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Record Weight</h3>
          
          {selectedAthlete ? (
            <div className="space-y-4">
              {/* Selected Athlete Info */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-white font-medium text-lg">
                  {selectedAthlete.athleteInfo.firstName} {selectedAthlete.athleteInfo.lastName}
                </div>
                <div className="text-slate-400 text-sm mt-1">
                  {selectedAthlete.id} • {selectedAthlete.competitionInfo.division} • {selectedAthlete.competitionInfo.weightClass}
                </div>
                <div className="text-slate-300 text-sm mt-2">
                  Expected: {selectedAthlete.competitionInfo.expectedWeight}kg
                  {selectedAthlete.actualWeight && (
                    <span className="ml-2">
                      | Previous: {selectedAthlete.actualWeight}kg 
                      {selectedAthlete.weightInStatus === 'failed' && (
                        <span className="text-red-400 ml-1">(Failed)</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Actual Weight (kg)
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    ref={weightInputRef}
                    type="number"
                    step="0.1"
                    placeholder="Enter weight..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleWeighIn();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Weight Check Indicator */}
              {weight && selectedAthlete && (
                <div className="text-sm">
                  {(() => {
                    const actualWeight = parseFloat(weight);
                    const weightClassLimit = parseFloat(selectedAthlete.competitionInfo.weightClass.replace('kg', '').replace('+', ''));
                    const willPass = actualWeight <= weightClassLimit;
                    
                    return willPass ? (
                      <div className="text-green-400">✓ Weight will pass</div>
                    ) : (
                      <div className="text-red-400">
                        ✗ Overweight by {(actualWeight - weightClassLimit).toFixed(1)}kg
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleWeighIn}
                disabled={!weight || isWeighingIn}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isWeighingIn ? 'Recording Weight...' : 'Record Weight'}
              </button>

              <button
                onClick={() => {
                  setSelectedAthlete(null);
                  setWeight('');
                }}
                className="w-full py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Scale className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-lg mb-2">Select an Athlete</p>
              <p className="text-sm">Search and select an athlete to record their weight</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Weigh-Ins */}
      {recentWeighIns.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-400" />
            Recent Weigh-Ins
          </h3>
          <div className="space-y-2">
            {recentWeighIns.slice(0, 10).map((athlete) => (
              <div key={athlete.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">
                    {athlete.athleteInfo.firstName} {athlete.athleteInfo.lastName}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {athlete.competitionInfo.weightClass} • Expected: {athlete.competitionInfo.expectedWeight}kg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{athlete.actualWeight}kg</div>
                  <div className="text-slate-400 text-sm">
                    {athlete.weightInStatus === 'passed' ? (
                      <span className="text-green-400 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="text-red-400">Failed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeighInTab;
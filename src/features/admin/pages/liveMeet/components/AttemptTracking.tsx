import React, { useState } from 'react';
import { Check, X, RotateCcw, Edit, Save, Plus, Minus } from 'lucide-react';

interface Attempt {
  id: string;
  lifterId: string;
  lifterName: string;
  liftType: 'squat' | 'bench' | 'deadlift';
  attemptNumber: number;
  weight: number;
  result: 'pending' | 'good' | 'bad' | 'no-lift';
}

interface AttemptTrackingProps {
  meetId: string;
}

const mockAttempts: Attempt[] = [
  {
    id: '1',
    lifterId: '1',
    lifterName: 'John Smith',
    liftType: 'squat',
    attemptNumber: 1,
    weight: 180,
    result: 'good'
  },
  {
    id: '2',
    lifterId: '1',
    lifterName: 'John Smith',
    liftType: 'squat',
    attemptNumber: 2,
    weight: 185,
    result: 'good'
  },
  {
    id: '3',
    lifterId: '2',
    lifterName: 'Mike Johnson',
    liftType: 'squat',
    attemptNumber: 1,
    weight: 175,
    result: 'pending'
  },
  {
    id: '4',
    lifterId: '3',
    lifterName: 'David Wilson',
    liftType: 'squat',
    attemptNumber: 1,
    weight: 170,
    result: 'pending'
  }
];

export const AttemptTracking: React.FC<AttemptTrackingProps> = ({ meetId }) => {
  const [attempts, setAttempts] = useState<Attempt[]>(mockAttempts);
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [tempWeights, setTempWeights] = useState<{[key: string]: number}>({});

  const handleResultChange = (attemptId: string, result: 'good' | 'bad' | 'no-lift') => {
    setAttempts(attempts.map(attempt => 
      attempt.id === attemptId ? { ...attempt, result } : attempt
    ));
  };

  const handleWeightEdit = (attemptId: string, weight: number) => {
    setTempWeights({ ...tempWeights, [attemptId]: weight });
    setEditingWeight(attemptId);
  };

  const handleWeightSave = (attemptId: string) => {
    const newWeight = tempWeights[attemptId];
    if (newWeight !== undefined) {
      setAttempts(attempts.map(attempt => 
        attempt.id === attemptId ? { ...attempt, weight: newWeight } : attempt
      ));
    }
    setEditingWeight(null);
  };

  const handleWeightAdjustment = (attemptId: string, adjustment: number) => {
    const attempt = attempts.find(a => a.id === attemptId);
    if (attempt) {
      const newWeight = Math.max(0, attempt.weight + adjustment);
      setTempWeights({ ...tempWeights, [attemptId]: newWeight });
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'good': return 'text-green-400';
      case 'bad': return 'text-red-400';
      case 'no-lift': return 'text-yellow-400';
      case 'pending': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'good': return <Check size={16} />;
      case 'bad': return <X size={16} />;
      case 'no-lift': return <RotateCcw size={16} />;
      default: return null;
    }
  };

  const groupedAttempts = attempts.reduce((acc, attempt) => {
    const key = `${attempt.lifterName}-${attempt.liftType}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(attempt);
    return acc;
  }, {} as Record<string, Attempt[]>);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">Attempt Tracking</h3>

      <div className="space-y-6">
        {Object.entries(groupedAttempts).map(([key, lifterAttempts]) => {
          const [lifterName, liftType] = key.split('-');
          
          return (
            <div key={key} className="bg-slate-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-white">{lifterName}</h4>
                  <div className="text-sm text-slate-400 capitalize">{liftType}</div>
                </div>
                <div className="text-sm text-slate-400">
                  {lifterAttempts.filter(a => a.result === 'good').length} good lifts
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(attemptNum => {
                  const attempt = lifterAttempts.find(a => a.attemptNumber === attemptNum);
                  
                  return (
                    <div key={attemptNum} className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-slate-400">Attempt {attemptNum}</div>
                        {attempt && (
                          <div className={`flex items-center ${getResultColor(attempt.result)}`}>
                            {getResultIcon(attempt.result)}
                          </div>
                        )}
                      </div>

                      {attempt ? (
                        <div className="space-y-3">
                          {editingWeight === attempt.id ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => handleWeightAdjustment(attempt.id, -2.5)}
                                  className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white"
                                >
                                  <Minus size={14} />
                                </button>
                                <div className="text-xl font-bold text-white">
                                  {tempWeights[attempt.id] || attempt.weight}kg
                                </div>
                                <button
                                  onClick={() => handleWeightAdjustment(attempt.id, 2.5)}
                                  className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button
                                onClick={() => handleWeightSave(attempt.id)}
                                className="w-full py-1 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center"
                              >
                                <Save size={14} className="mr-1" />
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-xl font-bold text-white">
                                {attempt.weight}kg
                              </div>
                              <button
                                onClick={() => handleWeightEdit(attempt.id, attempt.weight)}
                                className="w-full py-1 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center justify-center"
                              >
                                <Edit size={14} className="mr-1" />
                                Edit
                              </button>
                            </div>
                          )}

                          {attempt.result === 'pending' && (
                            <div className="flex space-x-2 mt-3">
                              <button
                                onClick={() => handleResultChange(attempt.id, 'good')}
                                className="flex-1 py-1 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleResultChange(attempt.id, 'bad')}
                                className="flex-1 py-1 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center"
                              >
                                <X size={14} />
                              </button>
                              <button
                                onClick={() => handleResultChange(attempt.id, 'no-lift')}
                                className="flex-1 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded flex items-center justify-center"
                              >
                                <RotateCcw size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-500">
                          Not attempted yet
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attempt Summary */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {attempts.filter(a => a.result === 'good').length}
            </div>
            <div className="text-sm text-slate-400">Good Lifts</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {attempts.filter(a => a.result === 'bad').length}
            </div>
            <div className="text-sm text-slate-400">Failed Lifts</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {attempts.filter(a => a.result === 'no-lift').length}
            </div>
            <div className="text-sm text-slate-400">No Lifts</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {attempts.filter(a => a.result === 'pending').length}
            </div>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};
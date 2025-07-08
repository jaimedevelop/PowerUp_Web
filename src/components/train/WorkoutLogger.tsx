import React, { useState } from 'react';
import { Plus, Upload, Save, Timer, Target, BarChart3 } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Set {
  id: string;
  reps: number;
  weight: number;
  rpe?: number;
  completed: boolean;
}

export const WorkoutLogger: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const exerciseOptions = [
    'Squat',
    'Bench Press',
    'Deadlift',
    'Overhead Press',
    'Barbell Row',
    'Front Squat',
    'Incline Bench Press',
    'Romanian Deadlift',
    'Close Grip Bench Press',
    'Pendlay Row'
  ];

  const addExercise = () => {
    if (!selectedExercise) return;
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: selectedExercise,
      sets: [
        {
          id: Date.now().toString(),
          reps: 0,
          weight: 0,
          completed: false
        }
      ]
    };
    
    setCurrentWorkout([...currentWorkout, newExercise]);
    setSelectedExercise('');
  };

  const addSet = (exerciseId: string) => {
    setCurrentWorkout(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        const newSet: Set = {
          id: Date.now().toString(),
          reps: 0,
          weight: 0,
          completed: false
        };
        return { ...exercise, sets: [...exercise.sets, newSet] };
      }
      return exercise;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    setCurrentWorkout(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          )
        };
      }
      return exercise;
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plus className="w-6 h-6 text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Today's Workout</h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-slate-300">
            <Timer className="w-5 h-5 mr-2" />
            <span className="font-mono">{formatTime(workoutTimer)}</span>
          </div>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isTimerRunning 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTimerRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>

      {/* Add Exercise */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <select 
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="">Select exercise...</option>
            {exerciseOptions.map(exercise => (
              <option key={exercise} value={exercise}>{exercise}</option>
            ))}
          </select>
          <button 
            onClick={addExercise}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </button>
        </div>
      </div>

      {/* Current Exercises */}
      <div className="space-y-6 mb-6">
        {currentWorkout.map((exercise) => (
          <div key={exercise.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">{exercise.name}</h4>
              <button 
                onClick={() => addSet(exercise.id)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                + Add Set
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-3 text-sm text-slate-400 font-medium">
                <span>Set</span>
                <span>Weight</span>
                <span>Reps</span>
                <span>RPE</span>
                <span>Done</span>
              </div>
              
              {exercise.sets.map((set, index) => (
                <div key={set.id} className="grid grid-cols-5 gap-3 items-center">
                  <span className="text-slate-300 font-medium">{index + 1}</span>
                  <input 
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseInt(e.target.value) || 0)}
                    className="p-2 bg-slate-600 border border-slate-500 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm"
                    placeholder="lbs"
                  />
                  <input 
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                    className="p-2 bg-slate-600 border border-slate-500 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm"
                    placeholder="reps"
                  />
                  <input 
                    type="number"
                    value={set.rpe || ''}
                    onChange={(e) => updateSet(exercise.id, set.id, 'rpe', parseInt(e.target.value) || 0)}
                    className="p-2 bg-slate-600 border border-slate-500 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm"
                    placeholder="RPE"
                    min="1"
                    max="10"
                  />
                  <input 
                    type="checkbox"
                    checked={set.completed}
                    onChange={(e) => updateSet(exercise.id, set.id, 'completed', e.target.checked)}
                    className="w-5 h-5 text-green-600 bg-slate-600 border-slate-500 rounded focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Workout Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Workout Notes</label>
        <textarea 
          value={workoutNotes}
          onChange={(e) => setWorkoutNotes(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white h-24 resize-none"
          placeholder="How did this session feel? Any observations or adjustments..."
        />
      </div>

      {/* Video Upload */}
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center mb-6">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-400 mb-2">Upload form check video</p>
        <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Choose file or record
        </button>
      </div>

      {/* Save Workout */}
      <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
        <Save className="w-5 h-5 mr-2" />
        Save Workout
      </button>
    </div>
  );
};
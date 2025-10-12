import React, { useState } from 'react';
import { Users, Clock, Play, Pause, SkipForward, SkipBack, Square, Check, X } from 'lucide-react';

interface Lifter {
  id: string;
  name: string;
  team?: string;
  lotNumber: number;
  weightClass: string;
  currentAttempt: number;
  attempts: {
    squat: number[];
    bench: number[];
    deadlift: number[];
  };
}

interface Flight {
  id: string;
  name: string;
  lifters: Lifter[];
  currentLifterIndex: number;
  currentLift: 'squat' | 'bench' | 'deadlift';
  status: 'waiting' | 'in-progress' | 'completed';
}

interface FlightControlProps {
  meetId: string;
}

const mockFlight: Flight = {
  id: '1',
  name: 'Flight A - Male 83kg',
  lifters: [
    {
      id: '1',
      name: 'John Smith',
      team: 'Powerlifting Gym',
      lotNumber: 1,
      weightClass: 'Male 83kg',
      currentAttempt: 1,
      attempts: {
        squat: [180, 185, 190],
        bench: [120, 125, 130],
        deadlift: [220, 225, 230]
      }
    },
    {
      id: '2',
      name: 'Mike Johnson',
      team: 'Iron Warriors',
      lotNumber: 2,
      weightClass: 'Male 83kg',
      currentAttempt: 1,
      attempts: {
        squat: [175, 180, 185],
        bench: [115, 120, 125],
        deadlift: [210, 215, 220]
      }
    },
    {
      id: '3',
      name: 'David Wilson',
      team: 'Strength Academy',
      lotNumber: 3,
      weightClass: 'Male 83kg',
      currentAttempt: 1,
      attempts: {
        squat: [170, 175, 180],
        bench: [110, 115, 120],
        deadlift: [200, 205, 210]
      }
    }
  ],
  currentLifterIndex: 0,
  currentLift: 'squat',
  status: 'in-progress'
};

export const FlightControl: React.FC<FlightControlProps> = ({ meetId }) => {
  const [flight, setFlight] = useState<Flight>(mockFlight);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds default

  const currentLifter = flight.lifters[flight.currentLifterIndex];
  const currentAttemptWeight = currentLifter?.attempts[flight.currentLift][currentLifter.currentAttempt - 1];

  const handleNextLifter = () => {
    if (flight.currentLifterIndex < flight.lifters.length - 1) {
      setFlight({
        ...flight,
        currentLifterIndex: flight.currentLifterIndex + 1
      });
      setTimeRemaining(60);
      setTimerActive(true);
    }
  };

  const handlePrevLifter = () => {
    if (flight.currentLifterIndex > 0) {
      setFlight({
        ...flight,
        currentLifterIndex: flight.currentLifterIndex - 1
      });
      setTimeRemaining(60);
      setTimerActive(true);
    }
  };

  const handleNextLift = () => {
    const liftOrder: ('squat' | 'bench' | 'deadlift')[] = ['squat', 'bench', 'deadlift'];
    const currentIndex = liftOrder.indexOf(flight.currentLift);
    
    if (currentIndex < liftOrder.length - 1) {
      setFlight({
        ...flight,
        currentLift: liftOrder[currentIndex + 1]
      });
    } else {
      // Move to next lifter
      handleNextLifter();
    }
  };

  const handleAttemptResult = (result: 'good' | 'bad' | 'no-lift') => {
    // In a real app, this would update the lifter's record
    console.log(`Attempt result: ${result}`);
    
    // Move to next lifter
    handleNextLifter();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Users className="mr-2" size={20} />
          Flight Control
        </h3>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            {flight.name}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            flight.status === 'in-progress' 
              ? 'bg-green-500/20 text-green-400' 
              : flight.status === 'waiting'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-slate-700 text-slate-400'
          }`}>
            {flight.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Current Lifter */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-white">{currentLifter?.name}</div>
            <div className="text-sm text-slate-400">
              Lot #{currentLifter?.lotNumber} • {currentLifter?.team} • {currentLifter?.weightClass}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Current Lift</div>
            <div className="text-lg font-bold text-white capitalize">{flight.currentLift}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="text-sm text-slate-400">Attempt</div>
            <div className="text-xl font-bold text-white">{currentLifter?.currentAttempt}/3</div>
          </div>
          <div className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="text-sm text-slate-400">Weight</div>
            <div className="text-xl font-bold text-white">{currentAttemptWeight}kg</div>
          </div>
          <div className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="text-sm text-slate-400">Time</div>
            <div className={`text-xl font-bold ${timeRemaining < 10 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={() => setTimerActive(!timerActive)}
            className={`p-2 rounded-lg ${
              timerActive 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {timerActive ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => setTimeRemaining(60)}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
          >
            <Clock size={20} />
          </button>
        </div>

        {/* Attempt Result Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => handleAttemptResult('good')}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center"
          >
            <Check size={16} className="mr-2" />
            Good Lift
          </button>
          <button
            onClick={() => handleAttemptResult('bad')}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
          >
            <X size={16} className="mr-2" />
            No Lift
          </button>
        </div>
      </div>

      {/* Lifter Queue */}
      <div>
        <h4 className="font-medium text-white mb-3">Upcoming Lifters</h4>
        <div className="space-y-2">
          {flight.lifters.slice(flight.currentLifterIndex + 1).map((lifter, index) => (
            <div key={lifter.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm mr-3">
                  {lifter.lotNumber}
                </div>
                <div>
                  <div className="font-medium text-white">{lifter.name}</div>
                  <div className="text-sm text-slate-400">{lifter.team}</div>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                {index === 0 ? 'On Deck' : `In ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevLifter}
          disabled={flight.currentLifterIndex === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            flight.currentLifterIndex === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          <SkipBack size={16} />
          <span>Previous Lifter</span>
        </button>
        
        <button
          onClick={handleNextLift}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <span>Next Lift</span>
          <SkipForward size={16} />
        </button>
        
        <button
          onClick={handleNextLifter}
          disabled={flight.currentLifterIndex >= flight.lifters.length - 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            flight.currentLifterIndex >= flight.lifters.length - 1
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          <span>Next Lifter</span>
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
};
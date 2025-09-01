import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Plus, Minus, Settings } from 'lucide-react';

interface TimerManagementProps {
  meetId: string;
}

export const TimerManagement: React.FC<TimerManagementProps> = ({ meetId }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // Default 60 seconds
  const [initialTime, setInitialTime] = useState(60);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(1);
  const [customSeconds, setCustomSeconds] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startTimer = () => {
    if (timeRemaining > 0) {
      setTimerActive(true);
    }
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeRemaining(initialTime);
  };

  const applyCustomTime = () => {
    const totalSeconds = customMinutes * 60 + customSeconds;
    if (totalSeconds > 0) {
      setInitialTime(totalSeconds);
      setTimeRemaining(totalSeconds);
      setTimerActive(false);
      setShowSettings(false);
    }
  };

  const quickSetTime = (seconds: number) => {
    setInitialTime(seconds);
    setTimeRemaining(seconds);
    setTimerActive(false);
  };

  const timeColor = timeRemaining <= 10 ? 'text-red-400' : 
                   timeRemaining <= 30 ? 'text-yellow-400' : 'text-white';

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Clock className="mr-2" size={20} />
          Timer Management
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold mb-4 ${timeColor}`}>
          {formatTime(timeRemaining)}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={timerActive ? pauseTimer : startTimer}
            disabled={timeRemaining === 0}
            className={`p-3 rounded-full ${
              timerActive 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : timeRemaining === 0
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {timerActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* Quick Time Settings */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Set</h4>
        <div className="grid grid-cols-4 gap-2">
          {[30, 60, 120, 180].map(seconds => (
            <button
              key={seconds}
              onClick={() => quickSetTime(seconds)}
              className={`py-2 rounded-lg ${
                initialTime === seconds
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {formatTime(seconds)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Time Settings */}
      {showSettings && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Custom Timer</h4>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-1">Minutes</label>
              <div className="flex items-center">
                <button
                  onClick={() => setCustomMinutes(Math.max(0, customMinutes - 1))}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded-l text-white"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center py-1 bg-slate-800 text-white">
                  {customMinutes}
                </div>
                <button
                  onClick={() => setCustomMinutes(customMinutes + 1)}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded-r text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="text-2xl text-slate-400 flex items-center">:</div>
            
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-1">Seconds</label>
              <div className="flex items-center">
                <button
                  onClick={() => setCustomSeconds(Math.max(0, customSeconds - 1))}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded-l text-white"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center py-1 bg-slate-800 text-white">
                  {customSeconds < 10 ? `0${customSeconds}` : customSeconds}
                </div>
                <button
                  onClick={() => setCustomSeconds(Math.min(59, customSeconds + 1))}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded-r text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={applyCustomTime}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Apply Custom Time
          </button>
        </div>
      )}

      {/* Timer Controls */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => quickSetTime(60)}
          className="py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center"
        >
          <RotateCcw size={16} className="mr-2" />
          1 Minute
        </button>
        <button
          onClick={() => quickSetTime(120)}
          className="py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center"
        >
          <RotateCcw size={16} className="mr-2" />
          2 Minutes
        </button>
      </div>

      {/* Timer Status */}
      <div className="mt-6 pt-4 border-t border-slate-700 text-center">
        <div className="text-sm text-slate-400">
          Timer is {timerActive ? 'running' : 'paused'} • {timeRemaining === 0 ? 'Time expired!' : `${timeRemaining} seconds remaining`}
        </div>
      </div>
    </div>
  );
};
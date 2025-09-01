import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Dumbbell, Clock } from 'lucide-react';

export const TrainingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getWorkoutType = (day: number) => {
    if (day % 7 === 1) return 'squat';
    if (day % 7 === 3) return 'bench';
    if (day % 7 === 5) return 'deadlift';
    return null;
  };

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Training Calendar</h3>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h4 className="text-lg font-semibold text-white">
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h4>
        <button 
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, index) => {
          const workoutType = day ? getWorkoutType(day) : null;
          const isToday = day === new Date().getDate() && 
            selectedDate.getMonth() === new Date().getMonth() && 
            selectedDate.getFullYear() === new Date().getFullYear();
          
          return (
            <div key={index} className="aspect-square">
              {day && (
                <div className={`w-full h-full flex flex-col items-center justify-center rounded-lg text-sm transition-colors cursor-pointer relative
                  ${isToday
                    ? 'bg-purple-600 text-white font-semibold' 
                    : 'hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span className="mb-1">{day}</span>
                  {workoutType && (
                    <div className={`w-2 h-2 rounded-full ${
                      workoutType === 'squat' ? 'bg-red-400' :
                      workoutType === 'bench' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`}></div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h5 className="font-medium text-white">Upcoming Workouts</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-white">Squat Focus</p>
                <p className="text-sm text-slate-400">Tomorrow • 6:00 PM</p>
              </div>
            </div>
            <Dumbbell className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-white">Bench Press</p>
                <p className="text-sm text-slate-400">Friday • 5:30 PM</p>
              </div>
            </div>
            <Dumbbell className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            <span className="text-slate-400">Squat</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-slate-400">Bench</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-slate-400">Deadlift</span>
          </div>
        </div>
      </div>
    </div>
  );
};
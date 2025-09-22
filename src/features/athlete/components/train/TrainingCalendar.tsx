import React, { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dot, Dumbbell } from 'lucide-react';

type MiniEvent = { id: string; title: string; time?: string; color: 'red' | 'blue' | 'green' };

export const TrainingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // --- Helpers ---
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth   = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Fake events generator (replace with your real data)
  const getEventsForDate = (date: Date): MiniEvent[] => {
    // simple pattern: Squat on Mon, Bench on Wed, Deadlift on Fri
    const dow = date.getDay();
    const events: MiniEvent[] = [];
    if (dow === 1) events.push({ id: 'sq', title: 'Squat', time: '6:00 PM', color: 'red' });
    if (dow === 3) events.push({ id: 'be', title: 'Bench', time: '5:30 PM', color: 'blue' });
    if (dow === 5) events.push({ id: 'dl', title: 'Deadlift', time: '10:00 AM', color: 'green' });
    return events;
  };

  // Build 6-week grid (7 * 6 = 42 cells)
  const gridDays = useMemo(() => {
    const first = startOfMonth(selectedDate);
    const last  = endOfMonth(selectedDate);

    const leading = first.getDay(); // 0..6 (Sun..Sat)
    const daysInMonth = last.getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];

    // Leading cells from prev month
    for (let i = 0; i < leading; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() - (leading - i));
      cells.push({ date: d, inMonth: false });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day), inMonth: true });
    }

    // Trailing cells to reach 42 total
    while (cells.length < 42) {
      const prev = cells[cells.length - 1].date;
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      cells.push({ date: d, inMonth: false });
    }
    return cells;
  }, [selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const nd = new Date(prev);
      nd.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return nd;
    });
  };

  const today = new Date();

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center mb-6">
        <CalendarIcon className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Training Calendar</h3>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
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

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Month grid (7x6) */}
      <div className="grid grid-cols-7 gap-2">
        {gridDays.map(({ date, inMonth }, idx) => {
          const isTodayCell = isSameDay(today, date);
          const events = getEventsForDate(date);
          const preview = events.slice(0, 2);
          const overflow = Math.max(0, events.length - preview.length);

          return (
            <div
              key={idx}
              className={`min-h-[110px] rounded-lg border p-2 flex flex-col gap-1
                ${inMonth ? 'border-slate-700 bg-slate-750/40' : 'border-slate-800 bg-slate-800/40 opacity-60'}`
              }
            >
              {/* Date number */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${inMonth ? 'text-slate-300' : 'text-slate-500'}`}>
                  {date.getDate()}
                </span>
                {isTodayCell && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white">Today</span>
                )}
              </div>

              {/* Event previews */}
              <div className="mt-1 flex flex-col gap-1">
                {preview.map(ev => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-2 rounded-md bg-slate-700/60 border border-slate-700 px-2 py-1"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        ev.color === 'red' ? 'bg-red-400' : ev.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                      }`}
                    />
                    <div className="truncate text-xs text-slate-200">
                      <span className="font-medium">{ev.title}</span>
                      {ev.time && <span className="text-slate-400"> • {ev.time}</span>}
                    </div>
                  </div>
                ))}
                {overflow > 0 && (
                  <div className="text-[11px] text-slate-400">+{overflow} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar-style “Upcoming” section (kept from your version) */}
      <div className="mt-6 space-y-3">
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

      {/* Legend */}
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

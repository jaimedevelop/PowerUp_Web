import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  X,
  StickyNote,
} from "lucide-react";

import WorkoutDay from "./WorkoutDay.tsx"; // make sure this path is correct

type Color = "red" | "blue" | "green";
type MiniEvent = {
  id: string;
  title: string;
  time?: string;
  color: Color;
  blocks?: Array<{
    lift: string;
    scheme: string; // e.g. "5x3 @ RPE 7"
    notes?: string;
  }>;
  coachNotes?: string;
};

export const TrainingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openEvent, setOpenEvent] = useState<{
    date: Date;
    ev: MiniEvent;
  } | null>(null);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // helpers
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth   = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // demo events – replace with your real data
  const getEventsForDate = useCallback((date: Date): MiniEvent[] => {
    const dow = date.getDay(); // 0..6, Sun..Sat
    const make = (
      t: string,
      c: Color,
      blocks: MiniEvent["blocks"],
      coachNotes?: string
    ): MiniEvent => ({
      id: `${date.toDateString()}-${t}`,
      title: t,
      time: dow === 1 ? "6:00 PM" : dow === 3 ? "5:30 PM" : "10:00 AM",
      color: c,
      blocks,
      coachNotes,
    });

    const events: MiniEvent[] = [];
    if (dow === 1)
      events.push(
        make(
          "Squat",
          "red",
          [
            { lift: "Back Squat", scheme: "5×3 @ RPE 7", notes: "Pause 1s bottom" },
            { lift: "Leg Press", scheme: "4×10", notes: "Controlled descent" },
          ],
          "Keep bracing tight; don’t rush the eccentric."
        )
      );
    if (dow === 3)
      events.push(
        make(
          "Bench",
          "blue",
          [
            { lift: "Competition Bench", scheme: "5×5 @ 70%", notes: "Full pause" },
            { lift: "DB Row", scheme: "4×12" },
          ],
          "Pinch scapula; light arch is fine."
        )
      );
    if (dow === 5)
      events.push(
        make(
          "Deadlift",
          "green",
          [
            { lift: "Deadlift", scheme: "3×3 @ RPE 7.5", notes: "Straps ok" },
            { lift: "RDL", scheme: "3×8" },
          ],
          "Push the floor away; long arms."
        )
      );
    return events;
  }, []);

  // 6-week grid (always 42 cells)
  const gridDays = useMemo(() => {
    const first = startOfMonth(selectedDate);
    const last  = endOfMonth(selectedDate);
    const leading = first.getDay();
    const daysInMonth = last.getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < leading; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() - (leading - i));
      cells.push({ date: d, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day), inMonth: true });
    }
    while (cells.length < 42) {
      const prev = cells[cells.length - 1].date;
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      cells.push({ date: d, inMonth: false });
    }
    return cells;
  }, [selectedDate]);

  const navigateMonth = (dir: "prev" | "next") => {
    setSelectedDate(prev => {
      const nd = new Date(prev);
      nd.setMonth(prev.getMonth() + (dir === "prev" ? -1 : 1));
      return nd;
    });
  };

  const today = new Date();

  // close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenEvent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // OPTIONAL: helper to map blocks -> WorkoutDay rows
  const blocksToRows = (blocks: NonNullable<MiniEvent["blocks"]>) =>
    blocks.map((b, idx) => ({
      id: `${idx}`,
      exercise: b.lift,
      sets: "-",         // You can parse sets/reps out of b.scheme if you want
      reps: b.scheme,    // showing the scheme as-is for now
      rpe: "-",          // or parse from scheme
      load: "-",
      coachNote: b.notes,
    }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center mb-6">
        <CalendarIcon className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Training Calendar</h3>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-slate-700 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h4 className="text-lg font-semibold text-white">
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h4>
        <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-slate-700 rounded-lg">
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7 gap-2">
        {gridDays.map(({ date, inMonth }, idx) => {
          const isTodayCell = isSameDay(today, date);
          const events = getEventsForDate(date);
          const preview = events.slice(0, 2);
          const overflow = Math.max(0, events.length - preview.length);

          return (
            <div
              key={idx}
              className={`min-h-[120px] rounded-lg border p-2 flex flex-col gap-1 ${
                inMonth ? "border-slate-700 bg-slate-800/60" : "border-slate-800 bg-slate-800/40 opacity-60"
              }`}
              onClick={() => {
                // clicking the empty day opens the first event if any
                if (events[0]) setOpenEvent({ date, ev: events[0] });
              }}
            >
              {/* Date number */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${inMonth ? "text-slate-300" : "text-slate-500"}`}>{date.getDate()}</span>
                {isTodayCell && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white">Today</span>
                )}
              </div>

              {/* Event previews (clickable) */}
              <div className="mt-1 flex flex-col gap-1">
                {preview.map((ev) => (
                  <button
                    key={ev.id}
                    className="flex items-center gap-2 rounded-md bg-slate-700/60 border border-slate-700 px-2 py-1 text-left hover:bg-slate-700"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent day-level click
                      setOpenEvent({ date, ev });
                    }}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        ev.color === "red" ? "bg-red-400" : ev.color === "blue" ? "bg-blue-400" : "bg-green-400"
                      }`}
                    />
                    <div className="truncate text-xs text-slate-200">
                      <span className="font-medium">{ev.title}</span>
                      {ev.time && <span className="text-slate-400"> • {ev.time}</span>}
                    </div>
                  </button>
                ))}
                {overflow > 0 && <div className="text-[11px] text-slate-400">+{overflow} more</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* “Upcoming” sample */}
      <div className="mt-6 space-y-3">
        <h5 className="font-medium text-white">Upcoming Workouts</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-3" />
              <div>
                <p className="font-medium text-white">Squat Focus</p>
                <p className="text-sm text-slate-400">Tomorrow • 6:00 PM</p>
              </div>
            </div>
            <Dumbbell className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {openEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpenEvent(null)}
        >
          <div
  className="w-full max-w-5xl mx-4 rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-white">{openEvent.ev.title}</h3>
                <p className="text-xs text-slate-400">
                  {monthNames[openEvent.date.getMonth()]} {openEvent.date.getDate()},{" "}
                  {openEvent.date.getFullYear()}
                  {openEvent.ev.time ? ` • ${openEvent.ev.time}` : ""}
                </p>
              </div>
              <button
                className="p-2 rounded-full hover:bg-slate-700"
                onClick={() => setOpenEvent(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-300" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* OPTION A: render blocks list (simple) */}
              {/* 
              {openEvent.ev.blocks && openEvent.ev.blocks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <Dumbbell className="h-4 w-4" />
                    <span className="text-sm font-medium">Workout</span>
                  </div>
                  <div className="space-y-2">
                    {openEvent.ev.blocks.map((b, i) => (
                      <div
                        key={`${b.lift}-${i}`}
                        className="flex items-start justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2"
                      >
                        <div>
                          <p className="text-white">{b.lift}</p>
                          {b.notes && <p className="text-xs text-slate-400 mt-0.5">{b.notes}</p>}
                        </div>
                        <p className="text-slate-200 font-medium ml-3">{b.scheme}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              */}

              {/* OPTION B: show full table using WorkoutDay */}
              {openEvent.ev.blocks && openEvent.ev.blocks.length > 0 && (
                <WorkoutDay
                  title={`${openEvent.ev.title} — ${openEvent.date.toLocaleDateString()}`}
                  rows={blocksToRows(openEvent.ev.blocks)}
                  onSave={(payload) => {
                    // TODO: persist athlete entries for this date + event
                    console.log("save athlete responses:", payload);
                  }}
                />
              )}

              {/* coach notes */}
              {openEvent.ev.coachNotes && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <StickyNote className="h-4 w-4" />
                    <span className="text-sm font-medium">Coach Notes</span>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-200 text-sm leading-relaxed">
                    {openEvent.ev.coachNotes}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
              <button
                className="px-3 py-2 text-sm rounded-md border border-slate-600 text-slate-200 hover:bg-slate-700"
                onClick={() => setOpenEvent(null)}
              >
                Close
              </button>
              <button
                className="px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setOpenEvent(null)}
              >
                Add to Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
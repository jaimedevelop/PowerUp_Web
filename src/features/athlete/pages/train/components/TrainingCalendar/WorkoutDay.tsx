// src/features/athlete/components/train/TrainingCalendar/WorkoutDay.tsx
import React, { useMemo, useState } from "react";
import { Check, Save, StickyNote, Dumbbell } from "lucide-react";

export type PrescribedRow = {
  id: string;
  exercise: string;
  /** Allow raw scheme strings like "5x3 @ RPE 7", or fill sets/reps/rpe directly */
  sets?: string | number;
  reps?: string | number; // can be a scheme string (e.g. "5x3 @ RPE 7")
  rpe?: string | number;
  load?: string | number; // e.g. "Same load", "%", "@8", "0"
  coachNote?: string;
};

export type AthleteEntry = {
  load?: string;
  rpe?: string;
  complete?: boolean;
};

export type WorkoutDayProps = {
  title?: string; // e.g., "Squat — 9/15/2025"
  rows: PrescribedRow[];
  initialResponses?: Record<string, AthleteEntry>;
  onSave?: (responses: Record<string, AthleteEntry>) => Promise<void> | void;
};

/** Parse strings like "5x3 @ RPE 7", "4x10", "3×5 @8" */
function parseScheme(scheme?: string) {
  if (!scheme) return { sets: undefined, reps: undefined, rpe: undefined };

  // 1) capture sets and reps with x or ×
  // 2) optional @ (RPE )?number
  const m = scheme.match(
    /(\d+)\s*[x×]\s*(\d+)(?:\s*@\s*(?:RPE\s*)?(\d+))?/i
  );
  if (!m) {
    // Fallback: if it doesn't match, we treat the whole thing as "reps" text
    return { sets: undefined, reps: scheme, rpe: undefined };
  }
  return {
    sets: m[1], // e.g. "5"
    reps: m[2], // e.g. "3"
    rpe: m[3],  // e.g. "7" (optional)
  };
}

const dash = "—";

const cell = "px-4 py-3 text-center text-slate-200 align-top";
const rowBase = "border-t border-slate-700";
const inputBase =
  "rounded-md bg-slate-700 border border-slate-600 px-2 py-1 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent";

const headerCell = "px-4 py-3 text-center font-semibold";

/** Component */
const WorkoutDay: React.FC<WorkoutDayProps> = ({
  title = "Workout",
  rows,
  initialResponses = {},
  onSave,
}) => {
  const [responses, setResponses] = useState<Record<string, AthleteEntry>>(
    () => ({ ...initialResponses })
  );
  const [saving, setSaving] = useState(false);
  const [saveOK, setSaveOK] = useState<null | "ok" | "err">(null);

  const setField = (
    id: string,
    field: keyof AthleteEntry,
    value: string | boolean
  ) => {
    setResponses((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value as any } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveOK(null);
    try {
      await onSave?.(responses);
      setSaveOK("ok");
    } catch (e) {
      console.error(e);
      setSaveOK("err");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveOK(null), 1800);
    }
  };

  const completedCount = useMemo(
    () => Object.values(responses).filter((r) => r.complete).length,
    [responses]
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Dumbbell className="h-6 w-6 text-purple-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <p className="text-slate-400 text-sm">
              {completedCount}/{rows.length} blocks marked complete
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveOK === "ok" && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
          {saveOK === "err" && (
            <span className="text-rose-400 text-sm">Save failed</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-3 py-2 text-sm"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="bg-slate-900/60 text-slate-300">
              <th className="px-4 py-3 text-left font-semibold">Exercise</th>
              <th className={headerCell}>Sets</th>
              <th className={headerCell}>Reps</th>
              <th className={headerCell}>RPE</th>
              <th className={headerCell}>Load</th>
              <th className={`${headerCell} border-l border-slate-700`}>
                Athlete Load
              </th>
              <th className={headerCell}>Athlete RPE</th>
              <th className={headerCell}>Done</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => {
              const resp = responses[r.id] ?? {};
              const even = i % 2 === 0;

              // If r.reps is a string like "5x3 @ RPE 7" parse it;
              // otherwise we’ll use explicit r.sets/r.reps/r.rpe if provided.
              const schemeParsed =
                typeof r.reps === "string" ? parseScheme(r.reps) : undefined;

              const showSets =
                r.sets ?? schemeParsed?.sets ?? dash;
              const showReps =
                typeof r.reps === "number"
                  ? r.reps
                  : schemeParsed?.reps ?? (typeof r.reps === "string" ? r.reps : dash);
              const showRpe =
                r.rpe ?? schemeParsed?.rpe ?? dash;

              return (
                <tr
                  key={r.id}
                  className={`${even ? "bg-slate-800" : "bg-slate-800/70"} ${rowBase}`}
                >
                  {/* Exercise + optional coach note tooltip */}
                  <td className="px-4 py-3 text-white whitespace-pre-wrap align-top text-left">
                    <div className="flex items-start gap-2">
                      <span className="font-medium">{r.exercise}</span>
                      {r.coachNote && (
                        <span className="group relative shrink-0" title={r.coachNote}>
                          <StickyNote className="h-4 w-4 text-slate-400" />
                          {/* custom tooltip (hover) */}
                          <span className="pointer-events-none absolute left-5 top-0 hidden group-hover:block bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 max-w-[260px]">
                            {r.coachNote}
                          </span>
                        </span>
                      )}
                    </div>
                  </td>

                  <td className={cell}>{showSets}</td>
                  <td className={cell}>{showReps}</td>
                  <td className={cell}>{showRpe}</td>
                  <td className={cell}>{r.load ?? dash}</td>

                  {/* Athlete inputs */}
                  <td className={`${cell} border-l border-slate-700`}>
                    <input
                      value={resp.load ?? ""}
                      onChange={(e) => setField(r.id, "load", e.target.value)}
                      placeholder="e.g. 225"
                      className={`${inputBase} w-28`}
                      inputMode="decimal"
                    />
                  </td>

                  <td className={cell}>
                    <input
                      value={resp.rpe ?? ""}
                      onChange={(e) => setField(r.id, "rpe", e.target.value)}
                      placeholder="e.g. 8"
                      className={`${inputBase} w-20`}
                      inputMode="decimal"
                    />
                  </td>

                  <td className={cell}>
                    <input
                      type="checkbox"
                      checked={!!resp.complete}
                      onChange={(e) => setField(r.id, "complete", e.target.checked)}
                      className="h-4 w-4 accent-purple-600"
                      aria-label="Mark block complete"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutDay;
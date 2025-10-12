// ===============================
// File: src/features/athlete/components/train/LoadTheBar.tsx
// ===============================
import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Plus, Minus, Weight, Repeat, Settings2 } from "lucide-react";

const KG_TO_LB = 2.2046226218;
type Unit = "kg" | "lb";
type Mode = "calculate" | "reverse";

// ---- Plate sets ----
// Full sets (used in REVERSE mode)
const KG_PLATES_ALL = [50, 25, 20, 15, 10, 5, 2.5, 2, 1.5, 1.25, 1, 0.5] as const;
const LB_PLATES_ALL = [55, 45, 35, 25, 10, 5, 2.5] as const;
// Calculate mode sets (no 50kg / 55lb)
const KG_PLATES_CALC = [25, 20, 15, 10, 5, 2.5, 2, 1.5, 1.25, 1, 0.5] as const;
const LB_PLATES_CALC = [45, 35, 25, 10, 5, 2.5] as const;

const KG_BAR_DEFAULT = 20;
const LB_BAR_DEFAULT = 45;

type Inventory = Record<number, number>; // pairs per side

const round2 = (n: number) => Math.round(n * 100) / 100;
const convert = (n: number, from: Unit, to: Unit) =>
  from === to ? n : from === "kg" ? n * KG_TO_LB : n / KG_TO_LB;

function greedyFillPerSide(
  perSideTarget: number,
  sizes: number[],
  inv?: Inventory
) {
  const counts: Record<number, number> = {};
  let remaining = perSideTarget;
  for (const s of sizes) {
    const maxByWeight = Math.floor(remaining / s);
    const maxByInv = inv && inv[s] != null ? inv[s] : Infinity;
    const use = Math.max(0, Math.min(maxByWeight, maxByInv));
    if (use > 0) {
      counts[s] = use;
      remaining = round2(remaining - use * s);
    }
  }
  return { counts, remaining };
}

export default function LoadTheBar() {
  const [unit, setUnit] = useState<Unit>("kg");
  const [mode, setMode] = useState<Mode>("calculate");

  // Settings
  const [barWeight, setBarWeight] = useState<number>(
    unit === "kg" ? KG_BAR_DEFAULT : LB_BAR_DEFAULT
  );
  const [collars, setCollars] = useState<number>(0); // total
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // plateSizes depends on mode + unit
  const plateSizes =
    mode === "calculate"
      ? unit === "kg"
        ? [...KG_PLATES_CALC]
        : [...LB_PLATES_CALC]
      : unit === "kg"
        ? [...KG_PLATES_ALL]
        : [...LB_PLATES_ALL];

  const sizesDesc = useMemo(
    () => [...plateSizes].sort((a, b) => b - a),
    [plateSizes]
  );

  // Inventory keyed to current plateSizes
  const [inventoryPairs, setInventoryPairs] = useState<Inventory>(() => {
    const inv: Inventory = {};
    plateSizes.forEach((p) => (inv[p] = 99));
    return inv;
  });

  // Target total with field-unit toggle and clearable input
  const [targetTotal, setTargetTotal] = useState<number>(barWeight + collars);
  const [targetEditUnit, setTargetEditUnit] = useState<Unit>("kg");
  const [targetInput, setTargetInput] = useState<string>(
    String(round2(barWeight + collars))
  );

  // Reverse mode selection
  const [reverseCounts, setReverseCounts] = useState<Record<number, number>>({});

  // Keep inventory keys in sync whenever plateSizes changes (e.g., mode/unit switch)
  useEffect(() => {
    setInventoryPairs((prev) => {
      const next: Inventory = {};
      plateSizes.forEach((p) => (next[p] = prev[p] ?? 99));
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateSizes]);

  // Unit change
  const onUnitChange = (next: Unit) => {
    if (next === unit) return;
    const convertedBar = round2(convert(barWeight, unit, next));
    const convertedCollars = round2(convert(collars, unit, next));
    const convertedTarget = round2(convert(targetTotal, unit, next));

    setUnit(next);
    setBarWeight(convertedBar);
    setCollars(convertedCollars);
    setTargetTotal(convertedTarget);
    setTargetEditUnit(next);
    setTargetInput(String(convertedTarget));
    setReverseCounts({});
  };

// Handle target total unit toggle (re-interpret existing input as the new unit)
const handleTargetUnitChange = (next: Unit) => {
  if (next === targetEditUnit) return;
  const parsed = parseFloat(targetInput);
  setTargetEditUnit(next);
  if (!isNaN(parsed)) {
    // Treat the current digits as 'next' unit and convert to the page's main unit
    const normalized = convert(parsed, next, unit);
    setTargetTotal(round2(normalized));
  }
};

  // Calculate mode result
  const calcResult = useMemo(() => {
    if (mode !== "calculate") return null;
    const weightForPlates = round2(targetTotal - barWeight - collars);
    if (weightForPlates < 0) return { error: "Target is below bar + collars." };

    const perSideTarget = round2(weightForPlates / 2);
    const { counts, remaining } = greedyFillPerSide(
      perSideTarget,
      sizesDesc,
      inventoryPairs
    );
    const exact = Math.abs(remaining) < 0.01;
    const usedTotal =
      Object.entries(counts).reduce(
        (sum, [s, c]) => sum + Number(s) * (Number(c) * 2),
        0
      ) + barWeight + collars;

    return {
      counts,
      perSideTarget,
      remaining,
      exact,
      usedTotal: round2(usedTotal),
    };
  }, [mode, targetTotal, barWeight, collars, sizesDesc, inventoryPairs]);

  // Reverse mode total
  const reverseTotal = useMemo(() => {
    if (mode !== "reverse") return null;
    const totalPlates =
      Object.entries(reverseCounts).reduce(
        (sum, [s, c]) => sum + Number(s) * (Number(c) * 2),
        0
      );
    return round2(totalPlates + barWeight + collars);
  }, [mode, reverseCounts, barWeight, collars]);

  const incPair = (s: number) =>
    setReverseCounts((m) => ({ ...m, [s]: Math.max(0, (m[s] ?? 0) + 1) }));
  const decPair = (s: number) =>
    setReverseCounts((m) => ({ ...m, [s]: Math.max(0, (m[s] ?? 0) - 1) }));

  const resetAll = () => {
    const v = round2(barWeight + collars);
    setTargetTotal(v);
    setTargetInput(String(v));
    setReverseCounts({});
  };

  // colors
  const colorFor = (s: number) => {
    if (unit === "kg") {
      if (s >= 50) return "bg-slate-500";
      if (s === 25) return "bg-red-600";
      if (s === 20) return "bg-blue-600";
      if (s === 15) return "bg-yellow-500";
      if (s === 10) return "bg-green-600";
      if (s === 5) return "bg-white text-slate-900";
      if (s === 2.5) return "bg-slate-900";
      return "bg-slate-700";
    }
    if (s >= 55) return "bg-slate-500";
    if (s === 45) return "bg-blue-600";
    if (s === 35) return "bg-yellow-500";
    if (s === 25) return "bg-green-600";
    if (s === 10) return "bg-red-600";
    if (s === 5) return "bg-white text-slate-900";
    return "bg-slate-700";
  };

  const renderPerSideStack = (counts: Record<number, number>) => {
    const items: Array<{ s: number; i: number }> = [];
    sizesDesc.forEach((s) => {
      const c = counts[s] ?? 0;
      for (let i = 0; i < c; i++) items.push({ s, i });
    });
    return (
      <div className="flex items-center gap-1">
        {items.map(({ s, i }, idx) => (
          <div
            key={`${s}-${i}-${idx}`}
            className={`h-8 w-3 rounded-sm border border-slate-900 ${colorFor(s)} flex items-center justify-center text-[10px]`}
            title={`${s}${unit}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="inline-flex rounded-full overflow-hidden border border-slate-700">
          <button
            className={`px-3 py-1 text-sm ${unit === "kg" ? "bg-purple-600 text-white" : "text-slate-200"}`}
            onClick={() => onUnitChange("kg")}
          >
            KG
          </button>
          <button
            className={`px-3 py-1 text-sm ${unit === "lb" ? "bg-purple-600 text-white" : "text-slate-200"}`}
            onClick={() => onUnitChange("lb")}
          >
            LB
          </button>
        </div>

        <div className="inline-flex rounded-full overflow-hidden border border-slate-700 ml-2">
          <button
            className={`px-3 py-1 text-sm ${mode === "calculate" ? "bg-slate-700 text-white" : "text-slate-200"}`}
            onClick={() => setMode("calculate")}
          >
            Calculate
          </button>
          <button
            className={`px-3 py-1 text-sm ${mode === "reverse" ? "bg-slate-700 text-white" : "text-slate-200"}`}
            onClick={() => setMode("reverse")}
          >
            Reverse
          </button>
        </div>

        <button
          onClick={() => setInventoryOpen((v) => !v)}
          className="ml-auto flex items-center gap-2 text-slate-200 hover:text-white"
        >
          <Settings2 className="h-4 w-4" />
          Inventory
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 text-slate-200 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <label className="text-sm text-slate-300">
          Bar Weight ({unit})
          <div className="mt-1 flex items-center gap-2">
            <Weight className="h-4 w-4 text-slate-400" />
            <input
              type="number"
              step="0.5"
              value={barWeight}
              onChange={(e) => setBarWeight(Number(e.target.value) || 0)}
              className="w-full rounded-md bg-slate-700 border border-slate-600 px-3 py-2 text-white"
            />
          </div>
        </label>
        <label className="text-sm text-slate-300">
          Collars (total {unit})
          <div className="mt-1 flex items-center gap-2">
            <Repeat className="h-4 w-4 text-slate-400" />
            <input
              type="number"
              step="0.25"
              value={collars}
              onChange={(e) => setCollars(Number(e.target.value) || 0)}
              className="w-full rounded-md bg-slate-700 border border-slate-600 px-3 py-2 text-white"
            />
          </div>
        </label>

        {mode === "calculate" ? (
          <label className="text-sm text-slate-300">
            Target Total
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={targetInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setTargetInput(val);
                  const parsed = parseFloat(val);
                  if (!isNaN(parsed)) {
                    const normalized =
                      targetEditUnit === unit
                        ? parsed
                        : convert(parsed, targetEditUnit, unit);
                    setTargetTotal(normalized);
                  }
                }}
                className="w-full rounded-md bg-slate-700 border border-slate-600 px-3 py-2 text-white"
              />
              <div className="flex border border-slate-600 rounded-full overflow-hidden">
  <button
    type="button"
    className={`px-3 py-2 text-xs rounded-l-full transition-colors ${
      targetEditUnit === "kg" ? "bg-purple-600 text-white" : "text-slate-200"
    }`}
    onClick={() => handleTargetUnitChange("kg")}
  >
    KG
  </button>
  <button
    type="button"
    className={`px-3 py-2 text-xs rounded-r-full transition-colors ${
      targetEditUnit === "lb" ? "bg-purple-600 text-white" : "text-slate-200"
    }`}
    onClick={() => handleTargetUnitChange("lb")}
  >
    LB
  </button>
</div>

            </div>
            <div className="mt-1 text-xs text-slate-400">
              = {round2(convert(targetTotal, unit, targetEditUnit === "kg" ? "lb" : "kg"))} {targetEditUnit === "kg" ? "LB" : "KG"}
            </div>
          </label>
        ) : (
          <div className="flex items-end">
            <div className="text-slate-400 text-sm">
              Tap +/− on plates below to build the bar.
            </div>
          </div>
        )}
      </div>

      {/* KG/LB readout */}
      <div className="mb-3 text-center text-slate-300">
        <span className="text-white font-semibold">
          {mode === "calculate" ? round2(targetTotal) : reverseTotal ?? 0} {unit.toUpperCase()}
        </span>{" "}
        |{" "}
        <span className="text-slate-400">
          {round2(
            convert(
              mode === "calculate" ? targetTotal : reverseTotal ?? 0,
              unit,
              unit === "kg" ? "lb" : "kg"
            )
          )} {unit === "kg" ? "LB" : "KG"}
        </span>
      </div>

      {/* Reverse UI */}
      {mode === "reverse" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {sizesDesc.map((s) => {
              const count = reverseCounts[s] ?? 0;
              return (
                <div key={s} className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                  <div className={`mx-auto h-12 w-12 rounded-full border-2 border-slate-900 ${colorFor(s)} flex items-center justify-center text-xs font-bold`}>
                    {s}
                  </div>
                  <div className="mt-2 text-center text-xs text-slate-300">pairs/side</div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button className="p-1 rounded-md bg-slate-700 hover:bg-slate-600" onClick={() => decPair(s)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="min-w-6 text-center text-white">{count}</div>
                    <button className="p-1 rounded-md bg-slate-700 hover:bg-slate-600" onClick={() => incPair(s)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual bar */}
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/40 p-3">
            <div className="text-sm mb-2 text-slate-300">Visual</div>
            <div className="flex items-center justify-between">
              {renderPerSideStack(reverseCounts)}
              <div className="h-2 flex-1 mx-3 rounded bg-slate-600" />
              {renderPerSideStack(reverseCounts)}
            </div>
          </div>
        </>
      )}

      {/* Calculate UI */}
      {mode === "calculate" && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3">
          {!calcResult || calcResult.error ? (
            <div className="text-slate-400 text-sm">{calcResult?.error ?? "—"}</div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <div>
                  Per side target:{" "}
                  <span className="text-white font-semibold">{calcResult.perSideTarget} {unit}</span>
                </div>
                <div>
                  {calcResult.exact ? (
                    <span className="text-green-400">Exact match ✓</span>
                  ) : (
                    <span className="text-amber-400">Off by {calcResult.remaining} {unit}</span>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {sizesDesc.map((s) => {
                  const count = calcResult.counts[s] ?? 0;
                  return (
                    <div key={s} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full border-2 border-slate-900 ${colorFor(s)} flex items-center justify-center text-[10px] font-bold`}>
                          {s}
                        </div>
                        <div className="text-slate-200 text-sm">{s} {unit}</div>
                      </div>
                      <div className="text-white font-semibold">{count}×</div>
                    </div>
                  );
                })}
              </div>

{/* Visual bar */}
<div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/40 p-3">
  <div className="text-sm mb-2 text-slate-300">Visual</div>

  <div className="flex items-center justify-between">
    {renderPerSideStack(calcResult.counts)}
    <div className="h-2 flex-1 mx-3 rounded bg-slate-600" />
    {renderPerSideStack(calcResult.counts)}
  </div>

  <div className="mt-3 text-center text-slate-300 text-sm">
    Built total: <span className="text-white font-semibold">{calcResult.usedTotal} {unit}</span>
  </div>
</div>

              <div className="mt-3 text-center text-slate-300 text-sm">
                Built total: <span className="text-white font-semibold">{calcResult.usedTotal} {unit}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
import React from "react";
import {
  Dumbbell,
  Calendar as CalendarIcon,
  LineChart,
  MessageSquare,
  Layers, // icon for Load the Bar
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

import { TrainingCalendar } from "../components/train/TrainingCalendar";
import { WorkoutLogger } from "../components/train/WorkoutLogger";
import { CoachMessages } from "../components/train/CoachMessages";
import { TrainingStats } from "../components/train/TrainingStats";
// ❌ remove ProgramTemplates import
// import { ProgramTemplates } from "../components/train/ProgramTemplates";
import LoadTheBar from "../components/train/LoadTheBar"; // ✅ new

type TrainTab =
  | "calendar"
  | "logger"
  | "stats"
  | "messages"
  | "loadbar"; // ✅ new key

const TABS: Array<{
  value: TrainTab;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: "calendar",  title: "Calendar",       subtitle: "Plan your weeks",   Icon: CalendarIcon },
  { value: "logger",    title: "Workout Logger", subtitle: "Log sets & RPE",    Icon: Dumbbell },
  { value: "stats",     title: "Training Stats", subtitle: "PRs & trends",      Icon: LineChart },
  { value: "messages",  title: "Coach Messages", subtitle: "Chat with coach",   Icon: MessageSquare },
  { value: "loadbar",   title: "Load the Bar",   subtitle: "Plate calculator",  Icon: Layers }, // ✅ replaces templates
];

export const TrainPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Dumbbell className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Train</h1>
      </div>

      {/* Segmented Tabs */}
      <Tabs.Root defaultValue="calendar" className="w-full">
        <Tabs.List
          className="
            grid gap-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-1
            md:grid-cols-5
          "
        >
          {TABS.map(({ value, title, subtitle, Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className={`
                group flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left outline-none
                text-slate-200 hover:bg-white/5 transition
                data-[state=active]:bg-slate-700/70 data-[state=active]:text-white
                focus-visible:ring-2 focus-visible:ring-purple-500
                md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-slate-700
              `}
            >
              <Icon className="mt-0.5 h-5 w-5 text-slate-400 group-data-[state=active]:text-white" />
              <span>
                <div className="font-semibold leading-5">{title}</div>
                <div className="text-xs text-slate-300/80">{subtitle}</div>
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Content */}
        <div className="pt-6">
          <Tabs.Content value="calendar"><TrainingCalendar /></Tabs.Content>
          <Tabs.Content value="logger"><WorkoutLogger /></Tabs.Content>
          <Tabs.Content value="stats"><TrainingStats /></Tabs.Content>
          <Tabs.Content value="messages">
            {/* Fill the viewport minus header/tabs */}
            <div className="h-[calc(100vh-220px)] md:h-[calc(100vh-240px)]">
              <CoachMessages className="h-full" />
            </div>
          </Tabs.Content>
          <Tabs.Content value="loadbar">
            <LoadTheBar />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default TrainPage;

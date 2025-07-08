import React from 'react';
import { Dumbbell } from 'lucide-react';
import { TrainingCalendar } from '../components/train/TrainingCalendar';
import { WorkoutLogger } from '../components/train/WorkoutLogger';
import { CoachMessages } from '../components/train/CoachMessages';
import { TrainingStats } from '../components/train/TrainingStats';
import { ProgramTemplates } from '../components/train/ProgramTemplates';

export const TrainPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Dumbbell className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Train</h1>
      </div>

      {/* Main Layout - Desktop optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-1">
          <TrainingCalendar />
        </div>

        {/* Center Column - Workout Logger */}
        <div className="lg:col-span-1">
          <WorkoutLogger />
        </div>

        {/* Right Column - Stats and Messages */}
        <div className="lg:col-span-1 space-y-6">
          <TrainingStats />
          <CoachMessages />
        </div>
      </div>

      {/* Bottom Section - Program Templates and Spreadsheets */}
      <div className="mt-12">
        <ProgramTemplates />
      </div>
    </div>
  );
};
// src/admin/pages/LiveMeetPage.tsx
import React from 'react';
import { Radio, Play, Pause, Clock, Users } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { EmptyState } from '../components/shared/EmptyState';

export const LiveMeetPage: React.FC = () => {
  const hasActiveMeet = true; // Mock data

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Meet"
        subtitle="Real-time meet day operations and control"
        icon={Radio}
        actions={
          <Button className="flex items-center space-x-2">
            <Play size={16} />
            <span>Start Live Meet</span>
          </Button>
        }
      />

      {hasActiveMeet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Live Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Tampa Bay Open - Live Controls</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users size={20} className="text-blue-400" />
                    <span className="text-slate-400">Current Flight</span>
                  </div>
                  <div className="text-xl font-bold text-white">Flight B - Men 83kg</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={20} className="text-green-400" />
                    <span className="text-slate-400">Next Lifter</span>
                  </div>
                  <div className="text-xl font-bold text-white">John Smith</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-3">
                  <Button variant="secondary" className="flex items-center space-x-2">
                    <Pause size={16} />
                    <span>Pause Meet</span>
                  </Button>
                  <Button variant="outline">Next Lifter</Button>
                  <Button variant="outline">Technical Issue</Button>
                </div>
              </div>
            </Card>

            {/* Attempt Tracking */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Current Attempt</h3>
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">185kg</div>
                    <div className="text-sm text-slate-400">Attempt Weight</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">2:00</div>
                    <div className="text-sm text-slate-400">Time Remaining</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">3/3</div>
                    <div className="text-sm text-slate-400">Squat Attempt</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Live Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Flight Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-500/20 rounded border border-green-500/30">
                  <span className="text-white">Flight A</span>
                  <span className="text-green-400 text-sm">Completed</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-500/20 rounded border border-blue-500/30">
                  <span className="text-white">Flight B</span>
                  <span className="text-blue-400 text-sm">In Progress</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
                  <span className="text-slate-400">Flight C</span>
                  <span className="text-slate-500 text-sm">Waiting</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Announcements</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  5-minute warmup warning
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Equipment check
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Flight change
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Radio}
          title="No Active Meet"
          description="Start a live meet session to access real-time controls and management tools."
          action={{
            label: "Start Live Meet",
            onClick: () => console.log("Start live meet")
          }}
        />
      )}
    </div>
  );
};
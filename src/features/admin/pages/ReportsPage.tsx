// src/admin/pages/ReportsPage.tsx
import React from 'react';
import { FileText, Download, BarChart3, Users, Trophy, DollarSign } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { ParticipationReports } from '../components/reports/ParticipationReports';
import { PerformanceReports } from '../components/reports/PerformanceReports';
import { FinancialReports } from '../components/reports/FinancialReports';
import { AthleteAnalytics } from '../components/reports/AthleteAnalytics';
import { MeetComparison } from '../components/reports/MeetComparison';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';

type ReportsTab = 'participation' | 'performance' | 'financial' | 'athletes' | 'comparison';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ReportsTab>('participation');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate insights and track performance metrics"
        icon={FileText}
        actions={
          <Button className="flex items-center space-x-2">
            <Download size={16} />
            <span>Export All Data</span>
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Athletes"
          value={1247}
          icon={Users}
          trend={{ value: 12.5, label: 'vs last quarter' }}
        />
        <StatCard
          title="Meets Hosted"
          value={23}
          icon={Trophy}
          trend={{ value: 15.2, label: 'vs last quarter' }}
        />
        <StatCard
          title="Total Revenue"
          value="$47,890"
          icon={DollarSign}
          trend={{ value: 8.7, label: 'vs last quarter' }}
        />
        <StatCard
          title="Avg Satisfaction"
          value="4.8/5"
          icon={BarChart3}
          trend={{ value: 3.2, label: 'vs last quarter' }}
        />
      </div>

      {/* Report Navigation */}
      <Card>
        <div className="flex flex-wrap gap-1 p-1 bg-slate-900 rounded-lg">
          <button
            onClick={() => setActiveTab('participation')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'participation'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Participation Analytics
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Performance Reports
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'financial'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Financial Analysis
          </button>
          <button
            onClick={() => setActiveTab('athletes')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'athletes'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Athlete Analytics
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Meet Comparison
          </button>
        </div>
      </Card>

      {/* Report Content */}
      {activeTab === 'participation' && <ParticipationReports />}
      {activeTab === 'performance' && <PerformanceReports />}
      {activeTab === 'financial' && <FinancialReports />}
      {activeTab === 'athletes' && <AthleteAnalytics />}
      {activeTab === 'comparison' && <MeetComparison />}
    </div>
  );
};
import React from 'react';
import { LayoutDashboard, Users, Trophy, DollarSign, Calendar } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { FinancialSummary } from '../components/dashboard/FinancialSummary';
import { LiveMeetStatus } from '../components/dashboard/LiveMeetStatus';
import { NotificationCenter } from '../components/dashboard/NotificationCenter';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentRegistrations } from '../components/dashboard/RecentRegistrations';
import { UpcomingMeetsCard } from '../components/dashboard/UpcomingMeetsCard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your meets."
        icon={LayoutDashboard}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Athletes"
          value={1247}
          icon={Users}
          trend={{ value: 12.5, label: 'vs last month' }}
        />
        <StatCard
          title="Active Meets"
          value={8}
          icon={Trophy}
          trend={{ value: 25, label: 'vs last month' }}
        />
        <StatCard
          title="Total Revenue"
          value="$15,420"
          icon={DollarSign}
          trend={{ value: 8.2, label: 'vs last month' }}
        />
        <StatCard
          title="This Month"
          value={23}
          icon={Calendar}
          trend={{ value: -5.1, label: 'vs last month' }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <FinancialSummary />
          <UpcomingMeetsCard />
          <RecentRegistrations />
          <QuickActions />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <LiveMeetStatus />
          <NotificationCenter />
        </div>
      </div>
    </div>
  );
};
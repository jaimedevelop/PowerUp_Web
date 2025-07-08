// src/admin/pages/ReportsPage.tsx
import React from 'react';
import { FileText, Download, BarChart3, Users, Trophy, DollarSign } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { ParticipationReports } from '../components/reports/ParticipationReports';
import { PerformanceReports } from '../components/reports/PerformanceReports';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'participation' | 'performance' | 'financial'>('participation');

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
        <div className="flex space-x-1 p-1 bg-slate-900 rounded-lg">
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
        </div>
      </Card>

      {/* Report Content */}
      {activeTab === 'participation' && <ParticipationReports />}
      {activeTab === 'performance' && <PerformanceReports />}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-bold text-white mb-6">Revenue Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-4">Revenue by Meet</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Tampa Bay Open', revenue: 3375, registrations: 45 },
                    { name: 'Florida Championships', revenue: 5025, registrations: 67 },
                    { name: 'Summer Classic', revenue: 1955, registrations: 28 },
                    { name: 'Winter Meet', revenue: 2340, registrations: 31 }
                  ].map((meet, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div>
                        <span className="text-white font-medium">{meet.name}</span>
                        <p className="text-sm text-slate-400">{meet.registrations} registrations</p>
                      </div>
                      <span className="text-green-400 font-bold">${meet.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-4">Payment Methods</h4>
                <div className="space-y-3">
                  {[
                    { method: 'Credit Card', percentage: 75, amount: 35920 },
                    { method: 'PayPal', percentage: 18, amount: 8620 },
                    { method: 'Bank Transfer', percentage: 5, amount: 2395 },
                    { method: 'Cash', percentage: 2, amount: 955 }
                  ].map((payment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{payment.method}</span>
                        <span className="text-white">${payment.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full h-2"
                          style={{ width: `${payment.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-white mb-6">Financial Trends</h3>
            <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <DollarSign size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Revenue trend chart would appear here</p>
                <p className="text-slate-500 text-sm mt-2">Monthly revenue, profit margins, growth trends</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
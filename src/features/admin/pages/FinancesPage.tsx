// src/admin/pages/FinancesPage.tsx
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { FinancialOverview } from '../components/finances/FinancialOverview';
import { PaymentProcessing } from '../components/finances/PaymentProcessing';
import { RevenueTracking } from '../components/finances/RevenueTracking';
import { ExpenseManagement } from '../components/finances/ExpenseManagement';
import { FinancialReports } from '../components/finances/FinancialReports';

type FinancesTab = 'overview' | 'payments' | 'revenue' | 'expenses' | 'reports';

export const FinancesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinancesTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'payments', label: 'Payments' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'reports', label: 'Reports' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <FinancialOverview />;
      case 'payments':
        return <PaymentProcessing />;
      case 'revenue':
        return <RevenueTracking />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'reports':
        return <FinancialReports />;
      default:
        return <FinancialOverview />;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Finances"
        subtitle="Track revenue, payments, and financial performance"
        icon={DollarSign}
      />

      {/* Tab Navigation */}
      <div className="border-b border-slate-700">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FinancesTab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

// src/admin/components/reports/ParticipationReports.tsx
import React from 'react';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';

export const ParticipationReports: React.FC = () => {
  const demographicData = [
    { category: 'Age Groups', data: [
      { label: '18-25', value: 45, percentage: 36 },
      { label: '26-35', value: 52, percentage: 42 },
      { label: '36-45', value: 28, percentage: 22 }
    ]},
    { category: 'Experience Level', data: [
      { label: 'Novice', value: 38, percentage: 30 },
      { label: 'Intermediate', value: 67, percentage: 54 },
      { label: 'Advanced', value: 20, percentage: 16 }
    ]},
    { category: 'Geographic Distribution', data: [
      { label: 'Tampa Bay', value: 45, percentage: 36 },
      { label: 'Orlando', value: 32, percentage: 26 },
      { label: 'Miami', value: 28, percentage: 22 },
      { label: 'Other FL', value: 20, percentage: 16 }
    ]}
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {demographicData.map((section, index) => (
        <Card key={index}>
          <h3 className="text-lg font-semibold text-white mb-4">{section.category}</h3>
          <div className="space-y-3">
            {section.data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
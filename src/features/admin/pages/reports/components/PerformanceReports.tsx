// src/admin/components/reports/PerformanceReports.tsx
import React from 'react';
import { Trophy, Target, Award } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';

export const PerformanceReports: React.FC = () => {
  const performanceMetrics = [
    { meet: 'Tampa Bay Open', avgTotal: 485, records: 3, participants: 45 },
    { meet: 'Florida Championships', avgTotal: 512, records: 7, participants: 67 },
    { meet: 'Summer Classic', avgTotal: 467, records: 2, participants: 28 },
    { meet: 'Winter Championships', avgTotal: 498, records: 5, participants: 52 }
  ];

  const records = [
    { category: 'Men Open Squat', weight: '290kg', athlete: 'John Smith', meet: 'Florida Championships' },
    { category: 'Women Open Deadlift', weight: '205kg', athlete: 'Sarah Wilson', meet: 'Tampa Bay Open' },
    { category: 'Men Junior Bench', weight: '165kg', athlete: 'Mike Johnson', meet: 'Summer Classic' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-bold text-white mb-6">Meet Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 pb-3">Meet</th>
                <th className="text-left text-slate-400 pb-3">Avg Total</th>
                <th className="text-left text-slate-400 pb-3">Records Set</th>
                <th className="text-left text-slate-400 pb-3">Participants</th>
              </tr>
            </thead>
            <tbody>
              {performanceMetrics.map((metric, index) => (
                <tr key={index} className="border-b border-slate-800">
                  <td className="py-3 text-white font-medium">{metric.meet}</td>
                  <td className="py-3 text-slate-300">{metric.avgTotal}kg</td>
                  <td className="py-3 text-green-400">{metric.records}</td>
                  <td className="py-3 text-slate-300">{metric.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-6">Recent Records</h3>
        <div className="space-y-4">
          {records.map((record, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{record.category}</h4>
                  <p className="text-sm text-slate-400">{record.athlete} • {record.meet}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{record.weight}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
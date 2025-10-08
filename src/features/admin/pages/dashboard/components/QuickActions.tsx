// QuickActions.tsx
import React from 'react';
import { Plus, Radio, MessageSquare, FileText } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Create New Meet',
      description: 'Set up a new competition',
      color: 'from-green-500 to-emerald-500',
      onClick: () => console.log('Create meet')
    },
    {
      icon: Radio,
      label: 'Go Live',
      description: 'Start live meet mode',
      color: 'from-red-500 to-orange-500',
      onClick: () => console.log('Go live')
    },
    {
      icon: MessageSquare,
      label: 'Send Update',
      description: 'Message participants',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => console.log('Send message')
    },
    {
      icon: FileText,
      label: 'Generate Report',
      description: 'Create analytics report',
      color: 'from-purple-500 to-pink-500',
      onClick: () => console.log('Generate report')
    }
  ];

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-200 text-left group"
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} className="text-white" />
            </div>
            <h4 className="font-medium text-white mb-1">{action.label}</h4>
            <p className="text-sm text-slate-400">{action.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
};
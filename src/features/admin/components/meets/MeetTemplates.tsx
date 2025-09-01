import React from 'react';
import { Copy, FileText, Star, Plus } from 'lucide-react';

interface MeetTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  lastUsed?: string;
}

const mockTemplates: MeetTemplate[] = [
  {
    id: '1',
    name: 'USPA Standard Meet',
    description: 'Standard USPA competition with 3 attempts per lift',
    isDefault: true,
    lastUsed: '2025-06-15'
  },
  {
    id: '2',
    name: 'Push/Pull Only',
    description: 'Bench press and deadlift only competition',
    isDefault: false,
    lastUsed: '2025-05-20'
  },
  {
    id: '3',
    name: 'Beginner Friendly',
    description: 'Simplified rules for first-time competitors',
    isDefault: false,
    lastUsed: '2025-04-10'
  }
];

export const MeetTemplates: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Meet Templates</h3>
        <button className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTemplates.map((template) => (
          <div key={template.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <FileText className="text-blue-400 mr-2" size={18} />
                <h4 className="font-medium text-white">{template.name}</h4>
                {template.isDefault && (
                  <span className="ml-2 px-1.5 py-0.5 bg-purple-900 text-purple-300 text-xs rounded-full flex items-center">
                    <Star size={10} className="mr-1" />
                    Default
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-4">{template.description}</p>
            
            {template.lastUsed && (
              <div className="text-xs text-slate-500 mb-4">
                Last used: {new Date(template.lastUsed).toLocaleDateString()}
              </div>
            )}
            
            <button className="w-full flex items-center justify-center space-x-2 text-sm bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors">
              <Copy size={14} />
              <span>Use Template</span>
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-400">
            Templates help you create meets faster with pre-configured settings
          </div>
          <button className="text-blue-400 hover:text-blue-300">
            Manage Templates
          </button>
        </div>
      </div>
    </div>
  );
};
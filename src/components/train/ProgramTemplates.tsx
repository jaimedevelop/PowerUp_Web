import React from 'react';
import { BookOpen, Star, Trophy, Download, Plus } from 'lucide-react';

export const ProgramTemplates: React.FC = () => {
  const programs = [
    {
      id: 1,
      name: 'Beginner Linear Progression',
      duration: '12 weeks',
      difficulty: 'Beginner',
      frequency: '3 days/week',
      description: 'Build strength fundamentals with progressive overload. Focuses on squat, bench, and deadlift technique.',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700/30'
    },
    {
      id: 2,
      name: 'Intermediate Block Periodization',
      duration: '16 weeks',
      difficulty: 'Intermediate',
      frequency: '4 days/week',
      description: 'Advanced programming with accumulation, intensification, and realization blocks.',
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700/30'
    },
    {
      id: 3,
      name: 'Competition Peaking',
      duration: '8 weeks',
      difficulty: 'Advanced',
      frequency: '3-4 days/week',
      description: 'Specialized program to peak for competition. Includes opener, second, and third attempt planning.',
      icon: Trophy,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700/30'
    }
  ];

  const spreadsheets = [
    {
      name: '12-Week Peaking Program',
      lastUpdated: '2 days ago',
      progress: 'Week 8 of 12',
      color: 'text-green-400'
    },
    {
      name: 'Volume Accumulation Block',
      lastUpdated: '1 week ago',
      progress: 'Week 4 of 6',
      color: 'text-blue-400'
    },
    {
      name: 'Accessory Work Template',
      lastUpdated: '3 days ago',
      progress: 'Active',
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Program Templates */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-purple-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Program Templates</h3>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            Browse All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {programs.map((program) => {
            const IconComponent = program.icon;
            
            return (
              <div key={program.id} className={`${program.bgColor} rounded-lg p-4 border ${program.borderColor}`}>
                <div className="flex items-center mb-3">
                  <IconComponent className={`w-6 h-6 ${program.color} mr-2`} />
                  <span className={`text-xs px-2 py-1 rounded-full ${program.bgColor} ${program.color} border ${program.borderColor}`}>
                    {program.difficulty}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-2">{program.name}</h4>
                <p className="text-sm text-slate-300 mb-3">{program.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{program.duration}</span>
                  <span>{program.frequency}</span>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
                  Start Program
                </button>
              </div>
            );
          })}
        </div>

        <button className="w-full mt-4 border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-purple-500 hover:bg-purple-900/10 transition-colors">
          <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 font-medium">Create Custom Program</p>
          <p className="text-xs text-slate-500">Build your own training template</p>
        </button>
      </div>

      {/* Training Spreadsheets */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Download className="w-6 h-6 text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Training Spreadsheets</h3>
          </div>
          <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
            Upload New
          </button>
        </div>

        <div className="space-y-3">
          {spreadsheets.map((sheet, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-3">
                  <Download className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{sheet.name}</h4>
                  <p className="text-sm text-slate-400">Updated {sheet.lastUpdated}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${sheet.color}`}>{sheet.progress}</p>
                <button className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
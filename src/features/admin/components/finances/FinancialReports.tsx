import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, RefreshCw, Search } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'revenue' | 'expense' | 'profit' | 'registration' | 'payment';
  dateRange: string;
  generatedDate: string;
  format: 'pdf' | 'csv' | 'excel';
  size: string;
}

interface FinancialReportsProps {
  meetId?: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Revenue Report',
    description: 'Comprehensive breakdown of monthly revenue sources',
    type: 'revenue',
    dateRange: 'Jul 2025',
    generatedDate: '2025-08-01',
    format: 'pdf',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'Expense Summary',
    description: 'Detailed expense tracking by category',
    type: 'expense',
    dateRange: 'Q3 2025',
    generatedDate: '2025-07-15',
    format: 'excel',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Profit & Loss Statement',
    description: 'Quarterly profit and loss analysis',
    type: 'profit',
    dateRange: 'Q2 2025',
    generatedDate: '2025-07-10',
    format: 'pdf',
    size: '3.1 MB'
  },
  {
    id: '4',
    title: 'Registration Analytics',
    description: 'Registration trends and demographics',
    type: 'registration',
    dateRange: 'Jan - Jul 2025',
    generatedDate: '2025-08-05',
    format: 'pdf',
    size: '4.2 MB'
  },
  {
    id: '5',
    title: 'Payment Processing Report',
    description: 'Payment methods and processing efficiency',
    type: 'payment',
    dateRange: 'Jul 2025',
    generatedDate: '2025-08-03',
    format: 'csv',
    size: '0.8 MB'
  }
];

const reportTemplates = [
  {
    id: 'revenue-monthly',
    title: 'Monthly Revenue Report',
    description: 'Comprehensive breakdown of monthly revenue sources',
    type: 'revenue' as const
  },
  {
    id: 'expense-quarterly',
    title: 'Quarterly Expense Summary',
    description: 'Detailed expense tracking by category',
    type: 'expense' as const
  },
  {
    id: 'profit-yearly',
    title: 'Annual Profit & Loss',
    description: 'Complete yearly profit and loss analysis',
    type: 'profit' as const
  },
  {
    id: 'registration-custom',
    title: 'Custom Registration Report',
    description: 'Registration trends for selected date range',
    type: 'registration' as const
  },
  {
    id: 'payment-summary',
    title: 'Payment Processing Summary',
    description: 'Payment methods and processing efficiency',
    type: 'payment' as const
  }
];

export const FinancialReports: React.FC<FinancialReportsProps> = ({ meetId }) => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <TrendingUp className="text-green-400" size={20} />;
      case 'expense': return <TrendingDown className="text-red-400" size={20} />;
      case 'profit': return <DollarSign className="text-blue-400" size={20} />;
      case 'registration': return <BarChart3 className="text-purple-400" size={20} />;
      case 'payment': return <RefreshCw className="text-yellow-400" size={20} />;
      default: return <FileText className="text-slate-400" size={20} />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <div className="text-red-400 text-xs font-bold">PDF</div>;
      case 'csv': return <div className="text-green-400 text-xs font-bold">CSV</div>;
      case 'excel': return <div className="text-blue-400 text-xs font-bold">XLS</div>;
      default: return <div className="text-slate-400 text-xs">?</div>;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleGenerateReport = () => {
    if (selectedTemplate && dateRange.start && dateRange.end) {
      const template = reportTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const newReport: Report = {
          id: Date.now().toString(),
          title: template.title,
          description: template.description,
          type: template.type,
          dateRange: `${dateRange.start} - ${dateRange.end}`,
          generatedDate: new Date().toISOString().split('T')[0],
          format: format,
          size: 'Generating...'
        };

        setReports([newReport, ...reports]);
        setShowGenerator(false);
        setSelectedTemplate('');
        setDateRange({ start: '', end: '' });
      }
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileText className="mr-2" size={20} />
          Financial Reports
        </h3>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <FileText size={16} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Report Generator */}
      {showGenerator && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-4">Generate New Report</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Report Type</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a report type</option>
                {reportTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {selectedTemplate && (
            <div className="mt-4 p-3 bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-300">
                {reportTemplates.find(t => t.id === selectedTemplate)?.description}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleGenerateReport}
              disabled={!selectedTemplate || !dateRange.start || !dateRange.end}
              className={`flex-1 py-2 rounded-lg ${
                selectedTemplate && dateRange.start && dateRange.end
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Generate Report
            </button>
            <button
              onClick={() => setShowGenerator(false)}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Reports</div>
            <FileText className="text-slate-400" size={16} />
          </div>
          <div className="text-xl font-bold text-white">{reports.length}</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Revenue Reports</div>
            <TrendingUp className="text-green-400" size={16} />
          </div>
          <div className="text-xl font-bold text-white">
            {reports.filter(r => r.type === 'revenue').length}
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Expense Reports</div>
            <TrendingDown className="text-red-400" size={16} />
          </div>
          <div className="text-xl font-bold text-white">
            {reports.filter(r => r.type === 'expense').length}
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">This Month</div>
            <Calendar className="text-blue-400" size={16} />
          </div>
          <div className="text-xl font-bold text-white">
            {reports.filter(r => {
              const reportDate = new Date(r.generatedDate);
              const currentDate = new Date();
              return reportDate.getMonth() === currentDate.getMonth() && 
                     reportDate.getFullYear() === currentDate.getFullYear();
            }).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
          <option value="profit">Profit</option>
          <option value="registration">Registration</option>
          <option value="payment">Payment</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  {getReportIcon(report.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white">{report.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">{report.size}</span>
                      {getFormatIcon(report.format)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{report.description}</p>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar size={12} className="mr-1" />
                    <span>{report.dateRange}</span>
                    <span className="mx-2">•</span>
                    <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Download size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <FileText size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No reports found</p>
          <p className="text-sm mt-1">Try adjusting your filters or generate a new report</p>
        </div>
      )}
    </div>
  );
};
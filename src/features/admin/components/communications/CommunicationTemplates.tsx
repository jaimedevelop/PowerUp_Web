import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Filter, Mail, MessageSquare, Smartphone, Megaphone, Copy, Eye } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'announcement';
  content: string;
  category: 'welcome' | 'reminder' | 'update' | 'notification' | 'promotion';
  variables: string[];
  lastUsed?: string;
  useCount: number;
}

interface CommunicationTemplatesProps {
  meetId?: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Email',
    description: 'Welcome new participants to the meet',
    type: 'email',
    category: 'welcome',
    content: 'Dear [ATHLETE_NAME],\n\nWelcome to the [MEET_NAME]! We\'re excited to have you compete with us on [MEET_DATE].\n\nPlease make sure to complete your registration and payment by [PAYMENT_DEADLINE].\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards,\n[ORGANIZER_NAME]',
    variables: ['ATHLETE_NAME', 'MEET_NAME', 'MEET_DATE', 'PAYMENT_DEADLINE', 'ORGANIZER_NAME'],
    useCount: 45,
    lastUsed: '2025-07-15'
  },
  {
    id: '2',
    name: 'Payment Reminder',
    description: 'Remind participants about pending payments',
    type: 'email',
    category: 'reminder',
    content: 'Dear [ATHLETE_NAME],\n\nThis is a reminder that your registration payment for [MEET_NAME] is still pending.\n\nPlease complete your payment by [PAYMENT_DEADLINE] to secure your spot in the competition.\n\nIf you have already made the payment, please disregard this message.\n\nThank you,\n[ORGANIZER_NAME]',
    variables: ['ATHLETE_NAME', 'MEET_NAME', 'PAYMENT_DEADLINE', 'ORGANIZER_NAME'],
    useCount: 23,
    lastUsed: '2025-07-20'
  },
  {
    id: '3',
    name: 'Weigh-in Reminder',
    description: 'SMS reminder about weigh-in procedures',
    type: 'sms',
    category: 'reminder',
    content: 'Reminder: Weigh-in for [MEET_NAME] is tomorrow at [WEIGH_IN_TIME]. Please arrive 30 minutes early and bring your ID.',
    variables: ['MEET_NAME', 'WEIGH_IN_TIME'],
    useCount: 67,
    lastUsed: '2025-08-09'
  },
  {
    id: '4',
    name: 'Schedule Update',
    description: 'Notification about schedule changes',
    type: 'announcement',
    category: 'update',
    content: 'Important Schedule Update: [FLIGHT] will begin [TIME] earlier than originally scheduled. Please plan accordingly and arrive at the venue at least 45 minutes before your flight.',
    variables: ['FLIGHT', 'TIME'],
    useCount: 12,
    lastUsed: '2025-08-05'
  }
];

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'announcement', label: 'Announcement' }
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'welcome', label: 'Welcome' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'update', label: 'Update' },
  { value: 'notification', label: 'Notification' },
  { value: 'promotion', label: 'Promotion' }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="text-blue-400" size={18} />;
    case 'sms': return <Smartphone className="text-green-400" size={18} />;
    case 'announcement': return <Megaphone className="text-purple-400" size={18} />;
    default: return <FileText className="text-slate-400" size={18} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'email': return 'text-blue-400';
    case 'sms': return 'text-green-400';
    case 'announcement': return 'text-purple-400';
    default: return 'text-slate-400';
  }
};

export const CommunicationTemplates: React.FC<CommunicationTemplatesProps> = ({ meetId }) => {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'email' as const,
    category: 'welcome' as const,
    content: '',
    variables: ''
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalTemplates = templates.length;
  const mostUsed = templates.reduce((max, template) => template.useCount > max.useCount ? template : max, templates[0]);
  const recentlyUsed = templates.reduce((max, template) => {
    if (!template.lastUsed) return max;
    if (!max.lastUsed) return template;
    return new Date(template.lastUsed) > new Date(max.lastUsed) ? template : max;
  }, templates[0]);

  const handleSubmit = () => {
    if (newTemplate.name && newTemplate.content) {
      const variables = newTemplate.variables
        .split(',')
        .map(v => v.trim())
        .filter(v => v.startsWith('[') && v.endsWith(']'));

      const template: Template = {
        id: editingTemplate?.id || Date.now().toString(),
        name: newTemplate.name,
        description: newTemplate.description,
        type: newTemplate.type,
        category: newTemplate.category,
        content: newTemplate.content,
        variables: variables,
        useCount: editingTemplate?.useCount || 0,
        lastUsed: editingTemplate?.lastUsed
      };

      if (editingTemplate) {
        setTemplates(templates.map(t => t.id === editingTemplate.id ? template : t));
        setEditingTemplate(null);
      } else {
        setTemplates([template, ...templates]);
      }

      setNewTemplate({
        name: '',
        description: '',
        type: 'email',
        category: 'welcome',
        content: '',
        variables: ''
      });
      setShowForm(false);
    }
  };

  const handleEdit = (template: Template) => {
    setNewTemplate({
      name: template.name,
      description: template.description,
      type: template.type as 'email' | 'sms' | 'announcement',
      category: template.category as 'welcome' | 'reminder' | 'update' | 'notification' | 'promotion',
      content: template.content,
      variables: template.variables.join(', ')
    });
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      useCount: 0,
      lastUsed: undefined
    };
    setTemplates([newTemplate, ...templates]);
  };

  const handleUseTemplate = (template: Template) => {
    console.log(`Using template ${template.id}`);
    // In a real app, this would open the appropriate message composer with the template content
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileText className="mr-2" size={20} />
          Communication Templates
        </h3>
        <button
          onClick={() => {
            setNewTemplate({
              name: '',
              description: '',
              type: 'email',
              category: 'welcome',
              content: '',
              variables: ''
            });
            setEditingTemplate(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>{editingTemplate ? 'Edit Template' : 'New Template'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Templates</div>
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <FileText className="text-blue-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{totalTemplates}</div>
          <div className="text-xs text-slate-500 mt-1">Available templates</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Most Used</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <MessageSquare className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{mostUsed.name}</div>
          <div className="text-xs text-slate-500 mt-1">
            Used {mostUsed.useCount} times
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Recently Used</div>
            <div className="p-1.5 rounded-full bg-purple-500/20">
              <Eye className="text-purple-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{recentlyUsed.name}</div>
          <div className="text-xs text-slate-500 mt-1">
            Last used: {recentlyUsed.lastUsed || 'N/A'}
          </div>
        </div>
      </div>

      {/* New Template Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-4">
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Template name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <input
                type="text"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="welcome">Welcome</option>
                <option value="reminder">Reminder</option>
                <option value="update">Update</option>
                <option value="notification">Notification</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
            <textarea
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none"
              placeholder="Template content"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Variables (comma-separated, e.g., [NAME], [DATE])
            </label>
            <input
              type="text"
              value={newTemplate.variables}
              onChange={(e) => setNewTemplate({...newTemplate, variables: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="[VARIABLE1], [VARIABLE2]"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTemplate(null);
              }}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search templates..."
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
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getTypeIcon(template.type)}
                    <h4 className="font-medium text-white ml-2">{template.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getTypeColor(template.type)}`}>
                      {template.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">
                      {categoryOptions.find(c => c.value === template.category)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-300 mb-3">
                  {template.description}
                </div>
                
                <div className="text-sm text-slate-400 mb-3 bg-slate-800 p-3 rounded-lg font-mono text-xs">
                  {template.content.substring(0, 150)}
                  {template.content.length > 150 ? '...' : ''}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.variables.map((variable, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-slate-800 text-blue-400 rounded">
                      {variable}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-slate-400">Used</div>
                    <div className="text-white">{template.useCount} times</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Last Used</div>
                    <div className="text-white">{template.lastUsed || 'Never'}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Variables</div>
                    <div className="text-white">{template.variables.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => handleUseTemplate(template)}
                  className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                  title="Use Template"
                >
                  <MessageSquare size={16} />
                </button>
                <button 
                  onClick={() => handleDuplicate(template)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button 
                  onClick={() => handleEdit(template)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <FileText size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No templates found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new template</p>
        </div>
      )}
    </div>
  );
};
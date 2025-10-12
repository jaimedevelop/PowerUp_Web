import React, { useState } from 'react';
import { Mail, Send, Users, Calendar, BarChart3, Filter, Download, Plus, Edit, Trash2, Eye, Check } from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  recipients: number;
  sentDate?: string;
  scheduledDate?: string;
  openRate: number;
  clickRate: number;
  templateId?: string;
}

interface EmailCampaignsProps {
  meetId?: string;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Tampa Bay Open Welcome',
    subject: 'Welcome to the Tampa Bay Open!',
    status: 'sent',
    recipients: 45,
    sentDate: '2025-07-15',
    openRate: 78,
    clickRate: 32,
    templateId: 'welcome_template'
  },
  {
    id: '2',
    name: 'Payment Reminder',
    subject: 'Action Required: Complete Your Registration Payment',
    status: 'sent',
    recipients: 12,
    sentDate: '2025-07-20',
    openRate: 92,
    clickRate: 45,
    templateId: 'payment_reminder'
  },
  {
    id: '3',
    name: 'Weigh-in Instructions',
    subject: 'Important Weigh-in Information for Tampa Bay Open',
    status: 'scheduled',
    recipients: 45,
    scheduledDate: '2025-08-10',
    openRate: 0,
    clickRate: 0,
    templateId: 'weigh_in_instructions'
  },
  {
    id: '4',
    name: 'Meet Day Schedule',
    subject: 'Final Schedule for Tampa Bay Open',
    status: 'draft',
    recipients: 0,
    openRate: 0,
    clickRate: 0
  }
];

const emailTemplates = [
  { id: 'welcome_template', name: 'Welcome Email', description: 'Welcome new participants to the meet' },
  { id: 'payment_reminder', name: 'Payment Reminder', description: 'Remind participants about pending payments' },
  { id: 'weigh_in_instructions', name: 'Weigh-in Instructions', description: 'Provide details about weigh-in procedures' },
  { id: 'schedule_update', name: 'Schedule Update', description: 'Notify participants of schedule changes' }
];

export const EmailCampaigns: React.FC<EmailCampaignsProps> = ({ meetId }) => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    recipients: 0,
    templateId: '',
    scheduledDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'sent': return 'text-green-400 bg-green-500/20';
      case 'sending': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalSent = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.recipients, 0);
  const totalOpens = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + Math.round(c.recipients * c.openRate / 100), 0);
  const averageOpenRate = totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0;

  const handleSubmit = () => {
    if (newCampaign.name && newCampaign.subject) {
      const campaign: EmailCampaign = {
        id: editingCampaign?.id || Date.now().toString(),
        name: newCampaign.name,
        subject: newCampaign.subject,
        status: 'draft',
        recipients: newCampaign.recipients,
        openRate: 0,
        clickRate: 0,
        templateId: newCampaign.templateId || undefined,
        scheduledDate: newCampaign.scheduledDate || undefined
      };

      if (editingCampaign) {
        setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? campaign : c));
        setEditingCampaign(null);
      } else {
        setCampaigns([campaign, ...campaigns]);
      }

      setNewCampaign({
        name: '',
        subject: '',
        recipients: 0,
        templateId: '',
        scheduledDate: ''
      });
      setShowForm(false);
    }
  };

  const handleEdit = (campaign: EmailCampaign) => {
    setNewCampaign({
      name: campaign.name,
      subject: campaign.subject,
      recipients: campaign.recipients,
      templateId: campaign.templateId || '',
      scheduledDate: campaign.scheduledDate || ''
    });
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleSendTest = (id: string) => {
    console.log(`Sending test email for campaign ${id}`);
    // In a real app, this would trigger a test email
  };

  const handleSendCampaign = (id: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: 'sending' as const } : c
    ));
    
    // Simulate sending process
    setTimeout(() => {
      setCampaigns(campaigns.map(c => 
        c.id === id ? { ...c, status: 'sent' as const, sentDate: new Date().toISOString().split('T')[0] } : c
      ));
    }, 2000);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Mail className="mr-2" size={20} />
          Email Campaigns
        </h3>
        <button
          onClick={() => {
            setNewCampaign({
              name: '',
              subject: '',
              recipients: 0,
              templateId: '',
              scheduledDate: ''
            });
            setEditingCampaign(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Sent</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <Mail className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{totalSent}</div>
          <div className="text-xs text-slate-500 mt-1">Emails delivered</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Open Rate</div>
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <BarChart3 className="text-blue-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{averageOpenRate}%</div>
          <div className="text-xs text-slate-500 mt-1">Average open rate</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Active Campaigns</div>
            <div className="p-1.5 rounded-full bg-purple-500/20">
              <Send className="text-purple-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {campaigns.filter(c => c.status === 'scheduled' || c.status === 'sending').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Scheduled or sending</div>
        </div>
      </div>

      {/* New Campaign Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-4">
            {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Campaign Name</label>
              <input
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Campaign name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Template</label>
              <select
                value={newCampaign.templateId}
                onChange={(e) => setNewCampaign({...newCampaign, templateId: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a template</option>
                {emailTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Schedule (Optional)</label>
              <input
                type="datetime-local"
                value={newCampaign.scheduledDate}
                onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCampaign(null);
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
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="sending">Sending</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{campaign.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-slate-300 mb-3">{campaign.subject}</div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-slate-400">Recipients</div>
                    <div className="text-white">{campaign.recipients}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Open Rate</div>
                    <div className="text-white">{campaign.openRate}%</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Click Rate</div>
                    <div className="text-white">{campaign.clickRate}%</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">
                      {campaign.status === 'sent' ? 'Sent Date' : 
                       campaign.status === 'scheduled' ? 'Scheduled Date' : 'Created'}
                    </div>
                    <div className="text-white">
                      {campaign.sentDate || campaign.scheduledDate || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => handleSendTest(campaign.id)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Send Test"
                >
                  <Mail size={16} />
                </button>
                <button 
                  onClick={() => handleEdit(campaign)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                {campaign.status === 'draft' && (
                  <button 
                    onClick={() => handleSendCampaign(campaign.id)}
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                    title="Send Campaign"
                  >
                    <Send size={16} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(campaign.id)}
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

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Mail size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No campaigns found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new campaign</p>
        </div>
      )}
    </div>
  );
};
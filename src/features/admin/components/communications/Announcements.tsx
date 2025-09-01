import React, { useState } from 'react';
import { Megaphone, Send, Calendar, Eye, Pin, Filter, Search, Plus, Edit, Trash2, Bell } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'archived';
  publishDate?: string;
  expiryDate?: string;
  targetAudience: 'all' | 'athletes' | 'coaches' | 'officials' | 'spectators';
  views: number;
  pinned: boolean;
}

interface AnnouncementsProps {
  meetId?: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Weigh-in Schedule Update',
    content: 'Please note that the weigh-in schedule for the Tampa Bay Open has been updated. All athletes should check the new schedule and arrive at least 30 minutes before their scheduled time.',
    priority: 'high',
    status: 'published',
    publishDate: '2025-08-05',
    expiryDate: '2025-08-15',
    targetAudience: 'athletes',
    views: 78,
    pinned: true
  },
  {
    id: '2',
    title: 'Payment Deadline Reminder',
    content: 'This is a reminder that all registration payments must be completed by August 10th. Unpaid registrations will be cancelled to make room for waitlisted athletes.',
    priority: 'medium',
    status: 'published',
    publishDate: '2025-08-03',
    expiryDate: '2025-08-10',
    targetAudience: 'all',
    views: 124,
    pinned: false
  },
  {
    id: '3',
    title: 'Volunteer Opportunities',
    content: 'We are still looking for volunteers to help with various aspects of the Tampa Bay Open. If you are interested in helping, please contact the organizing committee.',
    priority: 'low',
    status: 'published',
    publishDate: '2025-08-01',
    targetAudience: 'all',
    views: 56,
    pinned: false
  },
  {
    id: '4',
    title: 'Officials Briefing',
    content: 'A mandatory briefing for all officials will be held on August 14th at 6 PM in the main conference room. Please confirm your attendance.',
    priority: 'high',
    status: 'draft',
    targetAudience: 'officials',
    views: 0,
    pinned: false
  }
];

const audienceOptions = [
  { value: 'all', label: 'All Participants' },
  { value: 'athletes', label: 'Athletes Only' },
  { value: 'coaches', label: 'Coaches Only' },
  { value: 'officials', label: 'Officials Only' },
  { value: 'spectators', label: 'Spectators Only' }
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
];

export const Announcements: React.FC<AnnouncementsProps> = ({ meetId }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    targetAudience: 'all' as 'all' | 'athletes' | 'coaches' | 'officials' | 'spectators',
    publishDate: '',
    expiryDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      case 'published': return 'text-green-400 bg-green-500/20';
      case 'archived': return 'text-slate-400 bg-slate-700';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.color : 'text-slate-400';
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter;
    const matchesAudience = audienceFilter === 'all' || announcement.targetAudience === audienceFilter;
    
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);
  const publishedCount = announcements.filter(a => a.status === 'published').length;
  const pinnedCount = announcements.filter(a => a.pinned).length;

  const handleSubmit = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement: Announcement = {
        id: editingAnnouncement?.id || Date.now().toString(),
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        priority: newAnnouncement.priority,
        status: 'draft',
        targetAudience: newAnnouncement.targetAudience,
        views: editingAnnouncement?.views || 0,
        pinned: editingAnnouncement?.pinned || false,
        publishDate: newAnnouncement.publishDate || undefined,
        expiryDate: newAnnouncement.expiryDate || undefined
      };

      if (editingAnnouncement) {
        setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? announcement : a));
        setEditingAnnouncement(null);
      } else {
        setAnnouncements([announcement, ...announcements]);
      }

      setNewAnnouncement({
        title: '',
        content: '',
        priority: 'medium',
        targetAudience: 'all',
        publishDate: '',
        expiryDate: ''
      });
      setShowForm(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority as 'low' | 'medium' | 'high' | 'urgent',
      targetAudience: announcement.targetAudience as 'all' | 'athletes' | 'coaches' | 'officials' | 'spectators',
      publishDate: announcement.publishDate || '',
      expiryDate: announcement.expiryDate || ''
    });
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handlePublish = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id 
        ? { ...a, status: 'published' as const, publishDate: new Date().toISOString().split('T')[0] } 
        : a
    ));
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Megaphone className="mr-2" size={20} />
          Announcements
        </h3>
        <button
          onClick={() => {
            setNewAnnouncement({
              title: '',
              content: '',
              priority: 'medium',
              targetAudience: 'all',
              publishDate: '',
              expiryDate: ''
            });
            setEditingAnnouncement(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Views</div>
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <Eye className="text-blue-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{totalViews}</div>
          <div className="text-xs text-slate-500 mt-1">Across all announcements</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Published</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <Megaphone className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{publishedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Active announcements</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Pinned</div>
            <div className="p-1.5 rounded-full bg-purple-500/20">
              <Pin className="text-purple-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{pinnedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Priority announcements</div>
        </div>
      </div>

      {/* New Announcement Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-4">
            {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Announcement title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
              placeholder="Announcement content"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
              <select
                value={newAnnouncement.targetAudience}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, targetAudience: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {audienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Publish Date (Optional)</label>
              <input
                type="date"
                value={newAnnouncement.publishDate}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, publishDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date (Optional)</label>
              <input
                type="date"
                value={newAnnouncement.expiryDate}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, expiryDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingAnnouncement(null);
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
            placeholder="Search announcements..."
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
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        
        <select
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Audiences</option>
          {audienceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {announcement.pinned && <Pin className="text-purple-400 mr-2" size={16} />}
                    <h4 className="font-medium text-white">{announcement.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(announcement.status)}`}>
                      {announcement.status.toUpperCase()}
                    </span>
                    <span className={`text-xs ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-300 mb-3">
                  {announcement.content}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-slate-400">Audience</div>
                    <div className="text-white">
                      {audienceOptions.find(a => a.value === announcement.targetAudience)?.label}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Views</div>
                    <div className="text-white">{announcement.views}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Published</div>
                    <div className="text-white">{formatDate(announcement.publishDate)}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Expires</div>
                    <div className="text-white">{formatDate(announcement.expiryDate)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => handleTogglePin(announcement.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    announcement.pinned 
                      ? 'text-purple-400 bg-purple-400/10 hover:bg-purple-400/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title={announcement.pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin size={16} />
                </button>
                <button 
                  onClick={() => handleEdit(announcement)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                {announcement.status === 'draft' && (
                  <button 
                    onClick={() => handlePublish(announcement.id)}
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                    title="Publish"
                  >
                    <Send size={16} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(announcement.id)}
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

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Megaphone size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No announcements found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new announcement</p>
        </div>
      )}
    </div>
  );
};
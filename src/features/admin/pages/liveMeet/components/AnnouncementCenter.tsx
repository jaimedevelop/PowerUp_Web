import React, { useState } from 'react';
import { Megaphone, Send, Clock, Check, Trash2, Plus, Edit } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high';
}

interface AnnouncementCenterProps {
  meetId: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Warm-up Area Reminder',
    message: 'All lifters should be in the warm-up area at least 30 minutes before their scheduled flight time.',
    timestamp: '2025-08-05T10:30:00',
    status: 'published',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Equipment Check',
    message: 'Please ensure all equipment is properly set up and calibrated before the start of Flight B.',
    timestamp: '2025-08-05T09:45:00',
    status: 'published',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Flight Change',
    message: 'Flight C will begin 15 minutes earlier than scheduled due to the efficient progress of Flight B.',
    timestamp: '2025-08-05T11:15:00',
    status: 'draft',
    priority: 'medium'
  }
];

const quickAnnouncements = [
  { title: '5-minute warning', message: '5 minutes until the start of the next flight.' },
  { title: 'Equipment check', message: 'Please check all equipment before the next flight.' },
  { title: 'Flight change', message: 'Flight schedule has been updated.' },
  { title: 'Safety reminder', message: 'Remember to follow all safety protocols.' }
];

export const AnnouncementCenter: React.FC<AnnouncementCenterProps> = ({ meetId }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', priority: 'medium' as const });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400';
      case 'draft': return 'text-yellow-400';
      case 'archived': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const handlePublish = (id: string) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, status: 'published' } : ann
    ));
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  const handleSubmit = () => {
    if (newAnnouncement.title && newAnnouncement.message) {
      const newAnn: Announcement = {
        id: editingId || Date.now().toString(),
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        priority: newAnnouncement.priority,
        timestamp: new Date().toISOString(),
        status: 'draft'
      };

      if (editingId) {
        setAnnouncements(announcements.map(ann => 
          ann.id === editingId ? newAnn : ann
        ));
        setEditingId(null);
      } else {
        setAnnouncements([newAnn, ...announcements]);
      }

      setNewAnnouncement({ title: '', message: '', priority: 'medium' });
      setShowForm(false);
    }
  };

  const handleQuickAnnouncement = (template: { title: string; message: string }) => {
    setNewAnnouncement({
      title: template.title,
      message: template.message,
      priority: 'medium'
    });
    setShowForm(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority as 'low' | 'medium' | 'high'
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Megaphone className="mr-2" size={20} />
          Announcement Center
        </h3>
        <button
          onClick={() => {
            setNewAnnouncement({ title: '', message: '', priority: 'medium' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>{editingId ? 'Edit Announcement' : 'New Announcement'}</span>
        </button>
      </div>

      {/* New Announcement Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Announcement title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
              <textarea
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Announcement message"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
              >
                <Send size={16} className="mr-2" />
                {editingId ? 'Update' : 'Create'} Announcement
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Announcements */}
      {!showForm && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Announcements</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickAnnouncements.map((template, index) => (
              <button
                key={index}
                onClick={() => handleQuickAnnouncement(template)}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm text-left transition-colors"
              >
                {template.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-white">{announcement.title}</h4>
                  <span className={`text-xs ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                  <span className={`text-xs ${getStatusColor(announcement.status)}`}>
                    {announcement.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{announcement.message}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <Clock size={12} className="mr-1" />
                  {formatDate(announcement.timestamp)}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {announcement.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(announcement.id)}
                    className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                    title="Publish"
                  >
                    <Send size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Megaphone size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No announcements yet</p>
          <p className="text-sm mt-1">Create an announcement to communicate with participants</p>
        </div>
      )}
    </div>
  );
};
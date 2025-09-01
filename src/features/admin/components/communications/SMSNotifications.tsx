import React, { useState } from 'react';
import { MessageSquare, Send, Smartphone, Users, Clock, Check, X, Filter, Search, Plus, Edit, Trash2 } from 'lucide-react';

interface SMSNotification {
  id: string;
  message: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentDate?: string;
  scheduledDate?: string;
  deliveryRate: number;
  responseRate: number;
}

interface SMSNotificationsProps {
  meetId?: string;
}

const mockNotifications: SMSNotification[] = [
  {
    id: '1',
    message: 'Reminder: Weigh-in for Tampa Bay Open is tomorrow at 8 AM. Please arrive 30 minutes early.',
    recipients: 45,
    status: 'sent',
    sentDate: '2025-08-09',
    deliveryRate: 98,
    responseRate: 45
  },
  {
    id: '2',
    message: 'Payment reminder: Your registration for Tampa Bay Open is still pending. Please complete payment to secure your spot.',
    recipients: 12,
    status: 'sent',
    sentDate: '2025-08-05',
    deliveryRate: 100,
    responseRate: 75
  },
  {
    id: '3',
    message: 'Schedule update: Flight A will begin 30 minutes earlier than originally scheduled. Please plan accordingly.',
    recipients: 45,
    status: 'scheduled',
    scheduledDate: '2025-08-15',
    deliveryRate: 0,
    responseRate: 0
  },
  {
    id: '4',
    message: 'Venue change: Tampa Bay Open has been moved to the Tampa Convention Center. Same date and time.',
    recipients: 80,
    status: 'draft',
    deliveryRate: 0,
    responseRate: 0
  }
];

const smsTemplates = [
  { 
    id: 'weigh_in_reminder', 
    name: 'Weigh-in Reminder', 
    message: 'Reminder: Weigh-in for [MEET_NAME] is tomorrow at [TIME]. Please arrive 30 minutes early.' 
  },
  { 
    id: 'payment_reminder', 
    name: 'Payment Reminder', 
    message: 'Payment reminder: Your registration for [MEET_NAME] is still pending. Please complete payment to secure your spot.' 
  },
  { 
    id: 'schedule_update', 
    name: 'Schedule Update', 
    message: 'Schedule update: [FLIGHT] will begin [TIME] earlier than originally scheduled. Please plan accordingly.' 
  },
  { 
    id: 'venue_change', 
    name: 'Venue Change', 
    message: 'Venue change: [MEET_NAME] has been moved to [VENUE]. Same date and time.' 
  }
];

export const SMSNotifications: React.FC<SMSNotificationsProps> = ({ meetId }) => {
  const [notifications, setNotifications] = useState<SMSNotification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<SMSNotification | null>(null);
  const [newNotification, setNewNotification] = useState({
    message: '',
    recipients: 0,
    scheduledDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'sent': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalSent = notifications.filter(n => n.status === 'sent').reduce((sum, n) => sum + n.recipients, 0);
  const totalDelivered = notifications.filter(n => n.status === 'sent').reduce((sum, n) => sum + Math.round(n.recipients * n.deliveryRate / 100), 0);
  const averageDeliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  const handleSubmit = () => {
    if (newNotification.message) {
      const notification: SMSNotification = {
        id: editingNotification?.id || Date.now().toString(),
        message: newNotification.message,
        status: 'draft',
        recipients: newNotification.recipients,
        deliveryRate: 0,
        responseRate: 0,
        scheduledDate: newNotification.scheduledDate || undefined
      };

      if (editingNotification) {
        setNotifications(notifications.map(n => n.id === editingNotification.id ? notification : n));
        setEditingNotification(null);
      } else {
        setNotifications([notification, ...notifications]);
      }

      setNewNotification({
        message: '',
        recipients: 0,
        scheduledDate: ''
      });
      setShowForm(false);
    }
  };

  const handleEdit = (notification: SMSNotification) => {
    setNewNotification({
      message: notification.message,
      recipients: notification.recipients,
      scheduledDate: notification.scheduledDate || ''
    });
    setEditingNotification(notification);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleSendTest = (id: string) => {
    console.log(`Sending test SMS for notification ${id}`);
    // In a real app, this would trigger a test SMS
  };

  const handleSendNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: 'sent' as const, sentDate: new Date().toISOString().split('T')[0] } : n
    ));
  };

  const handleUseTemplate = (template: { id: string; name: string; message: string }) => {
    setNewNotification({
      ...newNotification,
      message: template.message
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Smartphone className="mr-2" size={20} />
          SMS Notifications
        </h3>
        <button
          onClick={() => {
            setNewNotification({
              message: '',
              recipients: 0,
              scheduledDate: ''
            });
            setEditingNotification(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>{editingNotification ? 'Edit Notification' : 'New Notification'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Sent</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <MessageSquare className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{totalSent}</div>
          <div className="text-xs text-slate-500 mt-1">SMS messages delivered</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Delivery Rate</div>
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <Check className="text-blue-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{averageDeliveryRate}%</div>
          <div className="text-xs text-slate-500 mt-1">Average delivery rate</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Active</div>
            <div className="p-1.5 rounded-full bg-purple-500/20">
              <Clock className="text-purple-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {notifications.filter(n => n.status === 'scheduled').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Scheduled notifications</div>
        </div>
      </div>

      {/* New Notification Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-4">
            {editingNotification ? 'Edit Notification' : 'Create New Notification'}
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
              placeholder="Type your SMS message..."
            />
            <div className="text-xs text-slate-500 mt-1">
              Character limit: 160. Current: {newNotification.message.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Recipients</label>
              <input
                type="number"
                value={newNotification.recipients || ''}
                onChange={(e) => setNewNotification({...newNotification, recipients: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of recipients"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Schedule (Optional)</label>
              <input
                type="datetime-local"
                value={newNotification.scheduledDate}
                onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Quick Templates */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Quick Templates</label>
            <div className="grid grid-cols-2 gap-2">
              {smsTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleUseTemplate(template)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm text-left transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {editingNotification ? 'Update Notification' : 'Create Notification'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingNotification(null);
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
            placeholder="Search notifications..."
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
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">SMS Notification</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notification.status)}`}>
                    {notification.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-slate-300 mb-3 bg-slate-800 p-3 rounded-lg">
                  {notification.message}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-slate-400">Recipients</div>
                    <div className="text-white">{notification.recipients}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Delivery Rate</div>
                    <div className="text-white">{notification.deliveryRate}%</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">Response Rate</div>
                    <div className="text-white">{notification.responseRate}%</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-400">
                      {notification.status === 'sent' ? 'Sent Date' : 
                       notification.status === 'scheduled' ? 'Scheduled Date' : 'Created'}
                    </div>
                    <div className="text-white">
                      {notification.sentDate || notification.scheduledDate || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => handleSendTest(notification.id)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Send Test"
                >
                  <Smartphone size={16} />
                </button>
                <button 
                  onClick={() => handleEdit(notification)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                {notification.status === 'draft' && (
                  <button 
                    onClick={() => handleSendNotification(notification.id)}
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                    title="Send Notification"
                  >
                    <Send size={16} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notification.id)}
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

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Smartphone size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No notifications found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new notification</p>
        </div>
      )}
    </div>
  );
};
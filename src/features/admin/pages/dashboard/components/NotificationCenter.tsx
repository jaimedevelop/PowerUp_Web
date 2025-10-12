// NotificationCenter.tsx
import React from 'react';
import { Bell, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Payment Pending',
    message: 'Registration payment from John Smith is still pending',
    time: '5 min ago',
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Meet Published',
    message: 'Tampa Bay Open is now live and accepting registrations',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'New Registration',
    message: 'Sarah Wilson registered for Florida State Championships',
    time: '2 hours ago',
    read: true
  }
];

export const NotificationCenter: React.FC = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle size={16} className="text-yellow-400" />;
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'error': return <AlertCircle size={16} className="text-red-400" />;
      default: return <Bell size={16} className="text-blue-400" />;
    }
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border transition-colors ${
              notification.read 
                ? 'bg-slate-900 border-slate-700' 
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white mb-1">{notification.title}</h4>
                <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock size={12} />
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
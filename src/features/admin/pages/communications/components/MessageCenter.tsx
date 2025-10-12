// MessageCenter.tsx
import React from 'react';
import { MessageSquare, Send, Users, Mail, Bell } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';
import { Button } from '../../../../shared/ui/Button';

export const MessageCenter: React.FC = () => {
  const [selectedRecipients, setSelectedRecipients] = React.useState<string[]>([]);
  const [messageType, setMessageType] = React.useState<'email' | 'notification'>('email');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const recipientOptions = [
    { id: 'all_athletes', label: 'All Registered Athletes', count: 80 },
    { id: 'pending_payments', label: 'Pending Payments', count: 12 },
    { id: 'tampa_bay_open', label: 'Tampa Bay Open Participants', count: 45 },
    { id: 'florida_championships', label: 'Florida Championships', count: 23 },
    { id: 'coaches', label: 'Coaches & Teams', count: 15 }
  ];

  const messageTemplates = [
    { id: 'weigh_in_reminder', title: 'Weigh-in Reminder', preview: 'Don\'t forget your weigh-in appointment...' },
    { id: 'payment_reminder', title: 'Payment Due', preview: 'Your registration payment is still pending...' },
    { id: 'meet_update', title: 'Meet Update', preview: 'Important updates about your upcoming meet...' },
    { id: 'schedule_change', title: 'Schedule Change', preview: 'There has been a change to the meet schedule...' }
  ];

  const handleSendMessage = () => {
    console.log('Sending message:', { selectedRecipients, messageType, subject, message });
    // Reset form
    setSubject('');
    setMessage('');
    setSelectedRecipients([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Message Center</h2>
          <p className="text-slate-400">Send updates and notifications to participants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composition */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Compose Message</h3>
            
            {/* Message Type Toggle */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setMessageType('email')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  messageType === 'email' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Mail size={16} />
                <span>Email</span>
              </button>
              <button
                onClick={() => setMessageType('notification')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  messageType === 'notification' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Bell size={16} />
                <span>Push Notification</span>
              </button>
            </div>

            {/* Recipients */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">Recipients</label>
              <div className="space-y-2">
                {recipientOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(option.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecipients([...selectedRecipients, option.id]);
                        } else {
                          setSelectedRecipients(selectedRecipients.filter(id => id !== option.id));
                        }
                      }}
                      className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <span className="text-white">{option.label}</span>
                      <span className="text-slate-400 ml-2">({option.count})</span>
                    </div>
                    <Users size={16} className="text-slate-400" />
                  </label>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            {messageType === 'email' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Message Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={messageType === 'email' ? 'Type your email message...' : 'Type your notification message...'}
                rows={8}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Send Button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {selectedRecipients.length > 0 && (
                  <span>Sending to {recipientOptions.filter(opt => selectedRecipients.includes(opt.id)).reduce((sum, opt) => sum + opt.count, 0)} recipients</span>
                )}
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={selectedRecipients.length === 0 || !message.trim() || (messageType === 'email' && !subject.trim())}
                className="flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Send {messageType === 'email' ? 'Email' : 'Notification'}</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Templates Sidebar */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Message Templates</h3>
            <div className="space-y-3">
              {messageTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSubject(template.title);
                    setMessage(template.preview + '\n\n[Complete your message here]');
                  }}
                  className="w-full p-3 bg-slate-900 rounded-lg text-left hover:bg-slate-800 transition-colors border border-slate-700 hover:border-slate-600"
                >
                  <h4 className="font-medium text-white mb-1">{template.title}</h4>
                  <p className="text-sm text-slate-400 truncate">{template.preview}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Messages */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Weigh-in Reminder</span>
                  <span className="text-xs text-slate-400">2 hours ago</span>
                </div>
                <p className="text-xs text-slate-400">Sent to 45 athletes</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Payment Due Notice</span>
                  <span className="text-xs text-slate-400">1 day ago</span>
                </div>
                <p className="text-xs text-slate-400">Sent to 12 athletes</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Meet Schedule Update</span>
                  <span className="text-xs text-slate-400">3 days ago</span>
                </div>
                <p className="text-xs text-slate-400">Sent to 80 athletes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
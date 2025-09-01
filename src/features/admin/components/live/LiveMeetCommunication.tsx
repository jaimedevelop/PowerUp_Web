import React, { useState } from 'react';
import { MessageSquare, Send, Users, Bell, Search, Filter, Plus } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  recipient: 'all' | 'flight' | 'lifter' | 'officials';
  content: string;
  timestamp: string;
  read: boolean;
}

interface LiveMeetCommunicationProps {
  meetId: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Meet Director',
    recipient: 'all',
    content: 'Welcome to the Tampa Bay Open! The meet will begin shortly.',
    timestamp: '2025-08-05T09:00:00',
    read: true
  },
  {
    id: '2',
    sender: 'Head Referee',
    recipient: 'officials',
    content: 'All officials please report to the briefing room in 10 minutes.',
    timestamp: '2025-08-05T08:45:00',
    read: true
  },
  {
    id: '3',
    sender: 'Flight Coordinator',
    recipient: 'flight',
    content: 'Flight A lifters should begin warming up now.',
    timestamp: '2025-08-05T08:30:00',
    read: false
  }
];

const recipientOptions = [
  { value: 'all', label: 'All Participants' },
  { value: 'flight', label: 'Current Flight' },
  { value: 'lifter', label: 'Specific Lifter' },
  { value: 'officials', label: 'Officials Only' }
];

export const LiveMeetCommunication: React.FC<LiveMeetCommunicationProps> = ({ meetId }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'Meet Director',
        recipient: recipient as any,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.read) ||
                         (filter === 'read' && message.read);
    
    return matchesSearch && matchesFilter;
  });

  const getRecipientColor = (recipient: string) => {
    switch (recipient) {
      case 'all': return 'text-blue-400';
      case 'flight': return 'text-green-400';
      case 'lifter': return 'text-purple-400';
      case 'officials': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <MessageSquare className="mr-2" size={20} />
          Live Meet Communication
        </h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <div className="relative">
              <Bell className="text-slate-400" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            </div>
          )}
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Users size={18} />
          </button>
        </div>
      </div>

      {/* New Message */}
      <div className="bg-slate-900 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              placeholder="Type your message here..."
            />
            <div className="flex items-center justify-between mt-3">
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {recipientOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg transition-colors ${
                  newMessage.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className={`bg-slate-900 rounded-lg p-4 border ${message.read ? 'border-slate-800' : 'border-blue-500/30'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="font-medium text-white">{message.sender}</div>
                <div className={`text-xs px-1.5 py-0.5 rounded-full ${getRecipientColor(message.recipient)} bg-slate-800`}>
                  {recipientOptions.find(r => r.value === message.recipient)?.label}
                </div>
                {!message.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {formatDate(message.timestamp)}
              </div>
            </div>
            
            <div className="text-slate-300 mb-3">
              {message.content}
            </div>
            
            <div className="flex justify-end">
              <button className="text-xs text-blue-400 hover:text-blue-300">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <MessageSquare size={24} className="mx-auto mb-2 text-slate-600" />
          <p>No messages found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Messages</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { title: 'Flight Starting', content: 'Flight is now starting. All lifters should be ready.' },
            { title: 'Warm-up Reminder', content: '15 minutes until your flight. Please begin warming up.' },
            { title: 'Equipment Check', content: 'All officials should check equipment before the next flight.' },
            { title: 'Safety Notice', content: 'Reminder to all participants to follow safety protocols.' }
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setNewMessage(template.content);
                setRecipient('flight');
              }}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm text-left transition-colors"
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
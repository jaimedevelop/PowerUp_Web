import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Filter, UserCheck, UserX, Shield, Mail } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'director' | 'official' | 'volunteer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  meetsManaged: number;
}

interface UserManagementProps {}

const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'John Director',
    email: 'john@powerlift.com',
    role: 'director',
    status: 'active',
    lastLogin: '2025-08-05',
    createdAt: '2024-01-15',
    meetsManaged: 8
  },
  {
    id: '2',
    name: 'Sarah Official',
    email: 'sarah@powerlift.com',
    role: 'official',
    status: 'active',
    lastLogin: '2025-08-04',
    createdAt: '2024-02-20',
    meetsManaged: 12
  },
  {
    id: '3',
    name: 'Mike Volunteer',
    email: 'mike@powerlift.com',
    role: 'volunteer',
    status: 'active',
    lastLogin: '2025-07-28',
    createdAt: '2024-03-10',
    meetsManaged: 3
  },
  {
    id: '4',
    name: 'Lisa Admin',
    email: 'lisa@powerlift.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-08-05',
    createdAt: '2023-11-05',
    meetsManaged: 15
  },
  {
    id: '5',
    name: 'Tom Pending',
    email: 'tom@powerlift.com',
    role: 'volunteer',
    status: 'pending',
    lastLogin: 'Never',
    createdAt: '2025-08-01',
    meetsManaged: 0
  }
];

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'director', label: 'Director' },
  { value: 'official', label: 'Official' },
  { value: 'volunteer', label: 'Volunteer' }
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'text-red-400 bg-red-500/20';
    case 'director': return 'text-purple-400 bg-purple-500/20';
    case 'official': return 'text-blue-400 bg-blue-500/20';
    case 'volunteer': return 'text-green-400 bg-green-500/20';
    default: return 'text-slate-400 bg-slate-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-500/20';
    case 'inactive': return 'text-slate-400 bg-slate-700';
    case 'pending': return 'text-yellow-400 bg-yellow-500/20';
    default: return 'text-slate-400 bg-slate-700';
  }
};

export const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'volunteer' as const,
    status: 'pending' as const
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  const handleSubmit = () => {
    if (newUser.name && newUser.email) {
      const user: UserData = {
        id: editingUser?.id || Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        meetsManaged: editingUser?.meetsManaged || 0
      };

      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? user : u));
        setEditingUser(null);
      } else {
        setUsers([user, ...users]);
      }

      setNewUser({
        name: '',
        email: '',
        role: 'volunteer',
        status: 'pending'
      });
      setShowForm(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role as 'admin' | 'director' | 'official' | 'volunteer',
      status: user.status as 'active' | 'inactive' | 'pending'
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const } 
        : u
    ));
  };

  const handleApprove = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: 'active' as const } : u
    ));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Users</div>
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <Users className="text-blue-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{totalUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Registered users</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Active Users</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <UserCheck className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{activeUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Currently active</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Pending Approval</div>
            <div className="p-1.5 rounded-full bg-yellow-500/20">
              <UserX className="text-yellow-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">{pendingUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting approval</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => {
            setNewUser({
              name: '',
              email: '',
              role: 'volunteer',
              status: 'pending'
            });
            setEditingUser(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>{editingUser ? 'Edit User' : 'Add User'}</span>
        </button>
      </div>

      {/* New User Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="font-medium text-white mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="admin">Admin</option>
                <option value="director">Director</option>
                <option value="official">Official</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Meets Managed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="flex items-center text-sm text-slate-400">
                          <Mail size={14} className="mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {user.meetsManaged}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active' 
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10' 
                            : 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                        }`}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      {user.status === 'pending' && (
                        <button 
                          onClick={() => handleApprove(user.id)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Shield size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Users size={24} className="mx-auto mb-2 text-slate-600" />
            <p>No users found</p>
            <p className="text-sm mt-1">Try adjusting your filters or add a new user</p>
          </div>
        )}
      </div>
    </div>
  );
};
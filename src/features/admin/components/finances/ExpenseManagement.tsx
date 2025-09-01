import React, { useState } from 'react';
import { DollarSign, Plus, Search, Filter, Calendar, Tag, Edit, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'paid';
  description?: string;
  vendor?: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  budget: number;
  spent: number;
}

interface ExpenseManagementProps {
  meetId?: string;
}

const mockExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Venue Rental', color: 'bg-blue-500', budget: 5000, spent: 4200 },
  { id: '2', name: 'Equipment', color: 'bg-green-500', budget: 3000, spent: 1800 },
  { id: '3', name: 'Staff', color: 'bg-purple-500', budget: 4000, spent: 3500 },
  { id: '4', name: 'Marketing', color: 'bg-yellow-500', budget: 2000, spent: 1200 },
  { id: '5', name: 'Awards', color: 'bg-red-500', budget: 1500, spent: 900 }
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Venue Deposit',
    category: 'Venue Rental',
    amount: 2500,
    date: '2025-07-01',
    status: 'paid',
    vendor: 'Tampa Convention Center',
    description: 'Deposit for main competition venue'
  },
  {
    id: '2',
    title: 'New Barbell Set',
    category: 'Equipment',
    amount: 850,
    date: '2025-07-05',
    status: 'approved',
    vendor: 'Fitness Equipment Co.',
    description: 'Competition grade barbells'
  },
  {
    id: '3',
    title: 'Referee Payment',
    category: 'Staff',
    amount: 600,
    date: '2025-07-10',
    status: 'pending',
    vendor: 'John Smith',
    description: 'Payment for head referee services'
  },
  {
    id: '4',
    title: 'Social Media Ads',
    category: 'Marketing',
    amount: 300,
    date: '2025-07-08',
    status: 'paid',
    vendor: 'Facebook Ads',
    description: 'Promotion for upcoming event'
  },
  {
    id: '5',
    title: 'Trophy Order',
    category: 'Awards',
    amount: 450,
    date: '2025-07-12',
    status: 'pending',
    vendor: 'Trophy Shop',
    description: 'Custom trophies for winners'
  }
];

export const ExpenseManagement: React.FC<ExpenseManagementProps> = ({ meetId }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [categories, setCategories] = useState<ExpenseCategory[]>(mockExpenseCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
    description: '',
    vendor: ''
  });

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'approved': return 'text-blue-400 bg-blue-500/20';
      case 'paid': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = () => {
    if (newExpense.title && newExpense.category && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        title: newExpense.title,
        category: newExpense.category,
        amount: newExpense.amount,
        date: newExpense.date,
        status: newExpense.status,
        description: newExpense.description,
        vendor: newExpense.vendor
      };

      setExpenses([expense, ...expenses]);
      
      // Update category spent amount
      setCategories(categories.map(cat => 
        cat.name === newExpense.category 
          ? { ...cat, spent: cat.spent + newExpense.amount } 
          : cat
      ));

      setNewExpense({
        title: '',
        category: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: '',
        vendor: ''
      });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setExpenses(expenses.filter(e => e.id !== id));
      
      // Update category spent amount
      setCategories(categories.map(cat => 
        cat.name === expense.category 
          ? { ...cat, spent: Math.max(0, cat.spent - expense.amount) } 
          : cat
      ));
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <DollarSign className="mr-2" size={20} />
          Expense Management
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Budget</div>
            <div className="p-1.5 rounded-full bg-slate-800">
              <DollarSign className="text-slate-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">${totalBudget.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Allocated funds</div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Total Spent</div>
            <div className="p-1.5 rounded-full bg-red-500/20">
              <TrendingDown className="text-red-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">${totalSpent.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((totalSpent / totalBudget) * 100)}% of budget
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Remaining</div>
            <div className="p-1.5 rounded-full bg-green-500/20">
              <TrendingUp className="text-green-400" size={14} />
            </div>
          </div>
          <div className="text-xl font-bold text-white">${remainingBudget.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((remainingBudget / totalBudget) * 100)}% remaining
          </div>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="mb-6">
        <h4 className="font-medium text-white mb-3">Budget by Category</h4>
        <div className="space-y-3">
          {categories.map((category) => {
            const percentage = Math.round((category.spent / category.budget) * 100);
            const isOverBudget = category.spent > category.budget;
            
            return (
              <div key={category.id} className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                    <span className="font-medium text-white">{category.name}</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{percentage}% spent</span>
                  <span className={isOverBudget ? 'text-red-400' : ''}>
                    {isOverBudget ? 'Over budget!' : `$${(category.budget - category.spent).toLocaleString()} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Expense Form */}
      {showForm && (
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-3">Add New Expense</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={newExpense.title}
                onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Expense title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Vendor</label>
              <input
                type="text"
                value={newExpense.vendor}
                onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Vendor name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select
                value={newExpense.status}
                onChange={(e) => setNewExpense({...newExpense, status: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                placeholder="Expense description"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Add Expense
            </button>
            <button
              onClick={() => setShowForm(false)}
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
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Expense</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{expense.title}</div>
                    {expense.vendor && (
                      <div className="text-sm text-slate-400">{expense.vendor}</div>
                    )}
                    {expense.description && (
                      <div className="text-xs text-slate-500 mt-1">{expense.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        categories.find(c => c.name === expense.category)?.color || 'bg-slate-500'
                      }`}></div>
                      <span className="text-sm text-slate-300">{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">${expense.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
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
        
        {filteredExpenses.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <DollarSign size={24} className="mx-auto mb-2 text-slate-600" />
            <p>No expenses found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
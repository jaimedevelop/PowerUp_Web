import React, { useState } from 'react';

interface AdminSignupProps {
  onSignup: (data: AdminData) => void;
}

interface AdminData {
  fullName: string;
  email: string;
  password: string;
  organization: string;
  adminRole: string;
  accessLevel: string;
  department: string;
}

const AdminSignup: React.FC<AdminSignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState<AdminData>({
    fullName: '',
    email: '',
    password: '',
    organization: '',
    adminRole: '',
    accessLevel: '',
    department: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Administrator Information</h3>
      
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          value={formData.organization}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Organization name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="adminRole" className="block text-sm font-medium text-gray-700 mb-1">
          Administrative Role
        </label>
        <select
          id="adminRole"
          name="adminRole"
          value={formData.adminRole}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select role</option>
          <option value="system-admin">System Administrator</option>
          <option value="meet-director">Meet Director</option>
          <option value="finance-admin">Finance Administrator</option>
          <option value="communications-admin">Communications Administrator</option>
          <option value="registration-admin">Registration Administrator</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Access Level
        </label>
        <select
          id="accessLevel"
          name="accessLevel"
          value={formData.accessLevel}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select access level</option>
          <option value="full-access">Full Access</option>
          <option value="limited-access">Limited Access</option>
          <option value="view-only">View Only</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select department</option>
          <option value="operations">Operations</option>
          <option value="finance">Finance</option>
          <option value="communications">Communications</option>
          <option value="registration">Registration</option>
          <option value="it">IT Support</option>
          <option value="management">Management</option>
        </select>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900 mb-3">Administrative Privileges</h4>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            As an administrator, you will have access to sensitive data and system controls. 
            This access should be used responsibly and in accordance with your organization's policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
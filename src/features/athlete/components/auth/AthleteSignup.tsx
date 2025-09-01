import React, { useState } from 'react';

interface AthleteSignupProps {
  onSignup: (data: AthleteData) => void;
}

interface AthleteData {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const AthleteSignup: React.FC<AthleteSignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState<AthleteData>({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Athlete Information</h3>
      
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900 mb-3">Emergency Contact</h4>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="emergencyContact.name"
              name="emergencyContact.name"
              type="text"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Emergency contact name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="(123) 456-7890"
              required
            />
          </div>
          
          <div>
            <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <input
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              type="text"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Parent, Guardian, etc."
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteSignup;
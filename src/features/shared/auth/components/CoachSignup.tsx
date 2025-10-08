import React, { useState } from 'react';

interface CoachSignupProps {
  onSignup: (data: CoachData) => void;
}

interface CoachData {
  fullName: string;
  email: string;
  password: string;
  teamName: string;
  position: string;
  experience: string;
  certification: {
    hasCertification: boolean;
    certificationNumber: string;
    expirationDate: string;
  };
}

const CoachSignup: React.FC<CoachSignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState<CoachData>({
    fullName: '',
    email: '',
    password: '',
    teamName: '',
    position: '',
    experience: '',
    certification: {
      hasCertification: false,
      certificationNumber: '',
      expirationDate: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (name.startsWith('certification.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        certification: {
          ...prev.certification,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Coach Information</h3>
      
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
          Team/Organization Name
        </label>
        <input
          id="teamName"
          name="teamName"
          type="text"
          value={formData.teamName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Team or organization name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Coaching Position
        </label>
        <select
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select position</option>
          <option value="head-coach">Head Coach</option>
          <option value="assistant-coach">Assistant Coach</option>
          <option value="strength-coach">Strength & Conditioning Coach</option>
          <option value="events-coach">Events Coach</option>
          <option value="volunteer-coach">Volunteer Coach</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience
        </label>
        <select
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select experience</option>
          <option value="0-2">0-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="6-10">6-10 years</option>
          <option value="11-15">11-15 years</option>
          <option value="16+">16+ years</option>
        </select>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900 mb-3">Certification Information</h4>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="certification.hasCertification"
              name="certification.hasCertification"
              type="checkbox"
              checked={formData.certification.hasCertification}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="certification.hasCertification" className="ml-2 block text-sm text-gray-700">
              I have a coaching certification
            </label>
          </div>
          
          {formData.certification.hasCertification && (
            <>
              <div>
                <label htmlFor="certification.certificationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Number
                </label>
                <input
                  id="certification.certificationNumber"
                  name="certification.certificationNumber"
                  type="text"
                  value={formData.certification.certificationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Certification number"
                />
              </div>
              
              <div>
                <label htmlFor="certification.expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  id="certification.expirationDate"
                  name="certification.expirationDate"
                  type="date"
                  value={formData.certification.expirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachSignup;
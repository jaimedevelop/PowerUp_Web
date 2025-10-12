// src/admin/components/meets/BasicInfoStep.tsx
import React from 'react';
import { Calendar, MapPin, Building, Users } from 'lucide-react';
import { StepComponentProps, Federation, FederationOption } from '../../types/meets';

const federations: FederationOption[] = [
  { value: 'USAPL', label: 'USA Powerlifting (USAPL)' },
  { value: 'USPA', label: 'United States Powerlifting Association (USPA)' },
  { value: 'IPF', label: 'International Powerlifting Federation (IPF)' },
  { value: 'Other', label: 'Other Federation' },
];

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export const BasicInfoStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const handleInputChange = (field: keyof typeof data, value: string) => {
    updateData({ [field]: value });
  };

  const handleLocationChange = (field: keyof typeof data.location, value: string) => {
    updateData({
      location: {
        ...data.location,
        [field]: value,
      },
    });
  };

  const isValid = () => {
    return (
      data.name.trim() &&
      data.date &&
      data.location.venue.trim() &&
      data.location.address.trim() &&
      data.location.city.trim() &&
      data.location.state &&
      data.federation
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-slate-400">
          Let's start with the essential details about your powerlifting meet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Meet Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Meet Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Tampa Bay Open Powerlifting Championship"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Calendar size={16} className="inline mr-1" />
            Competition Date *
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Federation */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Users size={16} className="inline mr-1" />
            Federation *
          </label>
          <select
            value={data.federation}
            onChange={(e) => handleInputChange('federation', e.target.value as Federation)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {federations.map((fed) => (
              <option key={fed.value} value={fed.value}>
                {fed.label}
              </option>
            ))}
          </select>
        </div>

        {/* Venue */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            <Building size={16} className="inline mr-1" />
            Venue Name *
          </label>
          <input
            type="text"
            value={data.location.venue}
            onChange={(e) => handleLocationChange('venue', e.target.value)}
            placeholder="Tampa Convention Center"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            <MapPin size={16} className="inline mr-1" />
            Street Address *
          </label>
          <input
            type="text"
            value={data.location.address}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            placeholder="333 S Franklin St"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            City *
          </label>
          <input
            type="text"
            value={data.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            placeholder="Tampa"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            State *
          </label>
          <select
            value={data.location.state}
            onChange={(e) => handleLocationChange('state', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-2">Preview</h3>
        <div className="text-slate-300">
          <p className="font-medium">{data.name || 'Meet Name'}</p>
          <p className="text-sm text-slate-400">
            {data.date ? new Date(data.date).toLocaleDateString() : 'Date not set'} • {data.federation}
          </p>
          <p className="text-sm text-slate-400">
            {data.location.venue || 'Venue'} • {data.location.city}, {data.location.state}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid()}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isValid()
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Competition Details
        </button>
      </div>
    </div>
  );
};
// src/admin/components/meets/CompetitionDetailsStep.tsx
import React, { useState } from 'react';
import { Weight, Users, Shirt, Plus, X } from 'lucide-react';
import { StepComponentProps, WeightClassSet } from '../../types/meets';

const standardWeightClasses: WeightClassSet = {
  men: ['59kg', '66kg', '74kg', '83kg', '93kg', '105kg', '120kg', '120kg+'],
  women: ['47kg', '52kg', '57kg', '63kg', '69kg', '76kg', '84kg', '84kg+'],
};

const standardDivisions = [
  'Open', 'Sub-Junior', 'Junior', 'Masters 1 (40-49)', 'Masters 2 (50-59)', 'Masters 3 (60-69)', 'Masters 4 (70+)'
];

const equipmentCategories = [
  'Raw', 'Single-ply', 'Multi-ply', 'Bench Only', 'Deadlift Only', 'Push/Pull'
];

export const CompetitionDetailsStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
}) => {
  const [customWeightClass, setCustomWeightClass] = useState('');
  const [customDivision, setCustomDivision] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');

  const toggleSelection = (array: string[], item: string, field: keyof typeof data) => {
    const isSelected = array.includes(item);
    const newArray = isSelected
      ? array.filter(i => i !== item)
      : [...array, item];
    
    updateData({ [field]: newArray });
  };

  const addCustomItem = (item: string, field: keyof typeof data, setter: (value: string) => void) => {
    if (item.trim() && !data[field].includes(item.trim())) {
      updateData({
        [field]: [...data[field], item.trim()]
      });
      setter('');
    }
  };

  const removeCustomItem = (item: string, field: keyof typeof data) => {
    updateData({
      [field]: data[field].filter(i => i !== item)
    });
  };

  const isValid = () => {
    return data.weightClasses.length > 0 && data.divisions.length > 0 && data.equipment.length > 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Competition Details</h2>
        <p className="text-slate-400">
          Configure the competition format, weight classes, and divisions.
        </p>
      </div>

      {/* Weight Classes */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Weight size={20} className="mr-2" />
          Weight Classes *
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Men's Weight Classes */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Men's Weight Classes</h4>
            <div className="space-y-2">
              {standardWeightClasses.men.map((weightClass) => (
                <label key={`men-${weightClass}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.weightClasses.includes(`Men ${weightClass}`)}
                    onChange={() => toggleSelection(data.weightClasses, `Men ${weightClass}`, 'weightClasses')}
                    className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-slate-300">{weightClass}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Women's Weight Classes */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Women's Weight Classes</h4>
            <div className="space-y-2">
              {standardWeightClasses.women.map((weightClass) => (
                <label key={`women-${weightClass}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.weightClasses.includes(`Women ${weightClass}`)}
                    onChange={() => toggleSelection(data.weightClasses, `Women ${weightClass}`, 'weightClasses')}
                    className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-slate-300">{weightClass}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Weight Class */}
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={customWeightClass}
              onChange={(e) => setCustomWeightClass(e.target.value)}
              placeholder="Custom weight class (e.g., Teen 59kg)"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => addCustomItem(customWeightClass, 'weightClasses', setCustomWeightClass)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Selected Weight Classes */}
        {data.weightClasses.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Selected Weight Classes</h4>
            <div className="flex flex-wrap gap-2">
              {data.weightClasses.map((weightClass) => (
                <span
                  key={weightClass}
                  className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                >
                  {weightClass}
                  <button
                    onClick={() => removeCustomItem(weightClass, 'weightClasses')}
                    className="ml-2 hover:text-red-300"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Divisions */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Users size={20} className="mr-2" />
          Age Divisions *
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {standardDivisions.map((division) => (
            <label key={division} className="flex items-center">
              <input
                type="checkbox"
                checked={data.divisions.includes(division)}
                onChange={() => toggleSelection(data.divisions, division, 'divisions')}
                className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span className="text-slate-300">{division}</span>
            </label>
          ))}
        </div>

        {/* Custom Division */}
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={customDivision}
              onChange={(e) => setCustomDivision(e.target.value)}
              placeholder="Custom division (e.g., Teen 13-15)"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => addCustomItem(customDivision, 'divisions', setCustomDivision)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Categories */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Shirt size={20} className="mr-2" />
          Equipment Categories *
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {equipmentCategories.map((equipment) => (
            <label key={equipment} className="flex items-center">
              <input
                type="checkbox"
                checked={data.equipment.includes(equipment)}
                onChange={() => toggleSelection(data.equipment, equipment, 'equipment')}
                className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span className="text-slate-300">{equipment}</span>
            </label>
          ))}
        </div>

        {/* Custom Equipment */}
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={customEquipment}
              onChange={(e) => setCustomEquipment(e.target.value)}
              placeholder="Custom equipment category"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => addCustomItem(customEquipment, 'equipment', setCustomEquipment)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-3">Competition Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400 mb-1">Weight Classes</p>
            <p className="text-white font-medium">{data.weightClasses.length} selected</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Divisions</p>
            <p className="text-white font-medium">{data.divisions.length} selected</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Equipment</p>
            <p className="text-white font-medium">{data.equipment.length} selected</p>
          </div>
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
          Continue to Registration Settings
        </button>
      </div>
    </div>
  );
};
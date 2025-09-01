// src/admin/components/meets/EditMeet.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Building, 
  Users, 
  Weight, 
  Shirt, 
  DollarSign, 
  Clock,
  Plus,
  X,
  Check
} from 'lucide-react';
import { getMeetById, updateMeet, validateMeetData, handleFirebaseError, BaseMeetData } from '../../../../firebase';
import { FederationOption } from '../../../../types/admin/meet-types'
import { Federation, WeightClassSet } from '../../../../types/shared/common-types'
import { MeetLocation } from '../../../../types/shared/common-types'

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

interface EditMeetProps {
  onComplete?: () => void;
  meetId?: string | null;
}

export const EditMeet: React.FC<EditMeetProps> = ({ onComplete, meetId: propMeetId }) => {
  const { meetId: paramMeetId } = useParams<{ meetId: string }>();
  const meetId = propMeetId || paramMeetId;
  const navigate = useNavigate();
  
  const [meetData, setMeetData] = useState<BaseMeetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Custom input states
  const [customWeightClass, setCustomWeightClass] = useState('');
  const [customDivision, setCustomDivision] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');

  useEffect(() => {
    const loadMeet = async () => {
      if (!meetId) {
        setError('No meet ID provided');
        setLoading(false);
        return;
      }

      try {
        const meet = await getMeetById(meetId);
        if (meet) {
          // Convert to BaseMeetData format
          const baseMeetData: BaseMeetData = {
            name: meet.name,
            date: meet.date,
            location: meet.location,
            federation: meet.federation,
            weightClasses: meet.weightClasses,
            divisions: meet.divisions,
            equipment: meet.equipment,
            registrationDeadline: meet.registrationDeadline,
            registrationFee: meet.registrationFee,
            maxParticipants: meet.maxParticipants,
            earlyBirdDeadline: meet.earlyBirdDeadline || '',
            earlyBirdFee: meet.earlyBirdFee || 0,
            status: meet.status,
          };
          setMeetData(baseMeetData);
        } else {
          setError('Meet not found');
        }
      } catch (err) {
        console.error('Error loading meet:', err);
        const firebaseError = handleFirebaseError(err);
        setError(firebaseError.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeet();
  }, [meetId]);

  const updateMeetData = (updates: Partial<BaseMeetData>) => {
    if (!meetData) return;
    setMeetData({ ...meetData, ...updates });
    // Clear errors when user makes changes
    if (error) setError(null);
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleInputChange = (field: keyof BaseMeetData, value: string | number) => {
    updateMeetData({ [field]: value });
  };

  const handleLocationChange = (field: keyof BaseMeetData['location'], value: string) => {
    if (!meetData) return;
    updateMeetData({
      location: {
        ...meetData.location,
        [field]: value,
      },
    });
  };

  const toggleSelection = (array: string[], item: string, field: keyof BaseMeetData) => {
    if (!meetData) return;
    
    // Skip toggle if "Any" is selected for weight classes
    const isAnyWeightClassSelected = field === 'weightClasses' && meetData.weightClasses.includes('Any');
    if (field === 'weightClasses' && isAnyWeightClassSelected) return;
    
    const isSelected = array.includes(item);
    const newArray = isSelected
      ? array.filter(i => i !== item)
      : [...array, item];
    
    updateMeetData({ [field]: newArray });
  };

  const handleAnyWeightClassChange = () => {
    if (!meetData) return;
    
    const isAnyWeightClassSelected = meetData.weightClasses.includes('Any');
    if (isAnyWeightClassSelected) {
      // Remove "Any" and keep existing selections
      updateMeetData({
        weightClasses: meetData.weightClasses.filter(wc => wc !== 'Any')
      });
    } else {
      // Add "Any" and clear other selections
      updateMeetData({
        weightClasses: ['Any']
      });
    }
  };

  const addCustomItem = (item: string, field: keyof BaseMeetData, setter: (value: string) => void) => {
    if (!meetData) return;
    
    // Skip adding custom weight class if "Any" is selected
    const isAnyWeightClassSelected = field === 'weightClasses' && meetData.weightClasses.includes('Any');
    if (field === 'weightClasses' && isAnyWeightClassSelected) return;
    
    const currentArray = meetData[field] as string[];
    if (item.trim() && !currentArray.includes(item.trim())) {
      updateMeetData({
        [field]: [...currentArray, item.trim()]
      });
      setter('');
    }
  };

  const removeCustomItem = (item: string, field: keyof BaseMeetData) => {
    if (!meetData) return;
    const currentArray = meetData[field] as string[];
    updateMeetData({
      [field]: currentArray.filter(i => i !== item)
    });
  };

  const validateForm = (): boolean => {
    if (!meetData) return false;
    
    const validation = validateMeetData(meetData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }
    
    setValidationErrors([]);
    return true;
  };

  const handleSave = async () => {
    if (!meetData || !meetId || !validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateMeet(meetId, meetData);
      
      // Show success message
      alert(`Meet "${meetData.name}" updated successfully!`);
      
      // Navigate back or call completion callback
      if (onComplete) {
        onComplete();
      } else {
        navigate('/admin/director/meets');
      }
    } catch (err) {
      console.error('Error updating meet:', err);
      const firebaseError = handleFirebaseError(err);
      setError(firebaseError.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading meet details...</div>
      </div>
    );
  }

  if (error && !meetData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-white text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/admin/director/meets')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Meets
          </button>
        </div>
      </div>
    );
  }

  if (!meetData) return null;

  const isAnyWeightClassSelected = meetData.weightClasses.includes('Any');
  const isRegistrationDeadlineInvalid = meetData.registrationDeadline && meetData.date && 
    new Date(meetData.registrationDeadline) >= new Date(meetData.date);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
  onClick={() => {
    console.log('🔙 Back button clicked in EditMeet');
    console.log('🔙 Current location:', window.location.pathname);
    console.log('🔙 Navigate function:', navigate);
    console.log('🔙 Attempting to navigate to /admin/director/meets');
    
    try {
      // Try navigate with replace option
      navigate('/admin/director/meets', { replace: true });
      console.log('🔙 Navigate called successfully with replace');
      
      // If that doesn't work, try forcing a page reload after a brief delay
      setTimeout(() => {
        if (window.location.pathname !== '/admin/director/meets') {
          console.log('🔙 Navigation failed, forcing page reload');
          window.location.href = '/admin/director/meets';
        }
      }, 100);
      
    } catch (error) {
      console.error('🔴 Navigate error:', error);
      // Fallback to direct navigation
      window.location.href = '/admin/director/meets';
    }
  }}
  className="p-2 text-slate-400 hover:text-white transition-colors"
  style={{ border: '2px solid orange' }} // Temporary visual indicator
>
  <ArrowLeft className="h-5 w-5" />
</button>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Meet</h1>
                <p className="text-slate-400">Update meet details and settings</p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {(error || validationErrors.length > 0) && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="text-red-400 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-400 font-medium mb-2">
                  {error ? 'Error Updating Meet' : 'Validation Errors'}
                </h3>
                {error && (
                  <p className="text-red-300 mb-2">{error}</p>
                )}
                {validationErrors.length > 0 && (
                  <ul className="text-red-300 space-y-1">
                    {validationErrors.map((err, index) => (
                      <li key={index} className="text-sm">• {err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info & Competition Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meet Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    Meet Name *
                  </label>
                  <input
                    type="text"
                    value={meetData.name}
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
                    value={meetData.date}
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
                    value={meetData.federation}
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
                    value={meetData.location.venue}
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
                    value={meetData.location.address}
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
                    value={meetData.location.city}
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
                    value={meetData.location.state}
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
            </div>

            {/* Competition Details */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Competition Details</h2>

              {/* Weight Classes */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Weight size={20} className="mr-2" />
                  Weight Classes *
                </h3>
                
                {/* Any Weight Class Option */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAnyWeightClassSelected}
                      onChange={handleAnyWeightClassChange}
                      className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-slate-300">Any (all weight classes allowed)</span>
                  </label>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 ${isAnyWeightClassSelected ? 'opacity-50' : ''}`}>
                  {/* Men's Weight Classes */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Men's Weight Classes</h4>
                    <div className="space-y-2">
                      {standardWeightClasses.men.map((weightClass) => (
                        <label key={`men-${weightClass}`} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={meetData.weightClasses.includes(`Men ${weightClass}`)}
                            onChange={() => toggleSelection(meetData.weightClasses, `Men ${weightClass}`, 'weightClasses')}
                            disabled={isAnyWeightClassSelected}
                            className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 disabled:opacity-50"
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
                            checked={meetData.weightClasses.includes(`Women ${weightClass}`)}
                            onChange={() => toggleSelection(meetData.weightClasses, `Women ${weightClass}`, 'weightClasses')}
                            disabled={isAnyWeightClassSelected}
                            className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 disabled:opacity-50"
                          />
                          <span className="text-slate-300">{weightClass}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Custom Weight Class */}
                {!isAnyWeightClassSelected && (
                  <div className="mb-4">
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
                )}
                
                {/* Selected Weight Classes */}
                {meetData.weightClasses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Selected Weight Classes</h4>
                    <div className="flex flex-wrap gap-2">
                      {meetData.weightClasses.map((weightClass) => (
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
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Users size={20} className="mr-2" />
                  Age Divisions *
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {standardDivisions.map((division) => (
                    <label key={division} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={meetData.divisions.includes(division)}
                        onChange={() => toggleSelection(meetData.divisions, division, 'divisions')}
                        className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-slate-300">{division}</span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Division */}
                <div className="mb-4">
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

                {/* Selected Divisions */}
                {meetData.divisions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Selected Divisions</h4>
                    <div className="flex flex-wrap gap-2">
                      {meetData.divisions.map((division) => (
                        <span
                          key={division}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                        >
                          {division}
                          <button
                            onClick={() => removeCustomItem(division, 'divisions')}
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

              {/* Equipment Categories */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Shirt size={20} className="mr-2" />
                  Equipment Categories *
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {equipmentCategories.map((equipment) => (
                    <label key={equipment} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={meetData.equipment.includes(equipment)}
                        onChange={() => toggleSelection(meetData.equipment, equipment, 'equipment')}
                        className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-slate-300">{equipment}</span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Equipment */}
                <div className="mb-4">
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

                {/* Selected Equipment */}
                {meetData.equipment.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Selected Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {meetData.equipment.map((equipment) => (
                        <span
                          key={equipment}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-full"
                        >
                          {equipment}
                          <button
                            onClick={() => removeCustomItem(equipment, 'equipment')}
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
            </div>
          </div>

          {/* Right Column - Registration Settings & Preview */}
          <div className="space-y-8">
            {/* Registration Settings */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Registration Settings</h2>
              
              <div className="space-y-6">
                {/* Registration Deadline */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Registration Deadline *
                  </label>
                  <input
                    type="date"
                    value={meetData.registrationDeadline}
                    onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isRegistrationDeadlineInvalid ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  {isRegistrationDeadlineInvalid && (
                    <p className="text-xs text-red-400 mt-1">
                      Registration deadline must be before the competition date
                    </p>
                  )}
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Users size={16} className="inline mr-1" />
                    Maximum Participants *
                  </label>
                  <input
                    type="number"
                    value={meetData.maxParticipants || ''}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
                    placeholder="150"
                    min="1"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Registration Fee */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    Registration Fee *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={meetData.registrationFee || ''}
                      onChange={(e) => handleInputChange('registrationFee', parseFloat(e.target.value) || 0)}
                      placeholder="85.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Early Bird Deadline */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Early Bird Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={meetData.earlyBirdDeadline}
                    onChange={(e) => handleInputChange('earlyBirdDeadline', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Early Bird Fee */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    Early Bird Fee (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={meetData.earlyBirdFee || ''}
                      onChange={(e) => handleInputChange('earlyBirdFee', parseFloat(e.target.value) || 0)}
                      placeholder="75.00"
                      min="0"
                      step="0.01"
                      disabled={!meetData.earlyBirdDeadline}
                      className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Meet Preview */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Meet Preview</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium">{meetData.name || 'Meet Name'}</p>
                  <p className="text-sm text-slate-400">
                    {formatDate(meetData.date)} • {meetData.federation}
                  </p>
                  <p className="text-sm text-slate-400">
                    {meetData.location.venue || 'Venue'} • {meetData.location.city}, {meetData.location.state}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Registration</p>
                    <p className="text-white">{formatCurrency(meetData.registrationFee)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Max Athletes</p>
                    <p className="text-white">{meetData.maxParticipants}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Weight Classes</p>
                    <p className="text-white">
                      {isAnyWeightClassSelected ? 'Any' : `${meetData.weightClasses.length} selected`}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Divisions</p>
                    <p className="text-white">{meetData.divisions.length} selected</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-700">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    meetData.status === 'published' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {meetData.status === 'published' ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button (Duplicate for easy access) */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
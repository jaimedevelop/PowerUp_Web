// src/features/athlete/components/compete/MeetRegistrationModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Phone, 
  Shield, 
  Trophy, 
  Weight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { RegistrationService, RegistrationFormData, MeetRegistration } from '../../../../services/athlete/registration';
import { MeetData } from '../../../../firebase/database';

interface MeetRegistrationModalProps {
  meet: MeetData;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (registration: MeetRegistration) => void;
}

export const MeetRegistrationModal: React.FC<MeetRegistrationModalProps> = ({
  meet,
  userId,
  isOpen,
  onClose,
  onRegistrationComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    weightClass: '',
    division: '',
    equipment: '',
    expectedWeight: 0,
    dateOfBirth: '',
    gender: 'male',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    personalRecords: {
      squat: undefined,
      bench: undefined,
      deadlift: undefined,
      total: undefined,
    },
    federationMembership: undefined,
    coachInfo: undefined,
    agreedToWaiver: false,
    agreedToRules: false,
  });

  const [hasOptionalInfo, setHasOptionalInfo] = useState({
    personalRecords: false,
    federationMembership: false,
    coachInfo: false,
  });

  const totalSteps = 4;

  // Auto-calculate total when personal records change
  useEffect(() => {
    if (hasOptionalInfo.personalRecords && formData.personalRecords) {
      const squat = formData.personalRecords.squat || 0;
      const bench = formData.personalRecords.bench || 0;
      const deadlift = formData.personalRecords.deadlift || 0;
      const calculatedTotal = squat + bench + deadlift;
      
      if (calculatedTotal > 0) {
        setFormData(prev => ({
          ...prev,
          personalRecords: {
            ...prev.personalRecords,
            total: calculatedTotal,
          },
        }));
      }
    }
  }, [formData.personalRecords?.squat, formData.personalRecords?.bench, formData.personalRecords?.deadlift, hasOptionalInfo.personalRecords]);

  // Don't render if modal is not open
  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any, nested?: string) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested as keyof typeof prev],
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
    setError(null); // Clear error when user makes changes
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.weightClass && formData.division && formData.equipment && formData.expectedWeight > 0);
      case 2:
        return !!(formData.dateOfBirth && formData.gender);
      case 3:
        return !!(formData.emergencyContact.name && formData.emergencyContact.phone && formData.emergencyContact.relationship);
      case 4:
        return formData.agreedToWaiver && formData.agreedToRules;
      default:
        return true;
    }
  };

  const cleanFormData = (data: RegistrationFormData): RegistrationFormData => {
    const cleaned = { ...data };
    
    // Remove undefined values from personalRecords if not using optional info
    if (!hasOptionalInfo.personalRecords || !cleaned.personalRecords) {
      cleaned.personalRecords = undefined;
    } else {
      // Clean up undefined values in personalRecords
      const prs = cleaned.personalRecords;
      cleaned.personalRecords = {
        squat: prs.squat || undefined,
        bench: prs.bench || undefined,
        deadlift: prs.deadlift || undefined,
        total: prs.total || undefined,
      };
      
      // If all values are undefined, set the whole object to undefined
      if (!prs.squat && !prs.bench && !prs.deadlift && !prs.total) {
        cleaned.personalRecords = undefined;
      }
    }

    // Clean federation membership
    if (!hasOptionalInfo.federationMembership || !cleaned.federationMembership) {
      cleaned.federationMembership = undefined;
    }

    // Clean coach info
    if (!hasOptionalInfo.coachInfo || !cleaned.coachInfo) {
      cleaned.coachInfo = undefined;
    }

    return cleaned;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanedData = cleanFormData(formData);
      const registration = await RegistrationService.registerForMeet(
        meet.id,
        userId,
        cleanedData
      );
      onRegistrationComplete(registration);
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to register for meet');
    } finally {
      setIsLoading(false);
    }
  };

  const federations = ['USAPL', 'USPA', 'IPF', 'RPS', 'SPF', 'WRPF', 'CPU', 'Other'];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Trophy className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Competition Details</h3>
        <p className="text-slate-400">Select your competition category and weight class</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Weight Class *
          </label>
          <select
            value={formData.weightClass}
            onChange={(e) => handleInputChange('weightClass', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select weight class</option>
            {meet.weightClasses.map((wc) => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Division *
          </label>
          <select
            value={formData.division}
            onChange={(e) => handleInputChange('division', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select division</option>
            {meet.divisions.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Equipment *
          </label>
          <select
            value={formData.equipment}
            onChange={(e) => handleInputChange('equipment', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select equipment</option>
            {meet.equipment.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Expected Weight (lbs) *
          </label>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="number"
              value={formData.expectedWeight || ''}
              onChange={(e) => handleInputChange('expectedWeight', parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter expected weight"
              min="0"
              step="0.1"
              required
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            This helps with flight organization. Actual weight will be recorded at weigh-ins.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
        <p className="text-slate-400">Required information for meet registration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Phone className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Emergency Contact</h3>
        <p className="text-slate-400">Required for safety during competition</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => handleInputChange('name', e.target.value, 'emergencyContact')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Relationship *
            </label>
            <select
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleInputChange('relationship', e.target.value, 'emergencyContact')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="spouse">Spouse</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="coach">Coach</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) => handleInputChange('phone', e.target.value, 'emergencyContact')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>

      {/* Optional Sections Toggle */}
      <div className="space-y-4 pt-4 border-t border-slate-700">
        <h4 className="text-lg font-medium text-white">Optional Information</h4>
        <p className="text-sm text-slate-400">Add additional details to enhance your meet experience</p>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasOptionalInfo.personalRecords}
              onChange={(e) => setHasOptionalInfo(prev => ({ ...prev, personalRecords: e.target.checked }))}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-slate-300">Add Personal Records</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasOptionalInfo.federationMembership}
              onChange={(e) => setHasOptionalInfo(prev => ({ ...prev, federationMembership: e.target.checked }))}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-slate-300">Add Federation Membership</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasOptionalInfo.coachInfo}
              onChange={(e) => setHasOptionalInfo(prev => ({ ...prev, coachInfo: e.target.checked }))}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-slate-300">Add Coach Information</span>
          </label>
        </div>

        {/* Optional Personal Records */}
        {hasOptionalInfo.personalRecords && (
          <div className="bg-slate-800 rounded-lg p-4 space-y-4">
            <h5 className="font-medium text-white">Personal Records (lbs)</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Squat</label>
                <input
                  type="number"
                  value={formData.personalRecords?.squat || ''}
                  onChange={(e) => handleInputChange('squat', parseFloat(e.target.value) || undefined, 'personalRecords')}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Bench</label>
                <input
                  type="number"
                  value={formData.personalRecords?.bench || ''}
                  onChange={(e) => handleInputChange('bench', parseFloat(e.target.value) || undefined, 'personalRecords')}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Deadlift</label>
                <input
                  type="number"
                  value={formData.personalRecords?.deadlift || ''}
                  onChange={(e) => handleInputChange('deadlift', parseFloat(e.target.value) || undefined, 'personalRecords')}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Total</label>
                <input
                  type="number"
                  value={formData.personalRecords?.total || ''}
                  className="w-full px-2 py-1 text-sm bg-slate-600 border border-slate-600 rounded text-slate-400 cursor-not-allowed"
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">Total is automatically calculated from your lift entries</p>
          </div>
        )}

        {/* Optional Federation Membership */}
        {hasOptionalInfo.federationMembership && (
          <div className="bg-slate-800 rounded-lg p-4 space-y-4">
            <h5 className="font-medium text-white">Federation Membership</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Federation</label>
                <select
                  value={formData.federationMembership?.federation || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      federationMembership: {
                        ...prev.federationMembership,
                        federation: e.target.value,
                        membershipNumber: prev.federationMembership?.membershipNumber || '',
                        expirationDate: prev.federationMembership?.expirationDate || '',
                      }
                    }));
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select Federation</option>
                  {federations.map(fed => (
                    <option key={fed} value={fed}>{fed}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Member ID</label>
                <input
                  type="text"
                  value={formData.federationMembership?.membershipNumber || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      federationMembership: {
                        ...prev.federationMembership,
                        federation: prev.federationMembership?.federation || '',
                        membershipNumber: e.target.value,
                        expirationDate: prev.federationMembership?.expirationDate || '',
                      }
                    }));
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Membership number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={formData.federationMembership?.expirationDate || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      federationMembership: {
                        ...prev.federationMembership,
                        federation: prev.federationMembership?.federation || '',
                        membershipNumber: prev.federationMembership?.membershipNumber || '',
                        expirationDate: e.target.value,
                      }
                    }));
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Optional Coach Info */}
        {hasOptionalInfo.coachInfo && (
          <div className="bg-slate-800 rounded-lg p-4 space-y-4">
            <h5 className="font-medium text-white">Coach Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Coach Name</label>
                <input
                  type="text"
                  value={formData.coachInfo?.coachName || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      coachInfo: {
                        ...prev.coachInfo,
                        coachName: e.target.value,
                        coachEmail: prev.coachInfo?.coachEmail || '',
                        coachPhone: prev.coachInfo?.coachPhone || '',
                        teamName: prev.coachInfo?.teamName || '',
                      }
                    }));
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Coach's full name"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Coach Email</label>
                <input
                  type="email"
                  value={formData.coachInfo?.coachEmail || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      coachInfo: {
                        ...prev.coachInfo,
                        coachName: prev.coachInfo?.coachName || '',
                        coachEmail: e.target.value,
                        coachPhone: prev.coachInfo?.coachPhone || '',
                        teamName: prev.coachInfo?.teamName || '',
                      }
                    }));
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="coach@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">PowerUp Username (Optional)</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input
                    type="text"
                    value={formData.coachInfo?.teamName || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        coachInfo: {
                          ...prev.coachInfo,
                          coachName: prev.coachInfo?.coachName || '',
                          coachEmail: prev.coachInfo?.coachEmail || '',
                          coachPhone: prev.coachInfo?.coachPhone || '',
                          teamName: e.target.value,
                        }
                      }));
                    }}
                    className="w-full pl-6 pr-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="powerupusername"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Review & Agree</h3>
        <p className="text-slate-400">Review your information and agree to terms</p>
      </div>

      {/* Registration Summary */}
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-white mb-4">Registration Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Weight Class:</span>
            <span className="ml-2 text-white font-medium">{formData.weightClass}</span>
          </div>
          <div>
            <span className="text-slate-400">Division:</span>
            <span className="ml-2 text-white font-medium">{formData.division}</span>
          </div>
          <div>
            <span className="text-slate-400">Equipment:</span>
            <span className="ml-2 text-white font-medium">{formData.equipment}</span>
          </div>
          <div>
            <span className="text-slate-400">Expected Weight:</span>
            <span className="ml-2 text-white font-medium">{formData.expectedWeight} lbs</span>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Registration Fee:</span>
            <span className="text-xl font-bold text-white">
              ${meet.earlyBirdDeadline && new Date() < new Date(meet.earlyBirdDeadline) 
                ? meet.earlyBirdFee || meet.registrationFee
                : meet.registrationFee
              }
            </span>
          </div>
          {meet.earlyBirdDeadline && new Date() < new Date(meet.earlyBirdDeadline) && (
            <div className="text-sm text-green-400 text-right">
              Early bird pricing applied!
            </div>
          )}
        </div>
      </div>

      {/* Agreement Checkboxes */}
      <div className="space-y-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreedToWaiver}
            onChange={(e) => handleInputChange('agreedToWaiver', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 mt-1"
            required
          />
          <span className="ml-3 text-sm text-slate-300">
            I agree to the <button type="button" className="text-purple-400 hover:text-purple-300 underline">liability waiver</button> and understand the risks associated with powerlifting competition.
          </span>
        </label>
        
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreedToRules}
            onChange={(e) => handleInputChange('agreedToRules', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 mt-1"
            required
          />
          <span className="ml-3 text-sm text-slate-300">
            I agree to abide by the <button type="button" className="text-purple-400 hover:text-purple-300 underline">competition rules</button> and {meet.federation} regulations.
          </span>
        </label>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">Important:</p>
            <p>Payment will be processed after registration approval. You'll receive a confirmation email with payment instructions.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-white">Register for Meet</h2>
              <p className="text-sm text-slate-400 mt-1">{meet.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-slate-400">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateCurrentStep() || isLoading}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetRegistrationModal;
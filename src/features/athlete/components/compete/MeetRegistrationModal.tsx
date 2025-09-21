// src/features/athlete/components/compete/MeetRegistrationModal.tsx
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { RegistrationService, RegistrationFormData, MeetRegistration } from '../../../../services/athlete/registration';
import { MeetData } from '../../../../firebase/database';
import { useAuth } from '../../../../contexts/shared/AuthContext';
import emailService from '../../../../services/emails/emailService';

// Step Components
import { FederationMembershipStep } from './registrationSteps/FederationMembershipStep';
import { CompetitionDetailsStep } from './registrationSteps/CompetitionDetailsStep';
import { CoachTeamInfoStep } from './registrationSteps/CoachTeamInfoStep';
import { EmergencyContactStep } from './registrationSteps/EmergencyContactStep';
import { ReviewAgreementStep } from './registrationSteps/ReviewAgreementStep';
import { PaymentProcessingStep } from './registrationSteps/PaymentProcessingStep';

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
  const { userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    // Federation membership (now required and first)
    federationMembership: {
      federation: '',
      membershipNumber: '',
      expirationDate: '',
    },
    // Competition details
    weightClass: '',
    division: '',
    equipment: '',
    // Coach/Team info
    hasCoach: false,
    coachInfo: {
      coachName: '',
      coachPhone: '',
      coachPowerUpUsername: '',
      teamName: '',
      teamPowerUpUsername: '',
    },
    // Emergency contact (loaded from user profile)
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    // Agreements
    agreedToWaiver: false,
    agreedToRules: false,
  });

  const [emergencyContactEditing, setEmergencyContactEditing] = useState(false);

  const totalSteps = 6;

  // Load emergency contact from user profile on mount
  useEffect(() => {
    if (userProfile?.emergencyContact) {
      setFormData(prev => ({
        ...prev,
        emergencyContact: userProfile.emergencyContact,
      }));
    }
  }, [userProfile]);

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
      case 1: // Federation Membership
        const federation = formData.federationMembership;
        if (!federation.federation || !federation.membershipNumber || !federation.expirationDate) {
          return false;
        }
        // Check if membership is expired
        const expirationDate = new Date(federation.expirationDate);
        const today = new Date();
        return expirationDate > today;
      case 2: // Competition Details
        return !!(formData.weightClass && formData.division && formData.equipment);
      case 3: // Coach/Team Info
        if (!formData.hasCoach) return true; // Valid if no coach selected
        return !!(formData.coachInfo?.coachName && formData.coachInfo?.coachPhone);
      case 4: // Emergency Contact
        return !!(formData.emergencyContact.name && formData.emergencyContact.phone && formData.emergencyContact.relationship);
      case 5: // Review & Agreement
        return formData.agreedToWaiver && formData.agreedToRules;
      case 6: // Payment
        return paymentCompleted;
      default:
        return true;
    }
  };

  const canNavigateFromStep1 = (): boolean => {
    const federation = formData.federationMembership;
    if (!federation.federation || !federation.membershipNumber || !federation.expirationDate) {
      return false;
    }
    // Check if membership is expired
    const expirationDate = new Date(federation.expirationDate);
    const today = new Date();
    if (expirationDate <= today) {
      setError('Federation membership is expired. You cannot register with an expired membership.');
      return false;
    }
    return true;
  };

  const handleNextWithValidation = () => {
    if (currentStep === 1 && !canNavigateFromStep1()) {
      return; // Block navigation if federation check fails
    }
    handleNext();
  };

  const formatMeetDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  const formatMeetLocation = (location: string | { venue?: string; address?: string; city?: string; state?: string }): string => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (location && typeof location === 'object') {
      const parts = [
        location.venue,
        location.city,
        location.state
      ].filter(Boolean);
      
      return parts.join(', ');
    }
    
    return 'Location TBD';
  };

  const calculateRegistrationFee = (): number => {
    const now = new Date();
    const earlyBirdDeadline = meet.earlyBirdDeadline ? new Date(meet.earlyBirdDeadline) : null;
    
    if (earlyBirdDeadline && now <= earlyBirdDeadline && meet.earlyBirdFee) {
      return meet.earlyBirdFee;
    }
    
    return meet.registrationFee;
  };

  const sendRegistrationEmail = async (registration: MeetRegistration): Promise<void> => {
    try {
      if (!userProfile) {
        console.warn('No user profile available for registration email');
        return;
      }

      const userName = `${userProfile.firstName} ${userProfile.lastName}`;
      const meetDate = formatMeetDate(meet.date);
      const meetLocation = formatMeetLocation(meet.location);
      const registrationFee = calculateRegistrationFee();

      console.log('Sending meet registration confirmation email...');
      
      const emailSent = await emailService.sendMeetRegistrationConfirmation({
        userEmail: userProfile.email,
        userName: userName,
        meetName: meet.name,
        meetDate: meetDate,
        meetLocation: meetLocation,
        registrationId: registration.id,
        weightClass: formData.weightClass,
        division: formData.division,
        registrationFee: registrationFee
      });

      if (emailSent) {
        console.log('Meet registration confirmation email sent successfully');
      } else {
        console.error('Failed to send meet registration confirmation email');
      }
    } catch (error) {
      console.error('Error sending meet registration confirmation email:', error);
    }
  };

  const updateUserEmergencyContact = async (): Promise<void> => {
    try {
      if (!userProfile || !emergencyContactEditing) return;
      
      // TODO: Implement user profile update service
      // await UserService.updateEmergencyContact(userId, formData.emergencyContact);
      console.log('Emergency contact will be updated after successful registration');
    } catch (error) {
      console.error('Failed to update emergency contact:', error);
    }
  };

  const handleSubmit = async () => {
  if (!validateCurrentStep()) {
    setError('Please complete the payment process');
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    // Validate user profile data exists
    if (!userProfile?.dateOfBirth) {
      setError('Date of birth is missing from your profile. Please update your profile first.');
      setIsLoading(false);
      return;
    }
    
    if (!userProfile?.gender) {
      setError('Gender is missing from your profile. Please update your profile first.');
      setIsLoading(false);
      return;
    }
    
    // Validate the date of birth is a valid date string or Date object
    let dateOfBirthString: string;
    if (userProfile.dateOfBirth instanceof Date) {
      dateOfBirthString = userProfile.dateOfBirth.toISOString();
    } else if (typeof userProfile.dateOfBirth === 'string') {
      // Validate it's a valid date string
      const testDate = new Date(userProfile.dateOfBirth);
      if (isNaN(testDate.getTime())) {
        setError('Invalid date of birth in your profile. Please update your profile.');
        setIsLoading(false);
        return;
      }
      dateOfBirthString = userProfile.dateOfBirth;
    } else {
      setError('Invalid date of birth format in your profile. Please update your profile.');
      setIsLoading(false);
      return;
    }
    
    // Add date of birth and gender from user profile
    const registrationData: RegistrationFormData = {
      ...formData,
      dateOfBirth: dateOfBirthString,
      gender: userProfile.gender as 'male' | 'female',
    };

    const registration = await RegistrationService.registerForMeet(
      meet.id,
      userId,
      registrationData
    );

    // Update emergency contact if it was edited
    if (emergencyContactEditing) {
      await updateUserEmergencyContact();
    }

    // Send registration confirmation email (non-blocking)
    sendRegistrationEmail(registration).catch(error => {
      console.error('Registration email failed (non-blocking):', error);
    });

    onRegistrationComplete(registration);
    onClose();
  } catch (error) {
    console.error('Registration error:', error);
    setError(error instanceof Error ? error.message : 'Failed to register for meet');
  } finally {
    setIsLoading(false);
  }
};

  const renderStepContent = () => {
    const stepProps = {
      formData,
      meet,
      userProfile,
      handleInputChange,
      setFormData,
      calculateRegistrationFee,
      emergencyContactEditing,
      setEmergencyContactEditing,
      paymentCompleted,
      setPaymentCompleted,
    };

    switch (currentStep) {
      case 1:
        return <FederationMembershipStep {...stepProps} />;
      case 2:
        return <CompetitionDetailsStep {...stepProps} />;
      case 3:
        return <CoachTeamInfoStep {...stepProps} />;
      case 4:
        return <EmergencyContactStep {...stepProps} />;
      case 5:
        return <ReviewAgreementStep {...stepProps} />;
      case 6:
        return <PaymentProcessingStep {...stepProps} />;
      default:
        return <FederationMembershipStep {...stepProps} />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Federation Membership';
      case 2: return 'Competition Details';
      case 3: return 'Coach & Team Information';
      case 4: return 'Emergency Contact';
      case 5: return 'Review & Agreement';
      case 6: return 'Payment Processing';
      default: return 'Registration';
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
              <p className="text-sm text-slate-400 mt-1">{meet.name} - {getStepTitle()}</p>
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
                  onClick={currentStep === 1 ? handleNextWithValidation : handleNext}
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
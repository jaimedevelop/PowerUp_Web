// src/admin/components/meets/CreateMeetWizard.tsx
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { BasicInfoStep } from './BasicInfoStep';
import { CompetitionDetailsStep } from './CompetitionDetailsStep';
import { RegistrationSettingsStep } from './RegistrationSettingsStep';
import { PublishStep } from './PublishStep';
import { MeetData, WizardStep } from '../../types/meets';
import { createMeet, updateMeet, validateMeetData, handleFirebaseError } from '../../../firebase';

const initialMeetData: MeetData = {
  name: '',
  date: '',
  location: {
    venue: '',
    address: '',
    city: '',
    state: '',
  },
  federation: 'USAPL',
  weightClasses: [],
  divisions: [],
  equipment: [],
  registrationDeadline: '',
  registrationFee: 0,
  maxParticipants: 0,
  earlyBirdDeadline: '',
  earlyBirdFee: 0,
  status: 'draft',
};

const steps: WizardStep[] = [
  { id: 1, name: 'Basic Info', component: BasicInfoStep },
  { id: 2, name: 'Competition Details', component: CompetitionDetailsStep },
  { id: 3, name: 'Registration Settings', component: RegistrationSettingsStep },
  { id: 4, name: 'Review & Publish', component: PublishStep },
];

interface CreateMeetWizardProps {
  onComplete?: () => void;
  editMode?: boolean;
  meetId?: string | null;
  initialData?: MeetData;
}

export const CreateMeetWizard: React.FC<CreateMeetWizardProps> = ({ 
  onComplete, 
  editMode = false, 
  meetId = null,
  initialData = null,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [meetData, setMeetData] = useState<MeetData>(initialData || initialMeetData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateMeetData = (data: Partial<MeetData>) => {
    setMeetData(prev => ({ ...prev, ...data }));
    // Clear errors when user makes changes
    if (error) setError(null);
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const validateCurrentStep = (): boolean => {
    const validation = validateMeetData(meetData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }
    
    setValidationErrors([]);
    return true;
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Final validation before submission
      const validation = validateMeetData(meetData);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Meet validation warnings:', validation.warnings);
      }

      let result;
      
      if (editMode && meetId) {
        // Update existing meet
        await updateMeet(meetId, meetData);
        result = meetId;
        console.log('Meet updated successfully:', meetId);
      } else {
        // Create new meet
        result = await createMeet(meetData);
        console.log('Meet created successfully:', result);
      }

      // Show success message
      const successMessage = editMode 
        ? `Meet "${meetData.name}" updated successfully!`
        : `Meet "${meetData.name}" created successfully!`;
      
      // You can replace this with a proper toast notification
      alert(successMessage);
      
      // Call onComplete callback to navigate back
      if (onComplete) {
        onComplete();
      }
      
    } catch (err) {
      console.error('Error saving meet:', err);
      
      // Handle Firebase errors gracefully
      const firebaseError = handleFirebaseError(err);
      setError(firebaseError.message);
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStepComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    const StepComponent = step.component;
    return (
      <StepComponent
        data={meetData}
        updateData={updateMeetData}
        onNext={nextStep}
        onPrev={prevStep}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    );
  };

  const getStepStatus = (stepId: number) => {
    if (currentStep > stepId) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Display */}
      {(error || validationErrors.length > 0) && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-red-400 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-400 font-medium mb-2">
                {error ? 'Error Saving Meet' : 'Validation Errors'}
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

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : status === 'current'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {status === 'completed' ? <Check size={20} /> : step.id}
                </div>
                <div className="ml-3">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      status === 'completed' || status === 'current' 
                        ? 'text-white' 
                        : 'text-slate-400'
                    }`}
                  >
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-8 h-0.5 w-20 transition-colors ${
                      status === 'completed' 
                        ? 'bg-green-500' 
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        {getCurrentStepComponent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
        >
          <ArrowLeft size={20} className="mr-2" />
          Previous
        </button>

        <div className="text-sm text-slate-400">
          Step {currentStep} of {steps.length}
        </div>

        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="flex items-center px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Next
            <ArrowRight size={20} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? `${editMode ? 'Updating' : 'Creating'} Meet...` 
              : `${editMode ? 'Update' : 'Create'} Meet`
            }
            {!isSubmitting && <Check size={20} className="ml-2" />}
          </button>
        )}
      </div>
    </div>
  );
};
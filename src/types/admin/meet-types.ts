// Types related to meets, primarily managed by meet directors

import { Federation, MeetLocation } from '../shared/common-types';

export type MeetStatus = 'draft' | 'published' | 'registration-open' | 'registration-closed' | 'in-progress' | 'completed';

export interface MeetData {
  // Basic Info
  name: string;
  date: string;
  location: MeetLocation;
  federation: Federation;
  
  // Competition Details
  weightClasses: string[];
  divisions: string[];
  equipment: string[];
  
  // Registration Settings
  registrationDeadline: string;
  registrationFee: number;
  maxParticipants: number;
  earlyBirdDeadline: string;
  earlyBirdFee: number;
  
  // Stats (added for Firebase)
  registrations: number;
  revenue: number;
  
  // Publish Settings
  status: MeetStatus;
}

export interface Meet extends MeetData {
  id: string;
  directorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Updated interface to match the wizard's expectations
export interface StepComponentProps {
  data: MeetData;
  updateData: (data: Partial<MeetData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
  onSubmit?: (status?: MeetStatus) => void; // Now accepts optional status parameter
}

// Wizard Step Definition
export interface WizardStep {
  id: number;
  name: string;
  component: React.ComponentType<StepComponentProps>;
}

export interface FederationOption {
  value: Federation;
  label: string;
}
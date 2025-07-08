// src/admin/types/meets.ts
export type Federation = 'USAPL' | 'USPA' | 'IPF' | 'Other';
export type MeetStatus = 'draft' | 'published' | 'registration-open' | 'registration-closed' | 'in-progress' | 'completed';

export interface MeetLocation {
  venue: string;
  address: string;
  city: string;
  state: string;
}

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

// Meet interface for list display (matches MeetCard expectations)
export interface MeetListItem {
  id: string;
  name: string;
  date: string;
  location: MeetLocation; // Full location object
  registrations: number;
  maxParticipants: number;
  status: MeetStatus;
  revenue: number;
}

// Step Component Props
export interface StepComponentProps {
  data: MeetData;
  updateData: (data: Partial<MeetData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

// Wizard Step Definition
export interface WizardStep {
  id: number;
  name: string;
  component: React.ComponentType<StepComponentProps>;
}

// Standard Data Sets
export interface WeightClassSet {
  men: string[];
  women: string[];
}

export interface FederationOption {
  value: Federation;
  label: string;
}

// Registration Model
export interface Registration {
  id: string;
  meetId: string;
  athleteId: string;
  weightClass: string;
  division: string;
  equipment: string;
  registrationDate: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  paymentAmount: number;
  isEarlyBird: boolean;
}

// Athlete Model (for registration context)
export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  federationMembership?: {
    federation: Federation;
    membershipNumber: string;
    expirationDate: Date;
  };
}

// Communication Models
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'registration' | 'reminder' | 'update' | 'cancellation';
}

export interface CommunicationMessage {
  id: string;
  meetId: string;
  senderId: string;
  recipients: string[];
  subject: string;
  message: string;
  sentAt: Date;
  status: 'draft' | 'sent' | 'failed';
  templateId?: string;
}

// Meet Director Model
export interface MeetDirector {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  certifications: {
    federation: Federation;
    level: string;
    expirationDate: Date;
  }[];
  createdAt: Date;
}

// Financial Models
export interface FinancialSummary {
  totalRevenue: number;
  pendingPayments: number;
  refundsIssued: number;
  processingFees: number;
  netRevenue: number;
  registrationCount: number;
}

export interface PaymentRecord {
  id: string;
  registrationId: string;
  amount: number;
  currency: 'USD';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'cash';
  processedAt?: Date;
  failureReason?: string;
  refundAmount?: number;
  refundedAt?: Date;
}

// Statistics Models
export interface MeetStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  totalRevenue: number;
  availableSpots: number;
  registrationProgress: number;
  estimatedMaxRevenue: number;
}

export interface OverallStats {
  totalMeets: number;
  totalRegistrations: number;
  totalRevenue: number;
  registrationOpenCount: number;
  publishedCount: number;
  draftCount: number;
  completedCount: number;
}
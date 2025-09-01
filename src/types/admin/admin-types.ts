// Types related to meet directors and administrative functions

import { Federation } from '../shared/common-types';
import { MeetStatus } from './meet-types';

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
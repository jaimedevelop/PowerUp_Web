// Types related to registrations, relevant to both athletes and meet directors

import { Federation } from './common-types';

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
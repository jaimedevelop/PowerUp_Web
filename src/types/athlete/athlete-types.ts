// Types related to athletes

import { Federation } from '../shared/common-types';

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
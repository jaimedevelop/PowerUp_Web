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

/**
 * createdAt
 * updatedAt
 * displayName
 * firstName
 * lastName
 * bio
 * images
 * widgets
 * contactInfo [phoneNumber, email, mailAddress]
 * emergencyContact[Name, Relationship PhoneNumber, Email]
 * federation [membershipNumber, expirationDate]
 * 
 * Athlete
 * dateOfBirth
 * gender
 * location [city, ]
 * 
 * Affiliations Array
 *  localGym[]
 *  coachID
 *  teamID
 * 
 * Admin
 * 
 * Coach
 * 
 * RegistrationObject
 * weight
 * division
 * 
 */
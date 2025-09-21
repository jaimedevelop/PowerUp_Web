// src/services/meets/registration.ts
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { handleFirebaseError } from '../../firebase/index';

// Registration Interfaces
export interface MeetRegistration {
  id: string;
  meetId: string;
  userId: string;
  
  // Competition Details (collected during registration)
  weightClass: string;
  division: string;
  equipment: string;
  
  // Personal Details (from AuthContext - required)
  dateOfBirth: Date;
  gender: 'male' | 'female';
  emergencyContact: EmergencyContact;
  
  // Federation Membership (now required)
  federationMembership: FederationMembership;
  
  // Coach/Team Info
  hasCoach: boolean;
  coachInfo?: CoachInfo;
  
  // Registration Status
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registeredAt: Date;
  updatedAt: Date;
  
  // Meet Director Fields
  flight?: string;
  platform?: number;
  weightInStatus?: 'pending' | 'passed' | 'failed';
  actualWeight?: number; // Set during weigh-ins
  notes?: string; // Meet director notes
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface FederationMembership {
  federation: string;
  membershipNumber: string;
  expirationDate: Date;
}

export interface CoachInfo {
  coachName: string;
  coachPhone: string;
  coachPowerUpUsername?: string;
  teamName?: string;
  teamPowerUpUsername?: string;
}

export type RegistrationStatus = 
  | 'pending'      // Just registered, awaiting approval
  | 'approved'     // Approved by meet director
  | 'waitlisted'   // Meet is full, on waiting list
  | 'rejected'     // Registration rejected
  | 'withdrawn'    // Athlete withdrew
  | 'checked-in';  // Checked in on meet day

export type PaymentStatus = 
  | 'unpaid'       // Registration fee not paid
  | 'paid'         // Full payment received
  | 'partial'      // Partial payment received
  | 'refunded'     // Payment refunded
  | 'waived';      // Fee waived by director

// Registration Form Data (what we collect from the athlete)
export interface RegistrationFormData {
  // Federation membership (required first)
  federationMembership: {
    federation: string;
    membershipNumber: string;
    expirationDate: string; // Will be converted to Date
  };
  
  // Competition choices
  weightClass: string;
  division: string;
  equipment: string;
  
  // Coach/Team information
  hasCoach: boolean;
  coachInfo?: {
    coachName: string;
    coachPhone: string;
    coachPowerUpUsername?: string;
    teamName?: string;
    teamPowerUpUsername?: string;
  };
  
  // Emergency contact (from user profile or updated)
  emergencyContact: EmergencyContact;
  
  // Agreement/waivers
  agreedToWaiver: boolean;
  agreedToRules: boolean;
  
  // Personal data (added from AuthContext during submission)
  dateOfBirth?: string;
  gender?: 'male' | 'female';
}

// Registration Statistics
export interface RegistrationStats {
  totalRegistrations: number;
  approvedRegistrations: number;
  pendingRegistrations: number;
  waitlistedRegistrations: number;
  paidRegistrations: number;
  totalRevenue: number;
  pendingRevenue: number;
  averageWeight: number;
  divisionBreakdown: Record<string, number>;
  weightClassBreakdown: Record<string, number>;
  federationBreakdown: Record<string, number>;
  coachCount: number;
}

// Helper function to clean undefined values from objects
function cleanUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Date || obj instanceof Timestamp) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefinedValues);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = cleanUndefinedValues(value);
        }
      }
    }
    return cleaned;
  }
  
  return obj;
}

// Registration Service Class
export class RegistrationService {
  
  /**
   * Register an athlete for a meet
   */
  static async registerForMeet(
    meetId: string, 
    userId: string, 
    formData: RegistrationFormData
  ): Promise<MeetRegistration> {
    try {
      // Validate meet exists and registration is open
      await this.validateMeetRegistration(meetId);
      
      // Check if user is already registered
      const existingRegistration = await this.getUserRegistration(meetId, userId);
      if (existingRegistration) {
        throw new Error('You are already registered for this meet');
      }
      
      // Validate required fields
      this.validateRegistrationData(formData);
      
      // Generate registration ID
      const registrationId = `${meetId}_${userId}`;
      const now = new Date();
      
      // Parse dates safely with validation
      let dateOfBirth: Date;
      if (formData.dateOfBirth) {
        dateOfBirth = new Date(formData.dateOfBirth);
        // Check if date is valid
        if (isNaN(dateOfBirth.getTime())) {
          throw new Error('Invalid date of birth provided');
        }
      } else {
        throw new Error('Date of birth is required');
      }
      
      // Parse federation expiration date
      let federationExpirationDate: Date;
      if (formData.federationMembership.expirationDate) {
        federationExpirationDate = new Date(formData.federationMembership.expirationDate);
        // Check if date is valid
        if (isNaN(federationExpirationDate.getTime())) {
          throw new Error('Invalid federation membership expiration date');
        }
      } else {
        throw new Error('Federation membership expiration date is required');
      }
      
      // Validate gender
      const gender = formData.gender;
      if (!gender || (gender !== 'male' && gender !== 'female')) {
        throw new Error('Valid gender selection is required');
      }
      
      // Create registration document
      const registration: MeetRegistration = {
        id: registrationId,
        meetId,
        userId,
        weightClass: formData.weightClass,
        division: formData.division,
        equipment: formData.equipment,
        dateOfBirth: dateOfBirth,
        gender: gender,
        emergencyContact: formData.emergencyContact,
        federationMembership: {
          federation: formData.federationMembership.federation,
          membershipNumber: formData.federationMembership.membershipNumber,
          expirationDate: federationExpirationDate
        },
        hasCoach: formData.hasCoach,
        registrationStatus: 'pending',
        paymentStatus: 'unpaid',
        registeredAt: now,
        updatedAt: now,
      };
      
      // Only add coachInfo if hasCoach is true and coachInfo exists
      if (formData.hasCoach && formData.coachInfo) {
        registration.coachInfo = {
          coachName: formData.coachInfo.coachName,
          coachPhone: formData.coachInfo.coachPhone,
        };
        
        // Only add optional coach fields if they have values
        if (formData.coachInfo.coachPowerUpUsername) {
          registration.coachInfo.coachPowerUpUsername = formData.coachInfo.coachPowerUpUsername;
        }
        if (formData.coachInfo.teamName) {
          registration.coachInfo.teamName = formData.coachInfo.teamName;
        }
        if (formData.coachInfo.teamPowerUpUsername) {
          registration.coachInfo.teamPowerUpUsername = formData.coachInfo.teamPowerUpUsername;
        }
      }
      
      // Prepare Firestore document (convert dates to Timestamps)
      const firestoreData: any = {
        id: registration.id,
        meetId: registration.meetId,
        userId: registration.userId,
        weightClass: registration.weightClass,
        division: registration.division,
        equipment: registration.equipment,
        dateOfBirth: Timestamp.fromDate(registration.dateOfBirth),
        gender: registration.gender,
        emergencyContact: registration.emergencyContact,
        federationMembership: {
          federation: registration.federationMembership.federation,
          membershipNumber: registration.federationMembership.membershipNumber,
          expirationDate: Timestamp.fromDate(registration.federationMembership.expirationDate)
        },
        hasCoach: registration.hasCoach,
        registrationStatus: registration.registrationStatus,
        paymentStatus: registration.paymentStatus,
        registeredAt: Timestamp.fromDate(registration.registeredAt),
        updatedAt: Timestamp.fromDate(registration.updatedAt),
      };
      
      // Only add coachInfo to Firestore if it exists
      if (registration.coachInfo) {
        firestoreData.coachInfo = registration.coachInfo;
      }
      
      // Clean any remaining undefined values
      const cleanedData = cleanUndefinedValues(firestoreData);
      
      // Use batch write to update both registration and meet stats
      const batch = writeBatch(db);
      
      // Add registration to subcollection
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      batch.set(registrationRef, cleanedData);
      
      // Update meet statistics
      const meetRef = doc(db, 'meets', meetId);
      batch.update(meetRef, {
        registrations: increment(1),
        updatedAt: Timestamp.fromDate(now),
      });
      
      // Commit the batch
      await batch.commit();
      
      return registration;
      
    } catch (error) {
      console.error('Error registering for meet:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get a specific user's registration for a meet
   */
  static async getUserRegistration(
    meetId: string, 
    userId: string
  ): Promise<MeetRegistration | null> {
    try {
      const registrationId = `${meetId}_${userId}`;
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      const registrationSnap = await getDoc(registrationRef);
      
      if (!registrationSnap.exists()) {
        return null;
      }
      
      const data = registrationSnap.data();
      return this.transformFirebaseRegistration(data);
      
    } catch (error) {
      console.error('Error getting user registration:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get all registrations for a meet (meet director view)
   */
  static async getMeetRegistrations(
    meetId: string,
    options: {
      status?: RegistrationStatus;
      limit?: number;
      orderBy?: 'registeredAt' | 'weightClass' | 'division';
    } = {}
  ): Promise<MeetRegistration[]> {
    try {
      const registrationsRef = collection(db, 'meets', meetId, 'registrations');
      
      let q = query(registrationsRef);
      
      // Add status filter if specified
      if (options.status) {
        q = query(q, where('registrationStatus', '==', options.status));
      }
      
      // Add ordering
      const orderField = options.orderBy || 'registeredAt';
      q = query(q, orderBy(orderField, 'asc'));
      
      // Add limit if specified
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      
      const querySnapshot = await getDocs(q);
      const registrations: MeetRegistration[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrations.push(this.transformFirebaseRegistration(data));
      });
      
      return registrations;
      
    } catch (error) {
      console.error('Error getting meet registrations:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Update registration status (meet director function)
   */
  static async updateRegistrationStatus(
    meetId: string,
    registrationId: string,
    status: RegistrationStatus,
    notes?: string
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        registrationStatus: status,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await updateDoc(registrationRef, cleanUndefinedValues(updateData));
      
      // If approving from pending, update meet revenue projection
      if (status === 'approved') {
        await this.updateMeetRevenue(meetId);
      }
      
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    meetId: string,
    registrationId: string,
    paymentStatus: PaymentStatus,
    paymentAmount?: number
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        paymentStatus,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      await updateDoc(registrationRef, cleanUndefinedValues(updateData));
      
      // Update meet revenue
      await this.updateMeetRevenue(meetId);
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Record weigh-in results (meet day function)
   */
  static async recordWeighIn(
    meetId: string,
    registrationId: string,
    actualWeight: number,
    passed: boolean,
    notes?: string
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        actualWeight,
        weightInStatus: passed ? 'passed' : 'failed',
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await updateDoc(registrationRef, cleanUndefinedValues(updateData));
      
    } catch (error) {
      console.error('Error recording weigh-in:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Withdraw from meet (athlete function)
   */
  static async withdrawFromMeet(
    meetId: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      const registrationId = `${meetId}_${userId}`;
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        registrationStatus: 'withdrawn',
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (reason) {
        updateData.notes = `Withdrawn: ${reason}`;
      }
      
      await updateDoc(registrationRef, cleanUndefinedValues(updateData));
      
      // Update meet statistics
      const batch = writeBatch(db);
      const meetRef = doc(db, 'meets', meetId);
      batch.update(meetRef, {
        registrations: increment(-1),
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error('Error withdrawing from meet:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get registration statistics for a meet
   */
  static async getRegistrationStats(meetId: string): Promise<RegistrationStats> {
    try {
      const registrations = await this.getMeetRegistrations(meetId);
      
      const stats: RegistrationStats = {
        totalRegistrations: registrations.length,
        approvedRegistrations: registrations.filter(r => r.registrationStatus === 'approved').length,
        pendingRegistrations: registrations.filter(r => r.registrationStatus === 'pending').length,
        waitlistedRegistrations: registrations.filter(r => r.registrationStatus === 'waitlisted').length,
        paidRegistrations: registrations.filter(r => r.paymentStatus === 'paid').length,
        totalRevenue: 0, // Will be calculated based on meet fee
        pendingRevenue: 0,
        averageWeight: 0, // No longer applicable since we don't collect expected weight
        divisionBreakdown: {},
        weightClassBreakdown: {},
        federationBreakdown: {},
        coachCount: registrations.filter(r => r.hasCoach).length,
      };
      
      // Calculate division and weight class breakdowns
      registrations.forEach(registration => {
        // Division breakdown
        stats.divisionBreakdown[registration.division] = 
          (stats.divisionBreakdown[registration.division] || 0) + 1;
        
        // Weight class breakdown
        stats.weightClassBreakdown[registration.weightClass] = 
          (stats.weightClassBreakdown[registration.weightClass] || 0) + 1;
        
        // Federation breakdown
        stats.federationBreakdown[registration.federationMembership.federation] = 
          (stats.federationBreakdown[registration.federationMembership.federation] || 0) + 1;
      });
      
      return stats;
      
    } catch (error) {
      console.error('Error getting registration stats:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get athlete's registration history
   */
  static async getAthleteRegistrations(userId: string): Promise<MeetRegistration[]> {
    try {
      // This requires a collection group query across all meets
      // For now, we'll implement this as a simpler approach
      // In production, you might want to maintain a user-registrations collection
      
      const registrations: MeetRegistration[] = [];
      
      // Note: This is a placeholder - you'll need to implement collection group queries
      // or maintain a separate user registrations collection for efficiency
      
      return registrations;
      
    } catch (error) {
      console.error('Error getting athlete registrations:', error);
      throw handleFirebaseError(error);
    }
  }
  
  // Private helper methods
  
  private static validateRegistrationData(formData: RegistrationFormData): void {
    // Validate required fields
    if (!formData.federationMembership.federation) {
      throw new Error('Federation is required');
    }
    if (!formData.federationMembership.membershipNumber) {
      throw new Error('Federation membership number is required');
    }
    if (!formData.federationMembership.expirationDate) {
      throw new Error('Federation membership expiration date is required');
    }
    
    // Check if federation membership is expired
    const expirationDate = new Date(formData.federationMembership.expirationDate);
    const today = new Date();
    if (expirationDate <= today) {
      throw new Error('Federation membership is expired');
    }
    
    // Validate competition details
    if (!formData.weightClass || !formData.division || !formData.equipment) {
      throw new Error('Competition details (weight class, division, equipment) are required');
    }
    
    // Validate emergency contact
    if (!formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship) {
      throw new Error('Complete emergency contact information is required');
    }
    
    // Validate coach info if hasCoach is true
    if (formData.hasCoach) {
      if (!formData.coachInfo?.coachName || !formData.coachInfo?.coachPhone) {
        throw new Error('Coach name and phone are required when coach is selected');
      }
    }
    
    // Validate agreements
    if (!formData.agreedToWaiver || !formData.agreedToRules) {
      throw new Error('You must agree to the waiver and rules');
    }
  }
  
  private static async validateMeetRegistration(meetId: string): Promise<void> {
    const meetRef = doc(db, 'meets', meetId);
    const meetSnap = await getDoc(meetRef);
    
    if (!meetSnap.exists()) {
      throw new Error('Meet not found');
    }
    
    const meetData = meetSnap.data();
    const now = new Date();
    
    // Check if registration is still open
    const registrationDeadline = meetData.registrationDeadline?.toDate();
    if (registrationDeadline && now > registrationDeadline) {
      throw new Error('Registration deadline has passed');
    }
    
    // Check if meet is published
    if (meetData.status !== 'published' && meetData.status !== 'registration-open') {
      throw new Error('Registration is not currently open for this meet');
    }
    
    // Check if meet is at capacity
    const maxParticipants = meetData.maxParticipants;
    const currentRegistrations = meetData.registrations || 0;
    if (maxParticipants && currentRegistrations >= maxParticipants) {
      throw new Error('This meet is at capacity');
    }
  }
  
  private static transformFirebaseRegistration(data: any): MeetRegistration {
    return {
      ...data,
      dateOfBirth: data.dateOfBirth?.toDate() || new Date(),
      registeredAt: data.registeredAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      federationMembership: {
        ...data.federationMembership,
        expirationDate: data.federationMembership.expirationDate?.toDate() || new Date(),
      },
    };
  }
  
  private static async updateMeetRevenue(meetId: string): Promise<void> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      const meetSnap = await getDoc(meetRef);
      
      if (!meetSnap.exists()) return;
      
      const meetData = meetSnap.data();
      const registrationFee = meetData.registrationFee || 0;
      
      // Get paid registrations count
      const paidRegistrations = await this.getMeetRegistrations(meetId);
      const paidCount = paidRegistrations.filter(r => r.paymentStatus === 'paid').length;
      const revenue = paidCount * registrationFee;
      
      await updateDoc(meetRef, {
        revenue,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
    } catch (error) {
      console.error('Error updating meet revenue:', error);
    }
  }
}
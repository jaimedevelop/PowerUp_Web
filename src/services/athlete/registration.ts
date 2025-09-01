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
  expectedWeight: number; // For flight organization, actual weight determined at weigh-ins
  
  // Personal Details (collected during registration - required)
  dateOfBirth: Date;
  gender: 'male' | 'female';
  emergencyContact: EmergencyContact;
  
  // Optional Competition Info
  personalRecords?: PersonalRecords;
  federationMembership?: FederationMembership;
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

export interface PersonalRecords {
  squat?: number;
  bench?: number;
  deadlift?: number;
  total?: number;
  // Optional: specific equipment PRs
  squatRaw?: number;
  benchRaw?: number;
  deadliftRaw?: number;
  totalRaw?: number;
}

export interface FederationMembership {
  federation: string;
  membershipNumber: string;
  expirationDate: Date;
}

export interface CoachInfo {
  coachName?: string;
  coachEmail?: string;
  coachPhone?: string;
  teamName?: string;
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
  // Competition choices
  weightClass: string;
  division: string;
  equipment: string;
  expectedWeight: number;
  
  // Personal information (required for first-time registration)
  dateOfBirth: string; // Will be converted to Date
  gender: 'male' | 'female';
  
  // Emergency contact (required)
  emergencyContact: EmergencyContact;
  
  // Optional information
  personalRecords?: Partial<PersonalRecords>;
  federationMembership?: Partial<FederationMembership>;
  coachInfo?: Partial<CoachInfo>;
  
  // Agreement/waivers
  agreedToWaiver: boolean;
  agreedToRules: boolean;
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
      
      // Generate registration ID
      const registrationId = `${meetId}_${userId}`;
      const now = new Date();
      
      // Create registration document
      const registration: MeetRegistration = {
        id: registrationId,
        meetId,
        userId,
        weightClass: formData.weightClass,
        division: formData.division,
        equipment: formData.equipment,
        expectedWeight: formData.expectedWeight,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        personalRecords: formData.personalRecords,
        federationMembership: formData.federationMembership ? {
          ...formData.federationMembership,
          expirationDate: new Date(formData.federationMembership.expirationDate!)
        } : undefined,
        coachInfo: formData.coachInfo,
        registrationStatus: 'pending',
        paymentStatus: 'unpaid',
        registeredAt: now,
        updatedAt: now,
      };
      
      // Use batch write to update both registration and meet stats
      const batch = writeBatch(db);
      
      // Add registration to subcollection
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      batch.set(registrationRef, {
        ...registration,
        dateOfBirth: Timestamp.fromDate(registration.dateOfBirth),
        registeredAt: Timestamp.fromDate(registration.registeredAt),
        updatedAt: Timestamp.fromDate(registration.updatedAt),
        federationMembership: registration.federationMembership ? {
          ...registration.federationMembership,
          expirationDate: Timestamp.fromDate(registration.federationMembership.expirationDate)
        } : undefined,
      });
      
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
      orderBy?: 'registeredAt' | 'expectedWeight' | 'weightClass';
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
      
      await updateDoc(registrationRef, updateData);
      
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
      
      await updateDoc(registrationRef, updateData);
      
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
      
      await updateDoc(registrationRef, updateData);
      
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
      
      await updateDoc(registrationRef, updateData);
      
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
        averageWeight: 0,
        divisionBreakdown: {},
        weightClassBreakdown: {},
      };
      
      // Calculate division and weight class breakdowns
      registrations.forEach(registration => {
        // Division breakdown
        stats.divisionBreakdown[registration.division] = 
          (stats.divisionBreakdown[registration.division] || 0) + 1;
        
        // Weight class breakdown
        stats.weightClassBreakdown[registration.weightClass] = 
          (stats.weightClassBreakdown[registration.weightClass] || 0) + 1;
      });
      
      // Calculate average expected weight
      const totalWeight = registrations.reduce((sum, r) => sum + r.expectedWeight, 0);
      stats.averageWeight = registrations.length > 0 ? totalWeight / registrations.length : 0;
      
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
      federationMembership: data.federationMembership ? {
        ...data.federationMembership,
        expirationDate: data.federationMembership.expirationDate?.toDate() || new Date(),
      } : undefined,
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
      const paidRegistrations = await this.getMeetRegistrations(meetId, {
        // Note: This would need to be implemented with proper querying
      });
      
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